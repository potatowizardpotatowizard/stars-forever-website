"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SITE_NAME } from "@/content/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Belt and braces: the menu is never left hanging over a freshly
  // loaded page, no matter how the navigation happened.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The home page hero carries its own menu, like the brand page.
  if (pathname === "/") return null;

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
          aria-label={`${SITE_NAME} home`}
        >
          <Image
            src="/brand/star-sharp.png"
            alt=""
            width={34}
            height={34}
            className="vhs-glow"
          />
          <span className="mono-link text-sm font-bold">{SITE_NAME}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`mono-link text-xs ${
                    pathname === item.href ? "text-ember" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="meta-label -m-2 p-2 text-starlight lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-dust/20 bg-night/95 backdrop-blur lg:hidden"
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-5 py-6 sm:px-8">
            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="mono-link block py-2.5 text-lg"
              >
                Home
              </Link>
            </li>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`mono-link block py-2.5 text-lg ${
                    pathname === item.href ? "text-ember" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
