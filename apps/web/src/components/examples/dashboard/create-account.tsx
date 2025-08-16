"use client";

import GitHub from "@microboat/web/components/icons/social-media/github";
import Google from "@microboat/web/components/icons/social-media/google";
import { Button } from "@microboat/web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@microboat/web/components/ui/card";
import { Input } from "@microboat/web/components/ui/input";
import { Label } from "@microboat/web/components/ui/label";

export function CardsCreateAccount() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <GitHub />
            GitHub
          </Button>
          <Button variant="outline">
            <Google />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">Or continue with</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="email-create-account">Email</Label>
          <Input id="email-create-account" type="email" placeholder="m@example.com" />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password-create-account">Password</Label>
          <Input id="password-create-account" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  );
}
