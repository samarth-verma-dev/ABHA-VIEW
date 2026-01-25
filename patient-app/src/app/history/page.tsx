"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Hospital,
  Loader2,
  Stethoscope,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getAccessHistory, type AccessHistoryItem } from "../actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const AbhaIdSchema = z.object({
  patientAbhaId: z.string().min(1, "ABHA ID is required."),
});

export default function HistoryPage() {
  const [history, setHistory] = React.useState<AccessHistoryItem[] | null>(
    null
  );
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof AbhaIdSchema>>({
    resolver: zodResolver(AbhaIdSchema),
    defaultValues: {
      patientAbhaId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof AbhaIdSchema>) {
    setIsLoading(true);
    setHistory(null);
    setError(null);
    const result = await getAccessHistory(data.patientAbhaId);
    if (result.error) {
      setError(result.error);
      setHistory(null);
    } else {
      setHistory(result.history);
    }
    setIsLoading(false);
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            ABHA Access History
          </CardTitle>
          <CardDescription>
            View a log of when your ABHA ID was used to grant consent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-end gap-4 mb-6"
            >
              <FormField
                control={form.control}
                name="patientAbhaId"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Enter Your ABHA ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Your ABHA ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "View History"
                )}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
             <Alert variant="destructive" className="mt-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Fetching History</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {history && (
            <div>
              {history.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No access history found for this ABHA ID.</p>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Access Date & Time</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {item.doctorName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Hospital className="h-4 w-4 text-muted-foreground" />
                              <span>{item.hospitalName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(item.consentGrantedAt),
                              "dd MMM yyyy, hh:mm a"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                item.sessionStatus === "Active"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-accent text-accent-foreground"
                              }`}
                            >
                              {item.sessionStatus === "Active" ? (
                                <ShieldAlert className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              <span>{item.sessionStatus}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
