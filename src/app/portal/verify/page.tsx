import { redirect } from "next/navigation";

// Legacy page route — redirect to the API route handler which can set cookies.
// searchParams is a Promise from Next 15 onward, so this is now async.
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  redirect(token ? `/api/auth/verify?token=${token}` : "/portal?error=invalid");
}
