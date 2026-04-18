import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "DropLyx | Luxury Price Tracking",
  description: "Advanced e-commerce price analytics and automated alerts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-slate-50 antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
