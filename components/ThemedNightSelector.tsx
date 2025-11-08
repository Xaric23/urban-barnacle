import { GameState, ThemedNightType, PersonalityArchetype } from '@/lib/types';
import { THEMED_NIGHTS } from '@/lib/constants';
import { calculateThemedNightBonus, getChemistryIcon } from '@/lib/gameLogic';

interface ThemedNightSelectorProps {
  state: GameState;
  selectedNight: ThemedNightType | null;
  onSelect: (night: ThemedNightType | null) => void;
}

export default function ThemedNightSelector({ state, selectedNight, onSelect }: ThemedNightSelectorProps) {
  return (
    <div className="bg-gray-700 rounded-lg p-6 mb-4">
      <h3 className="text-xl font-bold mb-4">🎭 Themed Night Selection</h3>
      <p className="text-sm text-gray-400 mb-4">
        Select a themed night to boost income when you have matching performers!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => onSelect(null)}
          className={`p-4 rounded-lg border-2 transition ${
            selectedNight === null 
              ? 'border-purple-500 bg-purple-900/30' 
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
        >
          <div className="font-bold">Regular Night</div>
          <div className="text-xs text-gray-400 mt-1">No theme bonus</div>
        </button>
        
        {THEMED_NIGHTS.map((night) => {
          const workingPerformers = state.performers.filter(p => p.energy >= 2);
          const bonus = calculateThemedNightBonus(workingPerformers, night.type);
          const canRun = workingPerformers.length >= night.minPerformers;
          
          return (
            <button
              key={night.type}
              onClick={() => canRun && onSelect(night.type)}
              disabled={!canRun}
              className={`p-4 rounded-lg border-2 transition text-left ${
                selectedNight === night.type
                  ? 'border-purple-500 bg-purple-900/30'
                  : canRun
                  ? 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  : 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="font-bold">{night.name}</div>
              <div className="text-xs text-gray-400 mt-1">{night.description}</div>
              <div className="text-xs mt-2">
                <span className="text-yellow-400">Required: </span>
                {night.requiredArchetypes.map((arch, i) => (
                  <span key={i} className="text-purple-300">
                    {arch}{i < night.requiredArchetypes.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
              {canRun && bonus.bonus > 1 && (
                <div className="text-green-400 text-sm mt-2 font-bold">
                  ⚡ {Math.floor((bonus.bonus - 1) * 100)}% Bonus Available!
                </div>
              )}
              {!canRun && (
                <div className="text-red-400 text-xs mt-2">
                  Need {night.minPerformers} performers
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedNight && (
        <div className="mt-4 p-3 bg-purple-900/30 rounded border border-purple-500">
          <div className="font-bold text-purple-300">Theme Selected!</div>
          <div className="text-sm text-gray-300 mt-1">
            {THEMED_NIGHTS.find(n => n.type === selectedNight)?.name}
          </div>
        </div>
      )}
    </div>
  );
}
