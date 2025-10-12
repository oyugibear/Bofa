import { Button } from 'antd'
import Link from 'next/link'
import React from 'react'

export default function CTALeague({ setRegistrationModalVisible }: { setRegistrationModalVisible: (visible: boolean) => void }) {
  return (
    <div className="mt-16 rounded-xl bg-gradient-to-r from-[#43A047] to-[#2E7D32] shadow-md p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 pointer-events-none"></div>

        <h2 className="text-2xl font-semibold mb-3 tracking-tight">
            Ready to Join the Competition?
        </h2>
        <p className="text-base text-green-50 mb-6 max-w-xl mx-auto leading-relaxed">
            Register your team today and compete in the most exciting football leagues 
            on the Kenyan coast. Professional organization, competitive play, and 
            amazing prizes await!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
            className="btn-primary"
            onClick={() => setRegistrationModalVisible(true)}
            >
                Register Your Team
            </Button>
            <Link href="/about">
                <Button
                    className="btn-primary w-full"
                >
                    Learn More
                </Button>
            </Link>
        </div>
    </div>


  )
}
