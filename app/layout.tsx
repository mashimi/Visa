import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/FireAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Visa Interview Simulator',
  description: 'AI-powered visa interview preparation tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}