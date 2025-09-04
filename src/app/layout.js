import { Footer, HeaderServer } from "@/components";
import "./globals.css";
import AuthProvider from "@/provider/SessionProvider";
import { getServerSession } from "next-auth";
import Providers from "@/provider/Providers";
import "keen-slider/keen-slider.min.css";

export const metadata = {
  title: "Garments Store",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <AuthProvider session={session}>
        <body className="bg-gray-50 min-h-screen flex flex-col">
          <HeaderServer />
          <Providers>
            <main>{children}</main>
          </Providers>
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
