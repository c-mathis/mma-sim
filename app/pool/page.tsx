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
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [submittedOffers, setSubmittedOffers] = useState<any[]>([]);
  const [signedFighters, setSignedFighters] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/pool-week-01.json')
      .then(res => res.json())
      .then(setFighters)
      .catch(() => {
        setFighters([
          { name: 'Sean Strickland', weightClass: 185, hype: 78, record: '28-5', status: 'Available' },
          { name: 'Bo Nickal', weightClass: 185, hype: 72, record: '5-0', status: 'Prospect' },
          { name: 'Dustin Poirier', weightClass: 155, hype: 88, record: '29-8', status: 'Main Event Only' }
        ]);
      });
  }, []);

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

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔥 Weekly Fighter Pool</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fighters.map((fighter, i) => (
          <div key={i} className="border rounded-md p-4 shadow bg-white">
            <h2 className="text-lg font-semibold">{fighter.name}</h2>
            <p className="text-sm">Weight Class: {fighter.weightClass}</p>
            <p className="text-sm">Record: {fighter.record}</p>
            <p className="text-sm">Hype: {fighter.hype}/100</p>
            <p className="text-sm italic">{fighter.status}</p>
            {selectedFighter === fighter.name ? (
              <ContractForm fighterName={fighter.name} onSubmit={handleOffer} />
            ) : (
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={() => setSelectedFighter(fighter.name)}
              >
                Offer Contract
              </button>
            )}
          </div>
        ))}
      </div>

      {submittedOffers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-2">📋 Submitted Offers</h2>
          <ul className="list-disc ml-6 text-sm">
            {submittedOffers.map((offer, idx) => (
              <li key={idx}>
                {offer.fighterName} — ${offer.basePay} + ${offer.bonus} ({offer.role})
              </li>
            ))}
          </ul>
          <button
            onClick={resolveContracts}
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded text-sm"
          >
            Resolve Contracts
          </button>
        </section>
      )}

      {signedFighters.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-2">✅ Signed Fighters</h2>
          <ul className="list-disc ml-6 text-sm">
            {signedFighters.map((fighter, idx) => (
              <li key={idx}>
                {fighter.fighterName} — {fighter.role} — ${fighter.basePay}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
