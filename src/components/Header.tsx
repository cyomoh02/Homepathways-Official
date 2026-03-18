import Link from "next/link";
import ClaireButton from "./ClaireButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — empty for balance */}
        <div className="hidden w-64 sm:block" />

        {/* Center — Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-xl font-bold tracking-[0.25em] text-white sm:text-2xl"
        >
          HOMEPATHWAYS
        </Link>

        {/* Right — Claire CTA */}
        <div className="ml-auto hidden sm:flex">
          <ClaireButton
            label="Click Here To Speak with Claire. No Phone Numbers Needed"
            className="px-4 py-2 text-xs"
          />
        </div>

        {/* Mobile Claire CTA */}
        <div className="ml-auto sm:hidden">
          <ClaireButton label="Talk to Claire" compact />
        </div>
      </div>
    </header>
  );
}
