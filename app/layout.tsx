import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Cấu hình Font chữ (Giữ nguyên cũng được, đây là font mới rất đẹp của Vercel)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. SỬA PHẦN NÀY: Để đổi tên Tab trình duyệt
export const metadata: Metadata = {
  title: "My Postman Clone", // Tên hiển thị trên Tab
  description: "A simple API testing tool built with Next.js", // Mô tả cho SEO
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Đây là nơi page.tsx của bạn sẽ được hiển thị */}
        {children}
      </body>
    </html>
  );
}