import { getCurrent } from "@/features/auth/queries";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
  const user = await getCurrent();
  if (user) {
    return redirect("/");
  }
  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
