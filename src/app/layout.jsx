import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';
import ScrollProgress from '../components/ScrollProgress';
import FloatingParticles from '../components/FloatingParticles';
import BackToTop from '../components/BackToTop';

export const metadata = {
  title: 'LaunchPad 4.0',
  description: 'LaunchPad 4.0 AIESEC Event',
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
