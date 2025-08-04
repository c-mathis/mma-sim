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
    <form
      className="mt-2 space-y-2"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ fighterName, basePay, bonus, role });
      }}
    >
      <div>
        <label className="text-sm">Base Pay</label>
        <input
          type="number"
          value={basePay}
          onChange={e => setBasePay(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="text-sm">Win Bonus</label>
        <input
          type="number"
          value={bonus}
          onChange={e => setBonus(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="text-sm">Role</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="undercard">Undercard</option>
          <option value="main-event">Main Event</option>
          <option value="co-main">Co-Main</option>
        </select>
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded text-sm">
        Submit Offer
      </button>
    </form>
  );
}
