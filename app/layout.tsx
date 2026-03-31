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
    default: "RadFlow | Automação em Laudos Radiológicos para Clínicas",
    template: "%s | RadFlow"
  },
  description: "A revolução nos laudos radiológicos. Saia do editor de texto e ganhe extrema produtividade com nossa plataforma de automação especializada para radiologistas.",
  keywords: ["radiologia", "laudos", "automação", "produtividade médica", "saúde digital", "clínica de imagem", "software para laudos", "telerradiologia"],
  authors: [{ name: "RadFlow Team" }],
  creator: "RadFlow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: defaultUrl,
    title: "RadFlow | Automação em Laudos Radiológicos para Clínicas",
    description: "Transforme o fluxo de trabalho da sua clínica. Saia do editor de texto e ganhe extrema produtividade com automação avançada para laudos radiológicos padronizados.",
    siteName: "RadFlow",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "RadFlow - Automação Mágica em Laudos Radiológicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RadFlow | Automação em Laudos Radiológicos",
    description: "Saia do Microsoft Word e ganhe máxima produtividade com automação especializada para médicos radiologistas.",
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
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "RadFlow",
        "description": "Plataforma de automação focada em extrema produtividade projetada exclusivamente para radiologistas preencherem laudos mais rapidamente.",
        "applicationCategory": "MedicalBusinessApplication",
        "operatingSystem": "WebBrowser",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "128"
        },
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "BRL",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Organization",
        "name": "RadFlow",
        "url": defaultUrl,
        "logo": `${defaultUrl}/opengraph-image.png`
      }
    ]
  };

  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
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
