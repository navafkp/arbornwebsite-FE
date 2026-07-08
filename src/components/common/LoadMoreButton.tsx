interface LoadMoreButtonProps {
  onClick: () => void;
  loadedCount: number;
  totalCount: number;
}

export default function LoadMoreButton({ onClick, loadedCount, totalCount }: LoadMoreButtonProps) {
  if (loadedCount >= totalCount) return null;

  return (
    <div className="mt-12 flex flex-col items-center gap-3">
      <p className="text-xs text-[var(--muted)]">
        Showing {loadedCount} of {totalCount} products
      </p>
      <button
        type="button"
        onClick={onClick}
        className="rounded-full border border-black/15 px-8 py-3 text-xs font-medium tracking-widest text-black uppercase transition hover:border-black"
      >
        Load More
      </button>
    </div>
  );
}
