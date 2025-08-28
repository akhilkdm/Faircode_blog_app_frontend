"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <SessionProvider>
          <Navbar />
          <main className="max-w-4xl mx-auto p-4">{children}</main>
        </SessionProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
