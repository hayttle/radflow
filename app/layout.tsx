import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "RadFlow | Inteligência em Laudos Radiológicos",
    template: "%s | RadFlow"
  },
  description: "A revolução nos laudos radiológicos. Saia do Word e ganhe produtividade com nossa plataforma automatizada para radiologistas.",
  keywords: ["radiologia", "laudos", "automação", "produtividade médica", "saúde digital", "clínica de imagem"],
  authors: [{ name: "RadFlow Team" }],
  creator: "RadFlow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: defaultUrl,
    title: "RadFlow | Inteligência em Laudos Radiológicos",
    description: "Transforme seu fluxo de trabalho manual em uma plataforma automatizada e segura. Laudos em minutos, não em horas.",
    siteName: "RadFlow",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "RadFlow - Inteligência em Laudos Radiológicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RadFlow | Inteligência em Laudos Radiológicos",
    description: "A revolução nos laudos radiológicos. Ganhe produtividade com nossa plataforma automatizada.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster
            richColors
            position="top-center"
            style={{ zIndex: 9999 }}
            className="pointer-events-auto"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
