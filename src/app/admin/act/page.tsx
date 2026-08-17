import { verifyActionToken } from "@/lib/actionTokens";
import { getInquiry } from "@/lib/inquiryReply";
import { ActClient } from "./ActClient";

/**
 * /admin/act — landing page for the signed one-tap links in the daily
 * digest. No login: the signed token in the URL is the auth (scoped to one
 * inquiry, one capability, expiring — see src/lib/actionTokens.ts).
 *
 * This GET only renders. Every mutation goes through a POST to
 * /api/admin/inquiries/act carrying the same token, so an email client
 * prefetching the link changes nothing.
 */

export const dynamic = "force-dynamic";

function one(v: string | string[] | undefined): string | null {
  return typeof v === "string" ? v : null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-6 py-12">
      <div className="max-w-[480px] w-full">{children}</div>
    </div>
  );
}

export default async function ActPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = verifyActionToken({
    id: one(sp.id),
    action: one(sp.action),
    exp: one(sp.exp),
    sig: one(sp.sig),
  });

  if (!token.valid) {
    return (
      <Shell>
        <div className="text-center">
          <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-4">
            Inquiry action
          </div>
          <h1 className="font-serif text-2xl text-white mb-2">
            Link expired or invalid
          </h1>
          <p className="text-white/40 text-sm">
            Digest links last two weeks and die when the admin key rotates.
            Use the pipeline instead:{" "}
            <a href="/admin/inquiries" className="text-seafoam">
              /admin/inquiries
            </a>
          </p>
        </div>
      </Shell>
    );
  }

  const inquiry = await getInquiry(token.id);
  if (!inquiry) {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="font-serif text-2xl text-white mb-2">
            Inquiry not found
          </h1>
          <p className="text-white/40 text-sm">
            It may have been deleted.{" "}
            <a href="/admin/inquiries" className="text-seafoam">
              Open the pipeline
            </a>
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <ActClient
        token={{
          id: token.id,
          action: token.action,
          exp: token.exp,
          sig: one(sp.sig)!,
        }}
        inquiry={{
          name: `${inquiry.first_name} ${inquiry.last_name || ""}`.trim(),
          email: String(inquiry.email || ""),
          course: String(inquiry.course || ""),
          status: String(inquiry.status || ""),
          preferred_dates: (inquiry.preferred_dates as string) || null,
          group_size: (inquiry.group_size as string) || null,
          parsed_headcount: (inquiry.parsed_headcount as number) ?? null,
          parsed_start_date: (inquiry.parsed_start_date as string) || null,
          parsed_end_date: (inquiry.parsed_end_date as string) || null,
          message: (inquiry.message as string) || null,
        }}
      />
    </Shell>
  );
}
