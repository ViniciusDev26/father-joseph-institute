'use client';

import { useState } from 'react';

interface PixCopyProps {
  pixKey: string;
  content: { copy: string; copied: string };
}

export function PixCopy({ pixKey, content: c }: PixCopyProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 rounded-xl border border-bark/10 bg-cream px-4 py-3">
        <code className="flex-1 truncate text-sm text-bark">{pixKey}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-shrink-0 rounded-lg bg-terracotta px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-terracotta-dark"
        >
          {copied ? c.copied : c.copy}
        </button>
      </div>
    </div>
  );
}
