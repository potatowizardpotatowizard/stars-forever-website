import Link from "next/link";

// Body copy convention: every mention of Category 3 links to the page
// that explains it. Headers and menu labels stay plain.
export function linkCategory3(text: string): React.ReactNode {
  const parts = text.split("Category 3");
  if (parts.length === 1) return text;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <Link
            key={`c3-${i}`}
            href="/category-3"
            className="text-ember transition-colors hover:text-starlight"
          >
            Category 3
          </Link>,
          part,
        ],
  );
}
