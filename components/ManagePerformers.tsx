import { useState } from 'react';
import { GameState, Performer } from '@/lib/types';
import { trainPerformer, restPerformer } from '@/lib/gameLogic';

interface ManagePerformersProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
  onBack: () => void;
}

export default function ManagePerformers({ state, onUpdate, onBack }: ManagePerformersProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleTrain = (index: number) => {
    const performer = state.performers[index];
    const cost = 100;
    
    if (state.money < cost) {
      alert(`Training costs $${cost}!`);
      return;
    }

    const result = trainPerformer(performer);
    if (result.success) {
      const newState = { ...state };
      newState.money -= cost;
      newState.performers[index] = { ...performer };
      onUpdate(newState);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleRest = (index: number) => {
    const performer = state.performers[index];
    restPerformer(performer);
    const newState = { ...state };
    newState.performers[index] = { ...performer };
    onUpdate(newState);
    alert(`${performer.name} rested. Energy: ${performer.energy}/10`);
  };

  const handleTalk = (index: number) => {
    const performer = state.performers[index];
    const newState = { ...state };
    newState.relationships[performer.name] = Math.min(10, newState.relationships[performer.name] + 1);
    performer.loyalty = Math.min(10, performer.loyalty + 1);
    newState.performers[index] = { ...performer };
    onUpdate(newState);
    alert(`You spent time with ${performer.name}. Relationship improved to ${newState.relationships[performer.name]}/10`);
  };

  const handleFire = (index: number) => {
    const performer = state.performers[index];
    if (confirm(`Are you sure you want to fire ${performer.name}?`)) {
      const newState = { ...state };
      newState.performers.splice(index, 1);
      delete newState.relationships[performer.name];
      newState.ethicsScore = Math.max(0, newState.ethicsScore - 5);
      onUpdate(newState);
      setSelectedIndex(null);
      alert(`${performer.name} has been let go.`);
    }
  };

  if (selectedIndex !== null) {
    const performer = state.performers[selectedIndex];
    const relationship = state.relationships[performer.name] || 5;

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Managing {performer.name}</h2>
        
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{performer.name}</h3>
              <p className="text-gray-400">{performer.gender.toUpperCase()} • {performer.performerType.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800 rounded p-3">
              <div className="text-gray-400 text-xs">Skill</div>
              <div className="text-lg font-bold">{performer.skill}/10</div>
            </div>
            <div className="bg-gray-800 rounded p-3">
              <div className="text-gray-400 text-xs">Energy</div>
              <div className="text-lg font-bold">{performer.energy}/10</div>
            </div>
            <div className="bg-gray-800 rounded p-3">
              <div className="text-gray-400 text-xs">Loyalty</div>
              <div className="text-lg font-bold">{performer.loyalty}/10</div>
            </div>
            <div className="bg-gray-800 rounded p-3">
              <div className="text-gray-400 text-xs">Relationship</div>
              <div className="text-lg font-bold">{relationship}/10</div>
            </div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm mb-2">Traits</div>
            <div className="flex flex-wrap gap-2">
              {performer.traits.map((trait, i) => (
                <span key={i} className="bg-purple-600 px-2 py-1 rounded text-xs">
                  {trait}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-400">Daily Salary:</span> ${performer.salary}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleTrain(selectedIndex)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            💪 Train ($100)
          </button>
          <button
            onClick={() => handleRest(selectedIndex)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            😴 Rest
          </button>
          <button
            onClick={() => handleTalk(selectedIndex)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            💬 Talk
          </button>
          <button
            onClick={() => handleFire(selectedIndex)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            ❌ Fire
          </button>
        </div>
        
        <button
          onClick={() => setSelectedIndex(null)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          ← Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Performers</h2>
      
      {state.performers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No performers hired yet. Recruit some talent!
        </div>
      ) : (
        <div className="space-y-3">
          {state.performers.map((performer, index) => {
            const relationship = state.relationships[performer.name] || 5;
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className="w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">{performer.name}</h3>
                    <p className="text-sm text-gray-400">
                      {performer.gender.toUpperCase()} • {performer.performerType.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Salary</div>
                    <div className="font-bold text-green-400">${performer.salary}/day</div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span>Skill: {performer.skill}/10</span>
                  <span>Energy: {performer.energy}/10</span>
                  <span>Loyalty: {performer.loyalty}/10</span>
                  <span>Relationship: {relationship}/10</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      
      <button
        onClick={onBack}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition mt-6"
      >
        ← Back to Menu
      </button>
    </div>
  );
}
