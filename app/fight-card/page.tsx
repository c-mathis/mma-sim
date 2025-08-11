// app/fight-card/page.tsx
'use client';
import { useEffect, useState } from 'react';

export default function FightCardPage() {
  // ---- Week handling ----
  const [week, setWeek] = useState<number>(1);
  useEffect(() => {
    const savedWeek = Number(localStorage.getItem('week') || 1);
    setWeek(Number.isFinite(savedWeek) && savedWeek > 0 ? savedWeek : 1);
  }, []);
  useEffect(() => {
    localStorage.setItem('week', String(week));
  }, [week]);

  const [signed, setSigned] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    try {
      setSigned(JSON.parse(localStorage.getItem(`signed:w${week}`) || '[]'));
      setSelected(JSON.parse(localStorage.getItem(`card:w${week}`) || '[]'));
    } catch {}
  }, [week]);

  const togglePick = (name: string) => {
    setSelected(prev => {
      const next = prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
      localStorage.setItem(`card:w${week}`, JSON.stringify(next.slice(0, 5)));
      return next.slice(0, 5);
    });
  };

  // Week navigation
  const prevWeek = () => setWeek(w => Math.max(1, w - 1));
  const nextWeek = () => setWeek(w => w + 1);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Week header + nav */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">
            Build Your Fight Card
          </h1>
          <p className="text-gray-400 mt-1">Week {String(week).padStart(2, '0')} • Select up to 5 fighters for your main card</p>
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

      {signed.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-12 max-w-md mx-auto">
            <div className="text-gray-500 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No Signed Fighters</h3>
            <p className="text-gray-400 mb-6">You need to sign fighters before building your fight card.</p>
            <a href="/pool" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-all">
              <span>Go to Fighter Pool</span>
              <span>→</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Fighters */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <span className="text-blue-400">👥</span>
                <span>Available Fighters</span>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                  {signed.length} signed
                </span>
              </h2>
              
              <div className="space-y-3">
                {signed.map((s: any, i: number) => {
                  const checked = selected.includes(s.fighterName);
                  const isDisabled = !checked && selected.length >= 5;
                  
                  return (
                    <div key={i} className={`relative bg-gray-900/50 rounded-lg p-4 border transition-all cursor-pointer ${
                      checked ? 'border-green-500/50 bg-green-900/20' 
                      : isDisabled ? 'border-gray-600 opacity-50' 
                      : 'border-gray-600 hover:border-gray-500'
                    }`}>
                      <label className="flex items-center space-x-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePick(s.fighterName)}
                          disabled={isDisabled}
                          className="w-5 h-5 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold text-lg">{s.fighterName}</h3>
                            <div className="flex items-center space-x-3">
                              <span className="text-green-400 font-mono text-sm">${s.basePay}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                s.role === 'main-event' ? 'bg-yellow-500/20 text-yellow-300'
                                : s.role === 'co-main' ? 'bg-orange-500/20 text-orange-300'
                                : 'bg-gray-500/20 text-gray-300'
                              }`}>
                                {s.role.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {checked && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-green-500 rounded-full p-1">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Fight Card */}
          <div>
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <span className="text-purple-400">🎟️</span>
                <span>Fight Card</span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                  {selected.length}/5
                </span>
              </h2>
              
              {selected.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Select fighters to build your card</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {selected.map((fighterName, idx) => {
                    const fightOrder = ['Main Event', 'Co-Main Event', 'Undercard', 'Undercard', 'Undercard'];
                    
                    return (
                      <div key={fighterName} className="bg-gray-900/50 rounded-lg p-3 border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-purple-300 text-xs font-medium mb-1">
                              {fightOrder[idx] || 'Undercard'}
                            </div>
                            <div className="text-white font-semibold text-sm">{fighterName}</div>
                          </div>
                          <button
                            onClick={() => togglePick(fighterName)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Card Progress</span>
                  <span className="text-white">{selected.length}/5</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selected.length / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {selected.length > 0 && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-blue-300 text-sm">
                      🎯 <strong>Next Step:</strong> Visit the <a href="/results" className="underline hover:text-blue-200">Results</a> page to simulate your fights.
                    </p>
                  </div>
                  
                  {selected.length === 5 && (
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-green-300 text-sm font-medium">
                        ✅ Fight card complete! Ready to simulate.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}