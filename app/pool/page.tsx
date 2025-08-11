// app/pool/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ContractForm from '../../components/ContractForm';
import { scoreContract } from '../../lib/contractScore';

type Fighter = {
  name: string;
  weightClass: number;
  hype: number;
  record: string;
  status: string;
};

export default function PoolPage() {
  // ---- Week handling ----
  const [week, setWeek] = useState<number>(1);
  useEffect(() => {
    const savedWeek = Number(localStorage.getItem('week') || 1);
    setWeek(Number.isFinite(savedWeek) && savedWeek > 0 ? savedWeek : 1);
  }, []);
  useEffect(() => {
    localStorage.setItem('week', String(week));
  }, [week]);

  // ---- Fighter pool + contracts ----
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [submittedOffers, setSubmittedOffers] = useState<any[]>([]);
  const [signedFighters, setSignedFighters] = useState<any[]>([]);

  // Load weekly pool for the current week
  useEffect(() => {
    const url = `/data/pool-week-${String(week).padStart(2, '0')}.json`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Missing pool file for week ${week}`);
        return res.json();
      })
      .then(setFighters)
      .catch(() => {
        // Fallback demo data if file not found
        setFighters([
          { name: 'Sean Strickland', weightClass: 185, hype: 78, record: '28-5', status: 'Available' },
          { name: 'Bo Nickal',        weightClass: 185, hype: 72, record: '5-0',  status: 'Prospect' },
          { name: 'Dustin Poirier',   weightClass: 155, hype: 88, record: '29-8', status: 'Main Event Only' }
        ]);
      });
  }, [week]);

  // Load persisted offers/signed
  useEffect(() => {
    try {
      const savedOffers = JSON.parse(localStorage.getItem(`offers:w${week}`) || '[]');
      const savedSigned = JSON.parse(localStorage.getItem(`signed:w${week}`) || '[]');
      setSubmittedOffers(Array.isArray(savedOffers) ? savedOffers : []);
      setSignedFighters(Array.isArray(savedSigned) ? savedSigned : []);
    } catch {}
  }, [week]);

  // Persist per-week state
  useEffect(() => {
    localStorage.setItem(`offers:w${week}`, JSON.stringify(submittedOffers));
  }, [submittedOffers, week]);

  useEffect(() => {
    localStorage.setItem(`signed:w${week}`, JSON.stringify(signedFighters));
  }, [signedFighters, week]);

  // Contract actions
  const handleOffer = (data: any) => {
    setSubmittedOffers(prev => [...prev, data]);
    setSelectedFighter(null);
  };

  const resolveContracts = () => {
    const bestOffers: Record<string, any> = {};
    submittedOffers.forEach(offer => {
      const score = scoreContract(offer);
      if (!bestOffers[offer.fighterName] || score > scoreContract(bestOffers[offer.fighterName])) {
        bestOffers[offer.fighterName] = offer;
      }
    });
    const signed = Object.values(bestOffers);
    setSignedFighters(signed);
  };

  const clearOffers = () => setSubmittedOffers([]);

  // Week nav (note: clearing state is your call; here we keep per-week persistence)
  const prevWeek = () => setWeek(w => Math.max(1, w - 1));
  const nextWeek = () => setWeek(w => w + 1);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Week header + nav */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Weekly Fighter Pool
          </h1>
          <p className="text-gray-400 mt-1">Week {String(week).padStart(2, '0')} • {fighters.length} fighters available</p>
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

      {/* Fighter Pool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fighters.map((fighter, i) => {
          const hypeColor = fighter.hype >= 90 ? 'from-yellow-500 to-orange-500' 
            : fighter.hype >= 75 ? 'from-green-500 to-blue-500'
            : fighter.hype >= 60 ? 'from-blue-500 to-purple-500'
            : 'from-gray-500 to-gray-600';
          
          const statusColor = fighter.status === 'Main Event Only' ? 'text-yellow-400'
            : fighter.status === 'Prospect' ? 'text-green-400'
            : 'text-gray-300';

          return (
            <div key={i} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all hover:border-gray-600 group">
              {/* Fighter Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-1">{fighter.name}</h2>
                  <p className={`text-sm font-medium ${statusColor}`}>{fighter.status}</p>
                </div>
                <div className={`bg-gradient-to-r ${hypeColor} rounded-full px-3 py-1 text-xs font-bold text-white`}>
                  {fighter.hype}
                </div>
              </div>

              {/* Fighter Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Weight Class</span>
                  <span className="text-white font-semibold">{fighter.weightClass} lbs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Record</span>
                  <span className="text-white font-mono">{fighter.record}</span>
                </div>
                
                {/* Hype Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Hype Level</span>
                    <span className="text-white text-sm">{fighter.hype}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${hypeColor} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${fighter.hype}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              {selectedFighter === fighter.name ? (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <ContractForm fighterName={fighter.name} onSubmit={handleOffer} />
                </div>
              ) : (
                <button
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                  onClick={() => setSelectedFighter(fighter.name)}
                >
                  Make Offer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Submitted Offers */}
      {submittedOffers.length > 0 && (
        <section className="mt-12">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">📋 Submitted Offers</h2>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                Week {String(week).padStart(2, '0')} • {submittedOffers.length} offers
              </span>
            </div>
            
            <div className="grid gap-3 mb-6">
              {submittedOffers.map((offer, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-semibold">{offer.fighterName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-400 font-mono">${offer.basePay}</span>
                      <span className="text-gray-400">+</span>
                      <span className="text-yellow-400 font-mono">${offer.bonus}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      offer.role === 'main-event' ? 'bg-yellow-500/20 text-yellow-300'
                      : offer.role === 'co-main' ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {offer.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={resolveContracts}
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Resolve Contracts
              </button>
              <button
                onClick={clearOffers}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-all"
              >
                Clear All Offers
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Signed Fighters */}
      {signedFighters.length > 0 && (
        <section className="mt-12">
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span className="text-green-400">✅</span>
                <span>Signed Fighters</span>
              </h2>
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                Week {String(week).padStart(2, '0')} • {signedFighters.length} signed
              </span>
            </div>
            
            <div className="grid gap-4">
              {signedFighters.map((fighter: any, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white font-semibold text-lg">{fighter.fighterName}</span>
                      <span className="text-green-400 font-mono">${fighter.basePay}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      fighter.role === 'main-event' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : fighter.role === 'co-main' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {fighter.role.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-300 text-sm">
                🎯 <strong>Next Step:</strong> Visit the <a href="/fight-card" className="underline hover:text-blue-200">Fight Card</a> page to select up to 5 fighters for your main card.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}