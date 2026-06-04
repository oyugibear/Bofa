export default function PrivacyPage() {
  return (
    <main className="bg-gray-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#3A8726FF]">Arena 03 Kilifi</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600">
            We use your information to manage bookings, registrations, payments, team communications, and customer support.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
            <p>
              We may collect your name, email address, phone number, booking details, team details, payment references, and account activity when you use the website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">How We Use It</h2>
            <p>
              Your information helps us confirm reservations, communicate schedule changes, support team management, process payments, and improve Arena 03 services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p>
              For privacy questions, email us at info@arena03kilifi.com.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
