
import Navbar from '@/components/navigation/Navbar'
import './globals.css'
import { Montserrat } from 'next/font/google'
import Footer from '@/components/navigation/Footer'
import ClientProviders from '@/components/Providers/ClientProviders'
import { AuthProvider } from '../contexts/AuthContext'

const montserrat = Montserrat({ subsets: ['latin'] })


import { ReactNode } from 'react'

export default function RootLayout({
  children,
}: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#eab308" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalOrganization",
              "name": "Arena 03 Kilifi",
              "url": "https://arena03kilifi.com",
              "logo": "https://arena03kilifi.com/logo.webp",
              "description": "Premier football facility offering field bookings, academy training, and competitive leagues in Kilifi",
              "areaServed": [
                {
                  "@type": "Place",
                  "name": "Kilifi"
                },
                {
                  "@type": "Place", 
                  "name": "Kenya"
                },
                {
                  "@type": "Place",
                  "name": "East Africa"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Kenya",
                "addressRegion": "Kilifi"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Swahili"]
              },
              "serviceType": "Sports Facility Services",
              "sameAs": [
                "https://www.facebook.com/arena03kilifi/",
                "https://www.instagram.com/arena03kilifi/"
              ]
            })
          }}
        />
      </head>
      <body className={montserrat.className}>
        <AuthProvider>
          <ClientProviders>
            <Navbar />
            {children}
            <Footer />
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  )
}
