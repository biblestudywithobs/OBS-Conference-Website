import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Lora } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "OBS Conference ’27",
  description:
    "Enter the Word. Find your place. OBS Conference ’27 — January 2, 2027, Ibadan, Nigeria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body
        className={`${bebas.variable} ${montserrat.variable} ${lora.variable} bg-cream font-sans text-ink antialiased`}
    >
        {children}
    </body>
    </html>
);
}