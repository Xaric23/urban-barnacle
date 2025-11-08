import { useState } from 'react';
import { GameState, Rumor } from '@/lib/types';
import { resolveRumor } from '@/lib/gameLogic';

interface DramaManagerProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
}

export default function DramaManager({ state, onUpdate }: DramaManagerProps) {
  const [message, setMessage] = useState<string>('');

  const handleResolve = (rumor: Rumor, type: "diplomacy" | "bribe" | "ignore") => {
    const newState = { ...state };
    const result = resolveRumor(newState, rumor, type);
    setMessage(result.message);
    onUpdate(newState);
    
    setTimeout(() => setMessage(''), 3000);
  };

  const getDramaColor = (level: number): string => {
    if (level >= 70) return 'text-red-400';
    if (level >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSeverityColor = (severity: "low" | "medium" | "high"): string => {
    if (severity === "high") return 'bg-red-900/50 border-red-500';
    if (severity === "medium") return 'bg-yellow-900/50 border-yellow-500';
    return 'bg-blue-900/50 border-blue-500';
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">🎭 Staff Drama & Gossip</h3>
      
      {/* Drama Level */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">Drama Level:</span>
          <span className={`font-bold ${getDramaColor(state.dramaLevel)}`}>
            {state.dramaLevel}/100
          </span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              state.dramaLevel >= 70 ? 'bg-red-500' :
              state.dramaLevel >= 40 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${state.dramaLevel}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {state.dramaLevel >= 70 && '⚠️ High drama is affecting performance!'}
          {state.dramaLevel >= 40 && state.dramaLevel < 70 && '⚠️ Drama is building up'}
          {state.dramaLevel < 40 && '✅ Drama levels are manageable'}
        </div>
      </div>

      {/* Active Rumors */}
      {state.activeRumors.length === 0 ? (
        <div className="text-center p-6 text-gray-400">
          No active rumors. All is calm... for now.
        </div>
      ) : (
        <div className="space-y-3">
          {state.activeRumors.map((rumor) => (
            <div
              key={rumor.id}
              className={`p-4 rounded border-2 ${getSeverityColor(rumor.severity)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold">{rumor.title}</div>
                <div className="text-xs px-2 py-1 bg-gray-800 rounded">
                  Day {rumor.dayStarted}
                </div>
              </div>
              <div className="text-sm text-gray-300 mb-2">{rumor.description}</div>
              <div className="text-xs text-gray-400 mb-3">
                Involved: {rumor.involvedPerformers.join(', ')}
              </div>
              
              <div className="flex gap-2">
                {rumor.resolutionOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleResolve(rumor, option.type)}
                    disabled={option.cost > state.money}
                    className={`flex-1 px-3 py-2 rounded text-sm transition ${
                      option.cost > state.money
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : option.type === 'diplomacy'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : option.type === 'bribe'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold capitalize">{option.type}</div>
                    <div className="text-xs">
                      {option.cost > 0 ? `$${option.cost}` : 'Free'} | 
                      {Math.floor(option.successChance * 100)}% chance
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {message && (
        <div className="mt-4 p-3 bg-purple-900/30 rounded border border-purple-500">
          <div className="text-sm text-purple-200">{message}</div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        💡 Tip: Resolve rumors quickly to prevent drama from escalating and affecting club performance!
      </div>
    </div>
  );
}
