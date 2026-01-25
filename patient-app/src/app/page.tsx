"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, KeyRound, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { checkConsentRequest, grantConsent } from "./actions";

const AbhaIdSchema = z.object({
  patientAbhaId: z
    .string()
    .min(1, "ABHA ID is required."),
});

const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits.")
    .regex(/^\d{6}$/, "OTP must be numeric."),
});

type Step = "ID_INPUT" | "OTP_INPUT" | "SUCCESS";

export default function Home() {
  const [step, setStep] = React.useState<Step>("ID_INPUT");
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [isChecking, setIsChecking] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const { toast } = useToast();

  const abhaForm = useForm<z.infer<typeof AbhaIdSchema>>({
    resolver: zodResolver(AbhaIdSchema),
    defaultValues: {
      patientAbhaId: "",
    },
  });

  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onAbhaSubmit(data: z.infer<typeof AbhaIdSchema>) {
    setIsChecking(true);
    const result = await checkConsentRequest(data.patientAbhaId);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.sessionId) {
      setSessionId(result.sessionId);
      setStep("OTP_INPUT");
    }
    setIsChecking(false);
  }

  async function onOtpSubmit(data: z.infer<typeof OtpSchema>) {
    if (data.otp !== "123456") {
      otpForm.setError("otp", {
        type: "manual",
        message: "Incorrect OTP. Please try again.",
      });
      return;
    }

    if (!sessionId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Session not found. Please start over.",
      });
      setStep("ID_INPUT");
      return;
    }

    setIsVerifying(true);
    const result = await grantConsent(sessionId);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.success) {
      setStep("SUCCESS");
    }
    setIsVerifying(false);
  }

  const resetFlow = () => {
    setStep("ID_INPUT");
    setSessionId(null);
    abhaForm.reset();
    otpForm.reset();
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <div className="flex w-full items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">ConsentConnect</CardTitle>
          <CardDescription>
            Securely grant access to your medical records.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <AnimatePresence mode="wait">
            {step === "ID_INPUT" && (
              <motion.div
                key="id_input"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Form {...abhaForm}>
                  <form
                    onSubmit={abhaForm.handleSubmit(onAbhaSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={abhaForm.control}
                      name="patientAbhaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient ABHA ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your ABHA ID"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isChecking}>
                      {isChecking ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Check Consent Request"
                      )}
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                  <p className="text-muted-foreground">
                    Don&apos;t have an ABHA ID?{' '}
                    <a
                      href="https://abha.abdm.gov.in/abha/v3/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Create one here
                    </a>
                  </p>
                </div>
              </motion.div>
            )}

            {step === "OTP_INPUT" && (
              <motion.div
                key="otp_input"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <div className="flex flex-col items-center text-center mb-6">
                    <KeyRound className="h-8 w-8 text-primary mb-2"/>
                    <h3 className="text-xl font-semibold">Enter OTP</h3>
                    <p className="text-muted-foreground text-sm">An OTP has been sent to your registered device. (Demo: 123456)</p>
                </div>
                <Form {...otpForm}>
                  <form
                    onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>One-Time Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter 6-digit OTP"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isVerifying}>
                       {isVerifying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Verify & Grant Consent"
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
            
            {step === "SUCCESS" && (
                <motion.div
                key="success"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="flex flex-col items-center justify-center text-center space-y-4 py-8"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent">
                    <CheckCircle2 className="h-12 w-12 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-bold font-headline text-accent-foreground">Consent Granted!</h2>
                <p className="text-muted-foreground">
                  You have successfully granted access for this consultation.
                </p>
                <Button onClick={resetFlow} variant="outline" className="mt-4">
                  End Session
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">Your privacy is our priority.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
