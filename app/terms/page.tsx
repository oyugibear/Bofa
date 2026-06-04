export default function TermsPage() {
  return (
    <main className="bg-gray-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#3A8726FF]">Arena 03 Kilifi</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600">
            These terms outline the basic expectations for bookings, registrations, and facility use.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Bookings</h2>
            <p>
              Bookings are confirmed according to availability and payment status. Customers are responsible for selecting the correct date, time, field, and duration.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Facility Use</h2>
            <p>
              Visitors must respect the facility, staff, other players, and scheduled time slots. Arena 03 may adjust access when safety, maintenance, or operational needs require it.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Support</h2>
            <p>
              For help with bookings or account access, contact info@arena03kilifi.com.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
