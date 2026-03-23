import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import { Toaster } from "sonner";

export const metadata = {
  title: "Quarterly Review System – tor.ai",
  description: "Performance Evaluation & Review Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}