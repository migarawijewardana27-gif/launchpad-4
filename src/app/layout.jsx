import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';
import ScrollProgress from '../components/ScrollProgress';
import FloatingParticles from '../components/FloatingParticles';
import BackToTop from '../components/BackToTop';

export const metadata = {
  title: 'LaunchPad 4.0 | AIESEC in Sri Jayewardenepura',
  description: 'Join the most anticipated corporate simulation and career development event of the year, organized by AIESEC in USJ.',
  icons: {
    icon: '/icon white.png',
  },
  openGraph: {
    title: 'LaunchPad 4.0 | Step Into The Future',
    description: 'A premier career guidance program equipping and empowering Sri Lanka’s youth for the global stage.',
    url: 'https://launchpad.aiesecusj.com',
    siteName: 'LaunchPad 4.0',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/1SD0ZgJzIrODKu6KnQXIot16E0JNBPciR',
        width: 1200,
        height: 630,
        alt: 'LaunchPad 4.0 Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ScrollProgress />
          <PageLoader />
          <FloatingParticles />
          <Navbar />
          <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
            {children}
          </main>
          <Footer />
          <BackToTop />
        </CartProvider>
      </body>
    </html>
  );
}
