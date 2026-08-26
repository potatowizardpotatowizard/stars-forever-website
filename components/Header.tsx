"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Grain from "@/components/Grain";
import StarField from "@/components/StarField";
import { NAV, SITE_NAME } from "@/content/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Belt and braces: the menu is never left hanging over a freshly
  // loaded page, no matter how the navigation happened.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // the page behind the open menu holds still
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
          className="menu-overlay fixed inset-0 z-50 overflow-hidden lg:hidden"
        >
          {/* the galaxy behind the menu */}
          <StarField />
          <Grain />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-5 sm:px-8">
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
              <button
                type="button"
                className="meta-label -m-2 p-2 text-starlight"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-1 px-7 pb-16 sm:px-10">
              {NAV.map((item, i) => (
                <li
                  key={item.href}
                  className="menu-link"
                  style={{ animationDelay: `${0.08 + i * 0.07}s` }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`group flex items-center gap-4 py-3 font-display text-3xl font-bold ${
                      pathname === item.href ? "text-ember" : "text-starlight"
                    }`}
                  >
                    <Image
                      src="/brand/star-sharp.png"
                      alt=""
                      width={18}
                      height={18}
                      className={`vhs-glow h-[18px] w-[18px] transition-opacity ${
                        pathname === item.href ? "opacity-100" : "opacity-40"
                      }`}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="meta-label pb-8 text-center text-dust">
              Create eternity changing art
            </p>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
