import "@/styles/globals.css";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
