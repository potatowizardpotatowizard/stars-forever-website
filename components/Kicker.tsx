import StarMark from "@/components/StarMark";

// Small documentary style section label with the star motif.
export default function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="meta-label flex items-center gap-2.5">
      <StarMark className="h-2 w-2 text-ember" />
      {children}
    </p>
  );
}
