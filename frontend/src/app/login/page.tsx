import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Arivu's Scrab Tools to access your file history, favorites and saved files.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center py-12">
      <AuthForm mode="login" />
    </div>
  );
}
