export function DuoMark({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="1.5" y="2.5" width="9" height="15" rx="2.4" fill="currentColor" opacity="0.9" />
        <rect x="9.5" y="2.5" width="9" height="15" rx="2.4" fill="currentColor" opacity="0.3" />
      </svg>
      {withWordmark ? (
        <span className="text-[15px] font-semibold tracking-[-0.02em]">Duo</span>
      ) : null}
    </span>
  );
}
