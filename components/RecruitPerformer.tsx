import { useState } from 'react';
import { GameState, PerformerType } from '@/lib/types';
import { generatePerformer } from '@/lib/gameLogic';

interface RecruitPerformerProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
  onBack: () => void;
}

export default function RecruitPerformer({ state, onUpdate, onBack }: RecruitPerformerProps) {
  const [candidate, setCandidate] = useState<ReturnType<typeof generatePerformer> | null>(null);

  const handleGenerateCandidate = (type: PerformerType) => {
    const newCandidate = generatePerformer(type);
    setCandidate(newCandidate);
  };

  const handleHire = () => {
    if (!candidate) return;

    const weeklySalary = candidate.salary * 7;
    if (state.money < weeklySalary) {
      alert(`Not enough money! Need $${weeklySalary} for 1 week salary.`);
      return;
    }

    const newState = { ...state };
    newState.performers.push({ ...candidate });
    newState.relationships[candidate.name] = 5;
    newState.money -= weeklySalary;
    
    onUpdate(newState);
    alert(`✓ ${candidate.name} has been hired!`);
    setCandidate(null);
  };

  if (candidate) {
    const weeklySalary = candidate.salary * 7;
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Candidate Profile</h2>
        
        <div className="bg-gray-700 rounded-lg p-6 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{candidate.name}</h3>
              <p className="text-gray-400">{candidate.gender.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                {candidate.performerType.toUpperCase()}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-800 rounded p-3">
              <div className="text-gray-400 text-sm">Skill Level</div>
              <div className="text-xl font-bold">{candidate.skill}/10</div>
            </div>
            <div className="bg-gray-800 rounded p-3">
              <div className="text-gray-400 text-sm">Salary Demand</div>
              <div className="text-xl font-bold text-green-400">${candidate.salary}/day</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-gray-400 text-sm mb-2">Personality Traits</div>
            <div className="flex flex-wrap gap-2">
              {candidate.traits.map((trait, i) => (
                <span key={i} className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
          <p className="text-blue-200">
            Hiring cost: <span className="font-bold">${weeklySalary}</span> (1 week advance)
          </p>
          <p className="text-blue-200 mt-1">
            Your money: <span className="font-bold">${state.money}</span>
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleHire}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
            disabled={state.money < weeklySalary}
          >
            {state.money >= weeklySalary ? '✓ Hire' : '✗ Not Enough Money'}
          </button>
          <button
            onClick={() => setCandidate(null)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Decline
          </button>
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Recruit Performer</h2>
      <p className="text-gray-400 mb-6">Select a performer type to see available candidates:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(PerformerType).map((type) => (
          <button
            key={type}
            onClick={() => handleGenerateCandidate(type)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-6 rounded-lg transition text-left"
          >
            <div className="text-2xl mb-2">
              {type === PerformerType.DANCER && '💃'}
              {type === PerformerType.SINGER && '🎤'}
              {type === PerformerType.DJ && '🎧'}
              {type === PerformerType.BARTENDER && '🍸'}
              {type === PerformerType.SECURITY && '🚨'}
            </div>
            <div className="text-xl font-bold capitalize">{type}</div>
            <div className="text-sm opacity-75 mt-1">
              {type === PerformerType.DANCER && 'Entertaining performances'}
              {type === PerformerType.SINGER && 'Vocal talents'}
              {type === PerformerType.DJ && 'Music & atmosphere'}
              {type === PerformerType.BARTENDER && 'Drink service'}
              {type === PerformerType.SECURITY && 'Safety & order'}
            </div>
          </button>
        ))}
      </div>
      
      <button
        onClick={onBack}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition mt-6"
      >
        ← Back to Menu
      </button>
    </div>
  );
}
