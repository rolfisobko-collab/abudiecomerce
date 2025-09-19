import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "AbudiCell - E-Commerce",
  description: "E-Commerce con Next.js - AbudiCell",
  icons: {
    icon: '/abudilogo.jpg',
    shortcut: '/abudilogo.jpg',
    apple: '/abudilogo.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`} >
        <Providers>
          <Toaster />
          <CurrencyProvider>
            <AppContextProvider>
              {children}
            </AppContextProvider>
          </CurrencyProvider>
        </Providers>
      </body>
    </html>
  );
}
