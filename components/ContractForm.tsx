import { useState } from 'react';

type Props = {
  fighterName: string;
  onSubmit: (data: any) => void;
};

export default function ContractForm({ fighterName, onSubmit }: Props) {
  const [basePay, setBasePay] = useState('');
  const [bonus, setBonus] = useState('');
  const [role, setRole] = useState('undercard');

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-white font-semibold">Contract Offer for {fighterName}</h3>
        <p className="text-gray-400 text-sm">Structure your offer carefully</p>
      </div>
      
      <form
        className="space-y-4"
        onSubmit={e => {
          e.preventDefault();
          onSubmit({ fighterName, basePay, bonus, role });
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Base Pay ($)</label>
          <input
            type="number"
            value={basePay}
            onChange={e => setBasePay(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter base pay amount"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Win Bonus ($)</label>
          <input
            type="number"
            value={bonus}
            onChange={e => setBonus(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter win bonus amount"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fight Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="undercard">Undercard</option>
            <option value="co-main">Co-Main Event</option>
            <option value="main-event">Main Event</option>
          </select>
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
          >
            Submit Offer
          </button>
          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
