import { redirect } from "next/navigation";

// Legacy page route — redirect to the API route handler which can set cookies
export default function VerifyPage({ searchParams }: { searchParams: { token?: string } }) {
  const { token } = searchParams;
  redirect(token ? `/api/auth/verify?token=${token}` : "/portal?error=invalid");
}
