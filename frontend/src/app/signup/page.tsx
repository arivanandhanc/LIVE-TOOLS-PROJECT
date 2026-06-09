import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free Arivu's Scrab Tools account to save your history, favorites and files.",
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center py-12">
      <AuthForm mode="signup" />
    </div>
  );
}
