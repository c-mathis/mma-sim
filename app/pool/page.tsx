// app/pool/page.tsx

'use client';

import { useEffect, useState } from 'react';
import ContractForm from '../../components/ContractForm';

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
    console.log('Submitted Offer:', data);
    setSelectedFighter(null);
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
    </main>
  );
}