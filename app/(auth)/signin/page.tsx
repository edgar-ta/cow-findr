import Link from "next/link";
import SignInForm from "./signin-form";

export const metadata = {
  title: "Sign In - Simple",
  description: "Page description",
};

export default function SignInPage() {

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Sign in to your account</h1>
      </div>

      <SignInForm />
      
      <div className="mt-6 text-center">
        <Link
          className="text-sm text-gray-700 underline hover:no-underline"
          href="/reset-password"
        >
          Forgot password
        </Link>
      </div>
    </>
  );
}
