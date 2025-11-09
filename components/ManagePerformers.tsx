import { useState } from 'react';
import { GameState } from '@/lib/types';
import { trainPerformer, restPerformer, updateChemistryForAllPerformers } from '@/lib/gameLogic';
import WardrobeManager from './WardrobeManager';
import ChemistryDisplay from './ChemistryDisplay';
import CardDeckManager from './CardDeckManager';

interface ManagePerformersProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
  onBack: () => void;
}

export default function ManagePerformers({ state, onUpdate, onBack }: ManagePerformersProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showChemistry, setShowChemistry] = useState(false);
  const [showCards, setShowCards] = useState(false);

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
      
      // Update chemistry after training
      updateChemistryForAllPerformers(newState.performers);
      
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
    const currentRelationship = newState.relationships[performer.name] || 5;
    newState.relationships[performer.name] = Math.min(10, currentRelationship + 1);
    const updatedPerformer = { ...performer };
    updatedPerformer.loyalty = Math.min(10, updatedPerformer.loyalty + 1);
    newState.performers[index] = updatedPerformer;
    onUpdate(newState);
    alert(`You spent time with ${performer.name}. Relationship improved to ${newState.relationships[performer.name]}/10`);
  };

  const toggleAdultService = (index: number, service: 'striptease' | 'privateLounge' | 'afterHours') => {
    const performer = state.performers[index];
    const newState = { ...state };
    const updatedPerformer = { ...performer };
    
    if (service === 'striptease') {
      updatedPerformer.offersStriptease = !updatedPerformer.offersStriptease;
      if (updatedPerformer.offersStriptease) {
        newState.ethicsScore = Math.max(0, newState.ethicsScore - 3);
      }
    } else if (service === 'privateLounge') {
      updatedPerformer.offersPrivateLounge = !updatedPerformer.offersPrivateLounge;
      if (updatedPerformer.offersPrivateLounge) {
        newState.ethicsScore = Math.max(0, newState.ethicsScore - 5);
      }
    } else if (service === 'afterHours') {
      updatedPerformer.afterHoursExclusive = !updatedPerformer.afterHoursExclusive;
      if (updatedPerformer.afterHoursExclusive) {
        newState.ethicsScore = Math.max(0, newState.ethicsScore - 8);
      }
    }
    
    newState.performers[index] = updatedPerformer;
    onUpdate(newState);
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

    if (showWardrobe) {
      return (
        <WardrobeManager
          state={state}
          performer={performer}
          performerIndex={selectedIndex}
          onUpdate={onUpdate}
          onBack={() => setShowWardrobe(false)}
        />
      );
    }

    if (showChemistry) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Chemistry: {performer.name}</h2>
          <ChemistryDisplay performer={performer} allPerformers={state.performers} />
          <button
            onClick={() => setShowChemistry(false)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            ← Back to Management
          </button>
        </div>
      );
    }

    if (showCards) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Skill Cards: {performer.name}</h2>
          <CardDeckManager performer={performer} />
          <button
            onClick={() => setShowCards(false)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            ← Back to Management
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Managing {performer.name}</h2>
        
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{performer.name}</h3>
              <p className="text-gray-400">{performer.gender.toUpperCase()} • {performer.performerType.toUpperCase()}</p>
              <p className="text-purple-300 text-sm capitalize">✨ {performer.personalityArchetype}</p>
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
            {performer.breastSize !== undefined && (
              <div className="bg-gray-800 rounded p-3">
                <div className="text-gray-400 text-xs">Breast Size</div>
                <div className="text-lg font-bold">{performer.breastSize}/10</div>
              </div>
            )}
            {performer.penisSize !== undefined && (
              <div className="bg-gray-800 rounded p-3">
                <div className="text-gray-400 text-xs">Penis Size</div>
                <div className="text-lg font-bold">{performer.penisSize}/10</div>
              </div>
            )}
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
          
          <div className="text-sm">
            <span className="text-gray-400">Lifetime Tips:</span> <span className="text-green-400">${performer.tipsEarned}</span>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-bold mb-3">Adult Services (⚠️ Affects Ethics)</h3>
          <div className="space-y-2">
            <button
              onClick={() => toggleAdultService(selectedIndex, 'striptease')}
              className={`w-full text-left p-3 rounded transition ${
                performer.offersStriptease 
                  ? 'bg-pink-600 hover:bg-pink-700' 
                  : 'bg-gray-800 hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>💃 Striptease Routines (+25% income, -3 energy)</span>
                <span className="font-bold">{performer.offersStriptease ? 'ON' : 'OFF'}</span>
              </div>
            </button>
            
            <button
              onClick={() => toggleAdultService(selectedIndex, 'privateLounge')}
              className={`w-full text-left p-3 rounded transition ${
                performer.offersPrivateLounge 
                  ? 'bg-pink-600 hover:bg-pink-700' 
                  : 'bg-gray-800 hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>🛋️ Private Lounge (+35% income, -4 energy)</span>
                <span className="font-bold">{performer.offersPrivateLounge ? 'ON' : 'OFF'}</span>
              </div>
            </button>
            
            <button
              onClick={() => toggleAdultService(selectedIndex, 'afterHours')}
              className={`w-full text-left p-3 rounded transition ${
                performer.afterHoursExclusive 
                  ? 'bg-pink-600 hover:bg-pink-700' 
                  : 'bg-gray-800 hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>🌙 After-Hours Exclusive (+45% income, -5 energy)</span>
                <span className="font-bold">{performer.afterHoursExclusive ? 'ON' : 'OFF'}</span>
              </div>
            </button>
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
            onClick={() => setShowWardrobe(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            👔 Wardrobe
          </button>
          <button
            onClick={() => setShowChemistry(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            💕 Chemistry
          </button>
          <button
            onClick={() => setShowCards(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            🎴 Cards
          </button>
        </div>
        
        <button
          onClick={() => handleFire(selectedIndex)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          ❌ Fire Performer
        </button>
        
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
