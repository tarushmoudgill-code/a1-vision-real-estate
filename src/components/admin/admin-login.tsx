"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, Lock, Mail, Loader2 } from "lucide-react";
import { useRouter } from "@/store/router";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AdminLogin() {
  const navigate = useRouter((s) => s.navigate);
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("admin@a1vision.com.au");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error || "Login failed");
      return;
    }
    toast.success("Welcome back!");
    navigate("admin/dashboard");
  }

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Left — premium brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="A1 Vision Real Estate luxury property"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="inline-block rounded-lg bg-white px-3.5 py-2 shadow-md">
            <Image src="/logo.png" alt="A1 Vision Real Estate" width={170} height={58} className="h-12 w-auto shrink-0 object-contain sm:h-14" />
          </div>

          <div className="max-w-md">
            <p className="font-serif text-4xl leading-tight">
              The staff portal for managing premium property.
            </p>
            <p className="mt-4 text-sm text-white/80">
              Listings, leads, inspections, agents, blog and analytics — all in
              one place. Authorised staff only.
            </p>
          </div>

          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} A1 Vision Real Estate. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex items-center justify-center bg-cream p-6 sm:p-12">
        <Card className="w-full max-w-md border-none shadow-luxe">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto rounded-lg bg-white px-3.5 py-2 shadow-sm lg:hidden">
              <Image src="/logo.png" alt="A1 Vision Real Estate" width={160} height={54} className="h-12 w-auto object-contain" />
            </div>
            <div>
              <h1 className="font-serif text-2xl">Staff Portal</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to access the administration dashboard.
              </p>
            </div>
          </CardHeader>

          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@a1vision.com.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="rounded-md border border-gold/40 bg-gold/10 p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Demo credentials</p>
                <p className="mt-1">
                  Email: <span className="font-mono">admin@a1vision.com.au</span>
                </p>
                <p>
                  Password: <span className="font-mono">admin123</span>
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardFooter>
          </form>

          <Separator className="my-2" />
          <CardFooter className="justify-center">
            <Link
              href="#/home"
              onClick={(e) => {
                e.preventDefault();
                navigate("home");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to website
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
