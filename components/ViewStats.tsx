import { GameState } from '@/lib/types';

interface ViewStatsProps {
  state: GameState;
  onBack: () => void;
}

export default function ViewStats({ state, onBack }: ViewStatsProps) {
  const totalSalary = state.performers.reduce((sum, p) => sum + p.salary, 0);
  const avgSkill = state.performers.length > 0
    ? state.performers.reduce((sum, p) => sum + p.skill, 0) / state.performers.length
    : 0;

  // Gender diversity stats
  const genderCounts: Record<string, number> = {};
  state.performers.forEach(p => {
    genderCounts[p.gender] = (genderCounts[p.gender] || 0) + 1;
  });

  // Performer type stats
  const typeCounts: Record<string, number> = {};
  state.performers.forEach(p => {
    typeCounts[p.performerType] = (typeCounts[p.performerType] || 0) + 1;
  });

  // Trait stats
  const traitCounts: Record<string, number> = {};
  state.performers.forEach(p => {
    p.traits.forEach(trait => {
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });
  });
  const topTraits = Object.entries(traitCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Club Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">General Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Day:</span>
              <span className="font-bold">{state.day}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Money:</span>
              <span className="font-bold text-green-400">${state.money}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reputation:</span>
              <span className="font-bold text-blue-400">{state.reputation}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ethics Score:</span>
              <span className="font-bold text-purple-400">{state.ethicsScore}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Performers:</span>
              <span className="font-bold">{state.performers.length}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">Financial Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Salary Expenses:</span>
              <span className="font-bold text-red-400">${totalSalary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Average Performer Skill:</span>
              <span className="font-bold">{avgSkill.toFixed(1)}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">City Demand:</span>
              <span className="font-bold">{state.cityDemand}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Risk Level:</span>
              <span className="font-bold capitalize">{state.riskLevel}</span>
            </div>
          </div>
        </div>
      </div>
      
      {state.performers.length > 0 && (
        <>
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Diversity Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(genderCounts).map(([gender, count]) => (
                <div key={gender} className="bg-gray-800 rounded p-3">
                  <div className="text-gray-400 text-xs capitalize">{gender}</div>
                  <div className="text-xl font-bold">{count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Performer Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} className="bg-gray-800 rounded p-3">
                  <div className="text-gray-400 text-xs capitalize">{type}</div>
                  <div className="text-xl font-bold">{count}</div>
                </div>
              ))}
            </div>
          </div>
          
          {topTraits.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3">Top Team Traits</h3>
              <div className="space-y-2">
                {topTraits.map(([trait, count]) => (
                  <div key={trait} className="flex justify-between items-center bg-gray-800 rounded p-2">
                    <span>{trait}</span>
                    <span className="font-bold text-purple-400">{count} performer(s)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-3">Story Progress</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Events Completed:</span>
            <span className="font-bold">{state.completedEvents.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Active Upgrades:</span>
            <span className="font-bold">{Object.keys(state.upgrades).length}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onBack}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        ← Back to Menu
      </button>
    </div>
  );
}
