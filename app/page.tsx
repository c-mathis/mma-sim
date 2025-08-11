// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            {/* Hero Content */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6">
                MMA SIM MVP
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Build your fight promotion empire. Scout fighters, negotiate contracts, and create legendary fight cards.
              </p>
              <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm">
                <span>🔥 Weekly Fighter Pool</span>
                <span>•</span>
                <span>💼 Contract Negotiations</span>
                <span>•</span>
                <span>🥊 Fight Simulation</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link href="/pool" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
                Start Building Your Roster
              </Link>
              <Link href="/results" className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold px-8 py-4 rounded-xl transition-all">
                View Demo Results
              </Link>
            </div>

            {/* Feature Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <Link href="/pool" className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-red-500/30 transition-all hover:transform hover:scale-105">
                <div className="text-red-400 text-3xl mb-4 group-hover:scale-110 transition-transform">🔥</div>
                <h3 className="text-white font-semibold text-lg mb-2">Fighter Pool</h3>
                <p className="text-gray-400 text-sm">Browse weekly fighter selections and make contract offers to build your roster.</p>
              </Link>

              <Link href="/contracts" className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/30 transition-all hover:transform hover:scale-105">
                <div className="text-blue-400 text-3xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                <h3 className="text-white font-semibold text-lg mb-2">Contracts</h3>
                <p className="text-gray-400 text-sm">Manage contract offers and track your signed fighters across different weeks.</p>
              </Link>

              <Link href="/fight-card" className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:transform hover:scale-105">
                <div className="text-purple-400 text-3xl mb-4 group-hover:scale-110 transition-transform">🎟️</div>
                <h3 className="text-white font-semibold text-lg mb-2">Fight Card</h3>
                <p className="text-gray-400 text-sm">Select up to 5 fighters from your roster to create the perfect main card lineup.</p>
              </Link>

              <Link href="/results" className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-orange-500/30 transition-all hover:transform hover:scale-105">
                <div className="text-orange-400 text-3xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-white font-semibold text-lg mb-2">Results</h3>
                <p className="text-gray-400 text-sm">Simulate realistic fights and see how your card performs with detailed analytics.</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple workflow to build your fight empire</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Scout Fighters</h3>
              <p className="text-gray-400 text-sm">Browse the weekly pool of available fighters with detailed stats and hype levels.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Make Offers</h3>
              <p className="text-gray-400 text-sm">Submit contract offers with base pay, bonuses, and fight roles to attract talent.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Build Card</h3>
              <p className="text-gray-400 text-sm">Select your signed fighters and organize them into a compelling fight card.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Simulate</h3>
              <p className="text-gray-400 text-sm">Watch realistic fight simulations and analyze your card's performance rating.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build Your Fight Empire?</h2>
          <p className="text-gray-400 text-lg mb-8">Start with the weekly fighter pool and create legendary fight cards.</p>
          <Link href="/pool" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold px-12 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}