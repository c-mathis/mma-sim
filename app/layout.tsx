export const metadata = {
  title: 'MMA Sim - Professional Fight Management',
  description: 'Manage your MMA organization with realistic fight simulation',
}

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-sm border-b border-red-500/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-2">
                  <span className="text-2xl">🥊</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    MMA SIM
                  </h1>
                  <p className="text-xs text-gray-400">Professional Fight Management</p>
                </div>
              </a>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                  Home
                </a>
                <a href="/pool" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                  Fighter Pool
                </a>
                <a href="/contracts" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                  Contracts
                </a>
                <a href="/fight-card" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                  Fight Card
                </a>
                <a href="/results" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 px-4 py-2 rounded-lg font-semibold transition-all">
                  Results
                </a>
              </nav>

              {/* Mobile Menu Button */}
              <button className="md:hidden text-gray-300 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-black/30 border-t border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">© 2024 MMA Sim. Professional Fight Management.</p>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">Powered by Next.js</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

