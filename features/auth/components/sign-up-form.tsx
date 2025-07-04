"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import authLogo from "@/assets/auth-logo.png";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader } from "lucide-react";
import { signUpSchema } from "../schemas";
import { useRegister } from "../api/use-register";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    mutate(data, {
      onSuccess: (data) => {
        console.log("User registered successfully:", data);
      },
      onError: (error) => {
        console.error("Error registering user:", error);
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Sign Up</h1>
                  <p className="text-balance text-muted-foreground">
                    Create your{" "}
                    <span className="font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Planova
                    </span>{" "}
                    account within seconds
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your name"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            className="w-full shadow-none rounded-full focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your email"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            className="w-full shadow-none rounded-full focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              className="w-full pr-10 shadow-none rounded-full focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck="false"
                              disabled={isPending}
                            />
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isPending}
                              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 cursor-pointer"
                            >
                              {showPassword ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  variant={"secondary"}
                  className="w-full cursor-pointer rounded-full bg-blue-500 text-white shadow-none hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-background"
                  disabled={isPending}
                >
                  {
                    isPending ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      "Register"
                    )
                  }
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full shadow-none cursor-pointer rounded-full"
                    disabled={isPending}
                    onClick={() => signUpWithGoogle()}
                  >
                    <FcGoogle className="h-4 w-4" />
                    <span className="sr-only">Continue with Google</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full shadow-none cursor-pointer rounded-full"
                    disabled={isPending}
                    onClick={() => signUpWithGithub()}
                  >
                    <FaGithub className="h-4 w-4" />
                    <span className="sr-only">Continue with GitHub</span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    prefetch={false}
                    className="underline text-blue-500 hover:text-blue-600"
                  >
                    Sing in
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="relative hidden md:block h-full border-l border-border">
            <Image
              src={authLogo}
              alt="Auth Logo"
              fill
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
