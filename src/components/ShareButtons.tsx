"use client";

export function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const fullUrl = `https://lajollafreediveclub.com${url}`;
  const encoded = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    const btn = document.getElementById("copy-btn");
    if (btn) {
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy link"), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-[#5a6a7a] mr-1">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-deep/[0.06] flex items-center justify-center text-deep/40 text-xs font-medium hover:bg-teal hover:text-white transition-all no-underline"
        aria-label="Share on X"
      >
        X
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-deep/[0.06] flex items-center justify-center text-deep/40 text-xs font-medium hover:bg-teal hover:text-white transition-all no-underline"
        aria-label="Share on Facebook"
      >
        Fb
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-deep/[0.06] flex items-center justify-center text-deep/40 text-xs font-medium hover:bg-teal hover:text-white transition-all no-underline"
        aria-label="Share on LinkedIn"
      >
        In
      </a>
      <button
        id="copy-btn"
        onClick={copyLink}
        className="h-9 px-4 rounded-full bg-deep/[0.06] text-deep/40 text-xs font-medium hover:bg-teal hover:text-white transition-all cursor-pointer border-none"
      >
        Copy link
      </button>
    </div>
  );
}
