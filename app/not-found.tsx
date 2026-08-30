import Image from "next/image";
import Cta from "@/components/Cta";
import StarField from "@/components/StarField";

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
      <StarField />
      <div className="relative px-5 text-center">
        <Image
          src="/brand/star-smeared.png"
          alt=""
          width={72}
          height={72}
          className="vhs-glow vhs-flicker mx-auto"
        />
        <p className="meta-label mt-10">Error 404</p>
        <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">
          This page burned up on entry.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-starlight/70">
          Whatever you were looking for is not out here. The rest of the sky
          still is.
        </p>
        <div className="mt-10">
          <Cta href="/">Jump back home</Cta>
        </div>
      </div>
    </section>
  );
}
