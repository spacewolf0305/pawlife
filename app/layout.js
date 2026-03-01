import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "PawLife — Your Pet's Digital Home",
  description:
    "Track your pet's health, find lost pets, connect with the pet community, and discover nearby services. The all-in-one app for pet parents.",
  keywords: ["pets", "pet health", "lost pets", "pet community", "vet finder"],
  openGraph: {
    title: "PawLife — Your Pet's Digital Home",
    description: "The all-in-one app for pet parents.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
