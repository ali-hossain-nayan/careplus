import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes";



export const metadata: Metadata = {
  title: "MediCare",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{  
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <body
        className={cn('min-h-screen bg-dark-300 font-sans antialiased')}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
