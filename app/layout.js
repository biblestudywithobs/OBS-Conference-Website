import "./globals.css";

export const metadata = {
  title: "OBS Conference ’27",
  description: "Enter the Word. Find your place. OBS Conference ’27 — January 2, 2027, Ibadan, Nigeria. Registration is free.",
};

export const viewport = { themeColor: "#071B12" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
