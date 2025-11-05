// src/app/layout.tsx
import "../styles/globals.css";

import { WalletProvider } from "../components/WalletContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <video autoPlay muted loop className="video-background">
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
