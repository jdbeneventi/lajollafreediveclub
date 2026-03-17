"use client";

import { useState, ReactNode } from "react";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors text-sm";

export function Input({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && "*"}
      </label>
      <input required={required} className={inputClass} {...props} />
    </div>
  );
}

export function Select({
  label,
  required,
  options,
  ...props
}: {
  label: string;
  required?: boolean;
  options: string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && "*"}
      </label>
      <select required={required} className={inputClass} {...props}>
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <textarea rows={4} className={`${inputClass} resize-none`} {...props} />
    </div>
  );
}

export function SuccessState({ message }: { message?: string }) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B6B6B" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-serif text-3xl mb-4">You&apos;re on the list!</h2>
      <p className="text-[#5a6a7a] leading-relaxed">
        {message || "We'll be in touch within 24 hours. In the meantime, check out our "}
        {!message && (
          <>
            <a href="/conditions" className="text-teal no-underline hover:underline">
              live conditions
            </a>
            {" or "}
            <a href="/blog" className="text-teal no-underline hover:underline">
              journal
            </a>
            .
          </>
        )}
      </p>
    </div>
  );
}

export function FormShell({
  action,
  formType,
  children,
  onSuccess,
}: {
  action: string;
  formType: string;
  children: ReactNode;
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("_form_type", formType);

    try {
      const res = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        onSuccess();
      } else {
        alert("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      alert("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-12 space-y-6">
      {children}
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full justify-center text-center disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send It →"}
      </button>
      <p className="text-xs text-center text-[#5a6a7a]">
        We&apos;ll respond within 24 hours. No spam, no pressure.
      </p>
    </form>
  );
}
