// lib/getWeeklyPool.ts
import { Fighter } from './types';

const fallbackPool: Fighter[] = [
  { name: 'Sean Strickland', weightClass: 185, hype: 78, record: '28-5', status: 'Available' },
  { name: 'Bo Nickal', weightClass: 185, hype: 72, record: '5-0', status: 'Prospect' },
  { name: 'Dustin Poirier', weightClass: 155, hype: 88, record: '29-8', status: 'Main Event Only' },
  { name: 'Max Holloway', weightClass: 145, hype: 90, record: '25-7', status: 'Available' },
  { name: 'Khamzat Chimaev', weightClass: 185, hype: 92, record: '13-0', status: 'Available' },
  { name: 'Islam Makhachev', weightClass: 155, hype: 95, record: '25-1', status: 'Available' },
  { name: 'Jon Jones', weightClass: 265, hype: 98, record: '27-1', status: 'Main Event Only' },
  { name: 'Alexander Volkanovski', weightClass: 145, hype: 94, record: '26-3', status: 'Available' }
];

export async function getWeeklyPool(week: number): Promise<Fighter[]> {
  try {
    const url = `/data/pool-week-${String(week).padStart(2, '0')}.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Pool file not found for week ${week}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : fallbackPool;
  } catch (error) {
    console.warn(`Failed to load pool for week ${week}, using fallback:`, error);
    return fallbackPool;
  }
}