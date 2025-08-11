// app/contracts/page.tsx
'use client';
import { useEffect, useState } from 'react';

export default function ContractsPage() {
  // ---- Week handling ----
  const [week, setWeek] = useState<number>(1);
  useEffect(() => {
    const savedWeek = Number(localStorage.getItem('week') || 1);
    setWeek(Number.isFinite(savedWeek) && savedWeek > 0 ? savedWeek : 1);
  }, []);
  useEffect(() => {
    localStorage.setItem('week', String(week));
  }, [week]);

  const [offers, setOffers] = useState<any[]>([]);
  const [signed, setSigned] = useState<any[]>([]);

  useEffect(() => {
    try {
      setOffers(JSON.parse(localStorage.getItem(`offers:w${week}`) || '[]'));
      setSigned(JSON.parse(localStorage.getItem(`signed:w${week}`) || '[]'));
    } catch {}
  }, [week]);

  const clearAll = () => {
    localStorage.removeItem(`offers:w${week}`);
    localStorage.removeItem(`signed:w${week}`);
    setOffers([]);
    setSigned([]);
  };

  // Week navigation
  const prevWeek = () => setWeek(w => Math.max(1, w - 1));
  const nextWeek = () => setWeek(w => w + 1);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Week header + nav */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
            Contract Management
          </h1>
          <p className="text-gray-400 mt-1">Week {String(week).padStart(2, '0')} • Track your offers and signings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={prevWeek} 
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
          >
            <span>←</span>
            <span>Previous</span>
          </button>
          <button 
            onClick={nextWeek} 
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Submitted Offers */}
        <section>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-blue-400">📋</span>
                <span>Submitted Offers</span>
              </h2>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                {offers.length} active
              </span>
            </div>
            
            {offers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-4">No offers submitted yet</p>
                <a href="/pool" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-all">
                  <span>Go to Fighter Pool</span>
                  <span>→</span>
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {offers.map((o, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{o.fighterName}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-green-400 font-mono text-sm">${o.basePay} base</span>
                          <span className="text-gray-400">+</span>
                          <span className="text-yellow-400 font-mono text-sm">${o.bonus} bonus</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        o.role === 'main-event' ? 'bg-yellow-500/20 text-yellow-300'
                        : o.role === 'co-main' ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {o.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Signed Fighters */}
        <section>
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-green-400">✅</span>
                <span>Signed Fighters</span>
              </h2>
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                {signed.length} signed
              </span>
            </div>
            
            {signed.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-green-500/30 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-4">No signed fighters yet</p>
                <p className="text-green-300 text-sm">
                  Submit offers and hit "Resolve Contracts" on the pool page
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {signed.map((s, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div>
                          <h3 className="text-white font-semibold">{s.fighterName}</h3>
                          <span className="text-green-400 font-mono text-sm">${s.basePay}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        s.role === 'main-event' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : s.role === 'co-main' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {s.role.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {signed.length > 0 && (
              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 text-sm">
                  🎯 <strong>Next Step:</strong> Visit the <a href="/fight-card" className="underline hover:text-blue-200">Fight Card</a> page to build your main card.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      {(offers.length > 0 || signed.length > 0) && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={clearAll} 
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All Data</span>
          </button>
        </div>
      )}
    </main>
  );
}