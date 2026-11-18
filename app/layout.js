import { Bebas_Neue, Montserrat, Lora } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--f-display" });
const mont = Montserrat({ subsets: ["latin"], variable: "--f-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--f-serif" });

export const metadata = {
  title: "OBS Conference ’27",
  description: "Bring your Bible. Bring your questions. Come as you are. January 2, 2027, Ibadan, Nigeria.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebas.variable} ${mont.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
