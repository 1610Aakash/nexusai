import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NexusAI | Customer support, with intelligence",
    template: "%s | NexusAI",
  },
  description:
    "Bring customer conversations, team workflows, and company knowledge together with NexusAI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white font-sans text-slate-950">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
