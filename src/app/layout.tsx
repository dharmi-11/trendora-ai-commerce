import type { Metadata } from "next";

import { ChatbotAssistant } from "@/components/ai/chatbot-assistant";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Trendora | AI-Assisted Fashion Commerce",
  description: "Trendora is a premium AI-assisted e-commerce web application focused on user-centric fashion and lifestyle shopping.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen">
            <Header />
            <main>{children}</main>
            <Footer />
            <ChatbotAssistant />
          </div>
        </Providers>
      </body>
    </html>
  );
}
