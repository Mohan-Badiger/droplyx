import Link from "next/link";
import Image from "next/image";
import AuthButton from "./AuthButton";

export default function Navbar() {
  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-250/60 shadow-xs sticky top-0 z-50 w-full transition-all duration-300">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300">
            <Image
              src="/droplyxlogo.png"
              alt="DropLyx Logo"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
