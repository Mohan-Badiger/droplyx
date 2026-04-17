import Link from "next/link";
import Image from "next/image";
import AuthButton from "./AuthButton";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src="/droplyxlogo.png"
              alt="DropLyx Logo"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/wishlist" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
              Wishlist
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
