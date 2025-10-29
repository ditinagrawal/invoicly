"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { CircleCheckBigIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Form = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    try {
      setIsLoading(true);
      const { data } = await authClient.signIn.magicLink({
        email: email,
        callbackURL: "/dashboard",
        newUserCallbackURL: "/welcome",
        errorCallbackURL: "/error",
      });
      if (data?.status) {
        toast.success("Verification email sent to your inbox");
        setEmailSent(true);
        setTimeout(() => {
          setEmailSent(false);
        }, 10000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    } finally {
      setEmail("");
      setIsLoading(false);
    }
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="john.doe@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Please wait.." : "Continue"}
      </Button>
      {emailSent && (
        <Alert className="bg-emerald-600/20">
          <AlertTitle className="flex items-center gap-2 text-emerald-800">
            <CircleCheckBigIcon className="size-4" />
            Verification Email Sent
          </AlertTitle>
          <AlertDescription className="text-primary/60">
            Please check your inbox and click the link to login.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};
