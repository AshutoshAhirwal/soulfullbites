import './style.css'; 
import './admin.css';

export const metadata = {
  title: 'SoulfullBites | Artisanal Chocolate Experience',
  description: 'Where immersive storytelling meets fine cocoa. Discover our handcrafted chocolate collections.',
  icons: {
    icon: '/assets/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="admin-body" style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
