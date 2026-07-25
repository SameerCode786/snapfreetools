import "../src/styles/globals.css";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import CookieConsentProvider from "@/components/consent/CookieConsentProvider";
import { Inter, Manrope } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning={true}>
      <body className="flex flex-col min-h-screen text-slate-900 font-sans antialiased" suppressHydrationWarning={true}>
        <CookieConsentProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
