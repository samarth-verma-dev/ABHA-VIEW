"use client";

import { useState, useEffect, useTransition } from 'react';
import { useUser, useAuth, useFirestore } from '@/hooks/use-firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot, serverTimestamp, orderBy, limit, Timestamp } from 'firebase/firestore';
import { startOfDay, endOfDay } from 'date-fns';

import type { Doctor, Session, MedicalRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, User, Hospital, FileText, Verified, Clock, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const abhaSchema = z.object({
  patientAbhaId: z.string().min(1, { message: 'ABHA ID is required.' }),
});

export default function DashboardPage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [todaysPatients, setTodaysPatients] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, startSummaryTransition] = useTransition();

  const form = useForm<z.infer<typeof abhaSchema>>({
    resolver: zodResolver(abhaSchema),
    defaultValues: { patientAbhaId: '' },
  });

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      router.push('/');
    }
  };

  useEffect(() => {
    if (!user || !db) return;

    const fetchDoctorProfile = async () => {
      const docRef = doc(db, 'doctors', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
      } else {
        toast({ variant: 'destructive', title: 'Profile not found' });
      }
    };

    fetchDoctorProfile();
  }, [user, db, toast]);
  
  useEffect(() => {
    if (!user || !db) return;
    setLoading(true);
    const q = query(collection(db, 'sessions'), where('doctorId', '==', user.uid), where('sessionActive', '==', true), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const sessionData = snapshot.docs[0].data() as Omit<Session, 'id'>;
        const sessionId = snapshot.docs[0].id;
        setSession({ ...sessionData, id: sessionId });
      } else {
        setSession(null);
        setRecords([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Session listener error:", error);
      toast({ variant: 'destructive', title: 'Error listening to session' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, db, toast]);

  useEffect(() => {
    if (session?.consentStatus === 'granted' && session.patientAbhaId && db) {
      const recordsQuery = query(collection(db, 'records'), where('patientAbhaId', '==', session.patientAbhaId));
      const unsubscribe = onSnapshot(recordsQuery, (snapshot) => {
        const fetchedRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicalRecord));
        const sortedRecords = fetchedRecords.sort((a, b) => (b.date?.seconds ?? 0) - (a.date?.seconds ?? 0));
        setRecords(sortedRecords);
      }, (error) => {
        console.error("Medical records listener error:", error);
        toast({ variant: 'destructive', title: 'Error fetching medical records.' });
      });
      return () => unsubscribe();
    }
  }, [session, db]);
  
  useEffect(() => {
    if (!user || !db) return;

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const q = query(
      collection(db, 'sessions'),
      where('doctorId', '==', user.uid),
      where('sessionActive', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allInactiveSessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
      const patients = allInactiveSessions
        .filter(p => {
            if (!p.createdAt) return false;
            const createdAtDate = new Date(p.createdAt.seconds * 1000);
            return createdAtDate >= todayStart && createdAtDate <= todayEnd;
        })
        .sort((a,b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setTodaysPatients(patients);
    }, (error) => {
        console.error("Todays patients listener error:", error);
        toast({ variant: 'destructive', title: 'Error fetching today\'s patients' });
    });

    return () => unsubscribe();
  }, [user, db, toast]);

  const handleStartSession = async (values: z.infer<typeof abhaSchema>) => {
    if (!user || !doctor || !db) return;
    
    if (!values.patientAbhaId || values.patientAbhaId.trim().length < 5) {
      toast({
        variant: 'destructive',
        title: 'Invalid ABHA ID',
        description: 'Please enter a valid ABHA ID',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'sessions'), {
        doctorId: user.uid,
      
        doctorName: doctor.doctorName,
        hospital: doctor.doctorHospital,
        patientAbhaId: values.patientAbhaId,
        consentStatus: 'requested',
        sessionActive: true,
        createdAt: serverTimestamp(),
      });      
      
      form.reset();
    } catch (error) {
      console.error("Error starting session:", error);
      toast({ variant: 'destructive', title: 'Failed to start session' });
    }
  };

  const handleEndSession = async () => {
    if (!session || !db) return;
    try {
      await updateDoc(doc(db, 'sessions', session.id), { sessionActive: false });
      setSession(null);
      setRecords([]);
      setSummary(null);
      toast({ title: 'Session Ended', description: 'The consultation session has been closed.' });
    } catch (error) {
      console.error("Error ending session:", error);
      toast({ variant: 'destructive', title: 'Failed to end session' });
    }
  };
  
  const handleGenerateSummary = () => {
    if (!records.length || !session) return;
    startSummaryTransition(async () => {
      try {
        const serializableRecords = records.map(r => ({...r, date: new Date((r.date?.seconds ?? 0) * 1000).toISOString()}));
        // const result = await generateSummaryForPatientRecords({
        //   patientAbhaId: session.patientAbhaId,
        //   medicalRecords: serializableRecords
        // });
        // setSummary(result.summary);
      } catch (error) {
        console.error("Error generating summary:", error);
        toast({ variant: 'destructive', title: 'AI Summary Failed', description: 'Could not generate patient summary.' });
      }
    });
  };

  const maskAbhaId = (id: string) => {
    if (!id || id.length <= 4) {
      return '**** **** ****';
    }
    const last4 = id.slice(-4);
    return `**** **** ${last4}`;
  };

  const getSessionStatus = (s: Session) => {
    if (s.consentStatus === 'granted') {
      return <Badge variant="secondary">Completed</Badge>;
    }
    if (s.consentStatus === 'denied') {
      return <Badge variant="destructive">Denied</Badge>;
    }
    return <Badge variant="outline">Cancelled</Badge>;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">ABHA-View</h1>
            </div>
            <div className="flex items-center space-x-4">
              {doctor && (
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm flex items-center gap-2"><User size={14}/> {doctor.doctorName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2"><Hospital size={14} /> {doctor.doctorHospital}</p>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="active-session" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
              <TabsTrigger value="active-session">Active Session</TabsTrigger>
              <TabsTrigger value="todays-patients">Today's Patients</TabsTrigger>
            </TabsList>
            <TabsContent value="active-session" className="mt-6">
              {!session ? (
                <Card className="max-w-lg mx-auto shadow-lg">
                  <CardHeader>
                    <CardTitle>Start New Consultation</CardTitle>
                    <CardDescription>Enter the patient's ABHA ID to begin a secure session.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleStartSession)} className="flex items-start space-x-2">
                        <FormField
                          control={form.control}
                          name="patientAbhaId"
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormLabel className="sr-only">Patient ABHA ID</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., demo-abha-1234" {...field} className="font-code" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting} className="bg-accent hover:bg-accent/90">
                          {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              ) : session.consentStatus === 'requested' ? (
                <Card className="max-w-lg mx-auto text-center shadow-lg">
                  <CardHeader>
                    <CardTitle>Awaiting Patient Consent</CardTitle>
                    <CardDescription>Patient ABHA ID: <span className="font-code text-accent">{session.patientAbhaId}</span></CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">The patient needs to grant consent on their device.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="destructive" className="w-full" onClick={handleEndSession}>Cancel Session</Button>
                  </CardFooter>
                </Card>
              ) : (
                <div>
                  <Card className="mb-6 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Patient Medical Records</CardTitle>
                        <CardDescription>ABHA ID: <span className="font-code text-accent">{session.patientAbhaId}</span></CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={handleGenerateSummary} disabled={isSummaryLoading}>
                              {isSummaryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4"/>}
                              AI Summary
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><Bot /> AI Generated Summary</DialogTitle>
                                <DialogDescription>
                                  This is an AI-generated summary of the patient's records. Always verify with the original documents.
                                </DialogDescription>
                              </DialogHeader>
                              {isSummaryLoading ? (
                                <div className="flex justify-center items-center h-40">
                                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                              ) : summary ? (
                                <div className="prose prose-sm max-w-none max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4">
                                  {summary}
                                </div>
                              ) : (
                                <div className="flex justify-center items-center h-40 flex-col gap-2 text-muted-foreground">
                                  <AlertCircle />
                                  <p>No summary generated yet or an error occurred.</p>
                                </div>
                              )}
                              <DialogFooter>
                                  <Button variant="secondary" onClick={() => setSummary(null)}>Close</Button>
                              </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={handleEndSession}>End Session</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {records.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead><FileText className="inline-block h-4 w-4 mr-1" />Type</TableHead>
                              <TableHead><Clock className="inline-block h-4 w-4 mr-1" />Date</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {records.map((record) => (
                              <TableRow key={record.id}>
                                <TableCell className="font-medium">{record.type}</TableCell>
                                <TableCell>{new Date(record.date.seconds * 1000).toLocaleDateString()}</TableCell>
                                <TableCell>{record.details}</TableCell>
                                <TableCell className="text-right">
                                  {record.verified && <Badge variant="default" className="bg-accent hover:bg-accent/90"><Verified className="h-3 w-3 mr-1" />Verified</Badge>}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <p>No medical records found for this patient.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            <TabsContent value="todays-patients" className="mt-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Today's Patients</CardTitle>
                  <CardDescription>
                    An overview of patients consulted today. This is a read-only audit log.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todaysPatients.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Identifier</TableHead>
                          <TableHead>Consultation Time</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {todaysPatients.map((p_session) => (
                          <TableRow key={p_session.id}>
                            <TableCell className="font-code">{maskAbhaId(p_session.patientAbhaId)}</TableCell>
                            <TableCell>{p_session.createdAt ? new Date(p_session.createdAt.seconds * 1000).toLocaleTimeString() : 'N/A'}</TableCell>
                            <TableCell className="text-right">{getSessionStatus(p_session)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No completed sessions today.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

// This function does not exist in the file, but is referenced.
// Adding it here for context, but it should not be in the final file.
// declare function generateSummaryForPatientRecords(data: {
//   patientAbhaId: string;
//   medicalRecords: any[];
// }): Promise<{ summary: string }>;
    