// app/results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Fighter, FightResult, ContractOffer } from '../../lib/types';
import { getWeeklyPool } from '../../lib/getWeeklyPool';
import { simulateFight } from '../../lib/simulateFight';

type CardResults = {
  fights: FightResult[];
  cardRating: number;
  week: number;
};

export default function ResultsPage() {
  // ---- Week handling ----
  const [week, setWeek] = useState<number>(1);
  useEffect(() => {
    const savedWeek = Number(localStorage.getItem('week') || 1);
    setWeek(Number.isFinite(savedWeek) && savedWeek > 0 ? savedWeek : 1);
  }, []);
  useEffect(() => {
    localStorage.setItem('week', String(week));
  }, [week]);

  // ---- State ----
  const [myCard, setMyCard] = useState<string[]>([]);
  const [results, setResults] = useState<CardResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Load my card for current week ----
  useEffect(() => {
    try {
      const savedCard = JSON.parse(localStorage.getItem(`card:w${week}`) || '[]');
      setMyCard(Array.isArray(savedCard) ? savedCard : []);
      
      // Try to load existing results
      const savedResults = localStorage.getItem(`results:w${week}`);
      if (savedResults) {
        setResults(JSON.parse(savedResults));
      } else {
        setResults(null);
      }
    } catch (err) {
      console.error('Error loading card/results:', err);
      setMyCard([]);
      setResults(null);
    }
  }, [week]);

  // ---- Generate AI opponents and simulate fights ----
  const simulateCard = async () => {
    if (myCard.length === 0) {
      setError('No fighters selected for your card. Visit Fight Card page first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the weekly pool to find our fighters and generate opponents
      const pool = await getWeeklyPool(week);
      const myFighters = pool.filter(f => myCard.includes(f.name));
      
      // Create AI opponents (simplified - pick different fighters from pool)
      const availableOpponents = pool.filter(f => !myCard.includes(f.name));
      const aiCard: Fighter[] = [];
      
      for (let i = 0; i < myCard.length && i < 5; i++) {
        if (availableOpponents.length > i) {
          aiCard.push(availableOpponents[i]);
        } else {
          // Fallback opponent
          aiCard.push({
            name: `AI Fighter ${i + 1}`,
            weightClass: myFighters[i]?.weightClass || 185,
            hype: 60 + Math.floor(Math.random() * 30),
            record: `${10 + Math.floor(Math.random() * 15)}-${Math.floor(Math.random() * 5)}`,
            status: 'Available'
          });
        }
      }

      // Simulate each fight
      const fights: FightResult[] = [];
      const roles: Array<'undercard' | 'co-main' | 'main-event'> = ['main-event', 'co-main', 'undercard', 'undercard', 'undercard'];

      for (let i = 0; i < myFighters.length && i < aiCard.length; i++) {
        const myFighter = myFighters.find(f => f.name === myCard[i]);
        const opponent = aiCard[i];
        
        if (myFighter) {
          const fight = simulateFight(myFighter, opponent, {
            role: roles[i] || 'undercard',
            seed: `w${week}-${myFighter.name}-${opponent.name}`
          });
          fights.push(fight);
        }
      }

      // Calculate card rating
      const cardRating = Math.floor(
        fights.reduce((sum, fight) => sum + fight.viewersImpact, 0) / fights.length
      );

      const cardResults: CardResults = {
        fights,
        cardRating,
        week
      };

      // Save results
      localStorage.setItem(`results:w${week}`, JSON.stringify(cardResults));
      setResults(cardResults);
      
    } catch (err) {
      setError(`Failed to simulate card: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Week navigation
  const prevWeek = () => setWeek(w => Math.max(1, w - 1));
  const nextWeek = () => setWeek(w => w + 1);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Week header + nav */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Fight Results
          </h1>
          <p className="text-gray-400 mt-1">Week {String(week).padStart(2, '0')} • Simulate and view your fight card results</p>
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

      {/* My Card Summary */}
      <section className="mb-8">
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-blue-400">🎟️</span>
            <span>Your Fight Card</span>
          </h2>
          
          {myCard.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Fight Card Selected</h3>
              <p className="text-gray-400 mb-4">You need to build your fight card before simulating results.</p>
              <a href="/fight-card" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-all">
                <span>Build Fight Card</span>
                <span>→</span>
              </a>
            </div>
          ) : (
            <div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="text-blue-300 font-semibold mb-2">Selected Fighters</h3>
                  <p className="text-white text-sm">{myCard.length}/5 fighters selected</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <h3 className="text-orange-300 font-semibold mb-2">Status</h3>
                  <p className="text-white text-sm">{results ? 'Results Available' : 'Ready to Simulate'}</p>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                <h4 className="text-gray-300 text-sm font-medium mb-2">Fighter Lineup:</h4>
                <div className="flex flex-wrap gap-2">
                  {myCard.map((fighter, idx) => (
                    <span key={fighter} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                      {idx + 1}. {fighter}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={simulateCard}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Simulating...</span>
                    </span>
                  ) : results ? 'Re-simulate Card' : 'Simulate Fight Card'}
                </button>
                
                {results && (
                  <button
                    onClick={() => {
                      localStorage.removeItem(`results:w${week}`);
                      setResults(null);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-all"
                  >
                    Clear Results
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="mb-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="text-red-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <section>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span className="text-red-400">🥊</span>
                <span>Fight Results</span>
              </h2>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">Card Rating: {results.cardRating}/100</span>
              </div>
            </div>

            <div className="space-y-6">
              {results.fights.map((fight, idx) => {
                const roles = ['Main Event', 'Co-Main Event', 'Undercard', 'Undercard', 'Undercard'];
                const roleLabel = roles[idx] || 'Undercard';
                const roleColors = {
                  'Main Event': 'from-yellow-500 to-orange-500',
                  'Co-Main Event': 'from-orange-500 to-red-500',
                  'Undercard': 'from-gray-500 to-gray-600'
                };
                const roleColor = roleColors[roleLabel as keyof typeof roleColors];
                
                return (
                  <div key={idx} className="bg-gray-900/50 backdrop-blur-sm border border-gray-600 rounded-xl p-6 shadow-xl">
                    {/* Fight Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`bg-gradient-to-r ${roleColor} px-3 py-1 rounded-lg`}>
                          <span className="text-white font-bold text-sm">{roleLabel}</span>
                        </div>
                        <span className="text-gray-400">Fight {idx + 1}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="bg-gray-700 px-3 py-1 rounded-full">
                          <span className="text-white">Round {fight.round}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full ${
                          fight.method === 'KO' ? 'bg-red-500/20 text-red-300'
                          : fight.method === 'Sub' ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          <span className="font-semibold">{fight.method}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fight Result */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Winner */}
                      <div className="text-center">
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                          <div className="text-green-400 font-bold text-sm mb-2 flex items-center justify-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>WINNER</span>
                          </div>
                          <div className="text-white font-bold text-xl mb-2">{fight.winner}</div>
                          <div className="text-gray-400 text-sm">
                            Damage Taken: {fight.damage[fight.winner]}/100
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${100 - fight.damage[fight.winner]}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* VS Separator */}
                      <div className="text-center flex items-center justify-center">
                        <div className="bg-gray-700 rounded-full p-4">
                          <span className="text-white font-bold text-2xl">VS</span>
                        </div>
                      </div>
                      
                      {/* Loser */}
                      <div className="text-center">
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                          <div className="text-red-400 font-bold text-sm mb-2 flex items-center justify-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>DEFEATED</span>
                          </div>
                          <div className="text-white font-bold text-xl mb-2">{fight.loser}</div>
                          <div className="text-gray-400 text-sm">
                            Damage Taken: {fight.damage[fight.loser]}/100
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${fight.damage[fight.loser]}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fight Notes */}
                    <div className="text-center mb-4">
                      <p className="text-gray-300 italic text-lg">{fight.notes}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-700">
                      <div className="text-center">
                        <div className="text-yellow-400 font-semibold text-sm">Viewer Impact</div>
                        <div className="text-white text-lg">{fight.viewersImpact}/100</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-semibold text-sm">Method</div>
                        <div className="text-white text-lg">{fight.method}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-semibold text-sm">Duration</div>
                        <div className="text-white text-lg">R{fight.round}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Summary */}
          <div className="mt-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <span className="text-yellow-400">📊</span>
              <span>Card Summary</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold text-sm mb-1">Total Fights</div>
                  <div className="text-white font-bold text-2xl">{results.fights.length}</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="text-red-400 font-semibold text-sm mb-1">Knockouts</div>
                  <div className="text-white font-bold text-2xl">{results.fights.filter(f => f.method === 'KO').length}</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="text-purple-400 font-semibold text-sm mb-1">Submissions</div>
                  <div className="text-white font-bold text-2xl">{results.fights.filter(f => f.method === 'Sub').length}</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-green-400 font-semibold text-sm mb-1">Decisions</div>
                  <div className="text-white font-bold text-2xl">{results.fights.filter(f => f.method === 'Dec').length}</div>
                </div>
              </div>
            </div>
            
            {/* Overall Card Rating */}
            <div className="mt-6 pt-6 border-t border-gray-600">
              <div className="text-center">
                <h4 className="text-gray-300 font-semibold mb-3">Overall Card Performance</h4>
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-xl">
                    <span className="text-white font-bold text-xl">Rating: {results.cardRating}/100</span>
                  </div>
                  <div className="text-gray-300">
                    {results.cardRating >= 85 ? '🔥 Epic Card!' 
                     : results.cardRating >= 70 ? '⭐ Great Card!'
                     : results.cardRating >= 55 ? '👍 Solid Card'
                     : '📈 Room for Improvement'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}