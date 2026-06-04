import Link from 'next/link'

const pages = [
  { href: '/', label: 'Home' },
  { href: '/booking', label: 'Book a Field' },
  { href: '/academy', label: 'Football Academy' },
  { href: '/leagues', label: 'Leagues' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/account', label: 'My Account' },
  { href: '/auth/login', label: 'Sign In' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export default function SitemapPage() {
  return (
    <main className="bg-gray-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#3A8726FF]">Arena 03 Kilifi</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Sitemap</h1>
          <p className="text-gray-600">Find the main areas of the Arena 03 website.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="bg-white rounded-lg border border-gray-100 px-5 py-4 text-gray-800 font-medium shadow-sm hover:border-[#3A8726FF] hover:text-[#3A8726FF] transition-colors"
            >
              {page.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
