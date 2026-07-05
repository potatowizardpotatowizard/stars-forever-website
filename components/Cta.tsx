import Link from "next/link";

const styles = {
  primary:
    "inline-block bg-ember px-7 py-3.5 font-body text-sm font-semibold tracking-wide text-night transition-colors hover:bg-starlight",
  ghost:
    "inline-block border border-dust/40 px-7 py-3.5 font-body text-sm font-semibold tracking-wide text-starlight transition-colors hover:border-ember hover:text-ember",
};

// Every call to action on the site. Buttons say exactly what happens.
export default function Cta({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  if (external) {
    return (
      <a
        href={href}
        className={styles[variant]}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={styles[variant]}>
      {children}
    </Link>
  );
}
