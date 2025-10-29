"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const Form = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const trpc = useTRPC();
  const finishOnboarding = useMutation(
    trpc.user.finishOnboarding.mutationOptions(),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !address) return;
    try {
      finishOnboarding.mutate({ name, address });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    } finally {
      setName("");
      setAddress("");
    }
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label className="text-primary/80 text-sm font-medium">Full Name</Label>
        <Input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={finishOnboarding.isPending}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-primary/80 text-sm font-medium">Address</Label>
        <Input
          type="text"
          placeholder="123 Main St, Anytown, USA"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          disabled={finishOnboarding.isPending}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={finishOnboarding.isPending}
      >
        {finishOnboarding.isPending ? "Please wait.." : "Finish Onboarding"}
      </Button>
    </form>
  );
};
