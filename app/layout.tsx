// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "./AppHeader";

export const metadata: Metadata = {
  title: "Quản lý bảo trì chiếu sáng",
  description: "Web app demo cho nhân viên bảo trì nhập sự cố",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppHeader />
        <main className="app-main">
          <div className="app-shell">{children}</div>
        </main>
      </body>
    </html>
  );
}
