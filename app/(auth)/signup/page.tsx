import SignUpForm from "./signup-form";

export const metadata = {
  title: "Sign Up - Simple",
  description: "Page description",
};

export default function SignUpPage() {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold">Create your account</h1>
      <SignUpForm />
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By signing up, you agree to the{" "}
          <a
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
