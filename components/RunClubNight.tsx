import { useState } from 'react';
import { GameState } from '@/lib/types';
import { performWork, calculateTraitBonus } from '@/lib/gameLogic';

interface RunClubNightProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
  onBack: () => void;
}

export default function RunClubNight({ state, onUpdate, onBack }: RunClubNightProps) {
  const [results, setResults] = useState<{
    performers: { name: string; income: number; message: string }[];
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
  } | null>(null);

  const handleRunNight = () => {
    const newState = { ...state };
    let totalIncome = 0;
    let totalExpenses = 0;
    const performerResults: { name: string; income: number; message: string }[] = [];

    newState.performers.forEach((performer, index) => {
      let income = performWork(performer);
      totalExpenses += performer.salary;

      let message = '';
      if (income > 0) {
        const { bonus, message: traitMsg } = calculateTraitBonus(performer, income);
        income += bonus;
        totalIncome += income;
        message = traitMsg ? `Income: $${income} (${traitMsg})` : `Income: $${income}`;
      } else {
        message = 'Too tired to perform';
      }

      performerResults.push({
        name: performer.name,
        income,
        message
      });

      newState.performers[index] = { ...performer };
    });

    const netProfit = totalIncome - totalExpenses;
    newState.money += netProfit;

    // Reputation changes
    if (netProfit > 0) {
      const repGain = Math.min(5, Math.floor(netProfit / 200));
      newState.reputation = Math.min(100, newState.reputation + repGain);
    }

    onUpdate(newState);
    setResults({
      performers: performerResults,
      totalIncome,
      totalExpenses,
      netProfit
    });
  };

  if (results) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Club Night Results</h2>
        
        <div className="bg-gray-700 rounded-lg p-6 space-y-3">
          <h3 className="text-xl font-bold mb-3">Performer Results</h3>
          {results.performers.map((result, index) => (
            <div key={index} className="bg-gray-800 rounded p-3">
              <div className="flex justify-between items-start">
                <span className="font-bold">{result.name}</span>
                <span className={result.income > 0 ? 'text-green-400' : 'text-gray-400'}>
                  {result.income > 0 ? `$${result.income}` : '-'}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-1">{result.message}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3">Financial Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Income:</span>
              <span className="font-bold text-green-400">${results.totalIncome}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Expenses:</span>
              <span className="font-bold text-red-400">${results.totalExpenses}</span>
            </div>
            <div className="border-t border-gray-600 pt-2 mt-2"></div>
            <div className="flex justify-between text-lg">
              <span>Net Profit:</span>
              <span className={`font-bold ${results.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {results.netProfit >= 0 ? '+' : ''}{results.netProfit > 0 && '$'}{results.netProfit}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            setResults(null);
            onBack();
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Run Club Night</h2>
      
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">Tonight's Lineup</h3>
        {state.performers.length === 0 ? (
          <p className="text-gray-400">No performers available!</p>
        ) : (
          <div className="space-y-2">
            {state.performers.map((performer, index) => (
              <div key={index} className="bg-gray-800 rounded p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold">{performer.name}</div>
                  <div className="text-sm text-gray-400">
                    {performer.performerType.toUpperCase()} • Skill: {performer.skill}/10
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Energy</div>
                  <div className={`font-bold ${performer.energy < 2 ? 'text-red-400' : 'text-green-400'}`}>
                    {performer.energy}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
        <p className="text-blue-200">
          💡 Tip: Make sure your performers have enough energy (at least 2) to work effectively!
        </p>
      </div>
      
      <button
        onClick={handleRunNight}
        disabled={state.performers.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition"
      >
        🎭 Open the Club!
      </button>
      
      <button
        onClick={onBack}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        ← Back to Menu
      </button>
    </div>
  );
}
