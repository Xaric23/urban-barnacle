import { useState } from 'react';
import { GameState } from '@/lib/types';
import { STAGE_PROPS, SPECIAL_EFFECTS } from '@/lib/constants';

interface StageCustomizerProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
}

export default function StageCustomizer({ state, onUpdate }: StageCustomizerProps) {
  const [message, setMessage] = useState<string>('');

  const handleBuyProp = (propId: string) => {
    const prop = STAGE_PROPS.find(p => p.id === propId);
    if (!prop) return;

    if (state.money < prop.cost) {
      setMessage("Not enough money!");
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (state.stageProps.some(p => p.id === propId)) {
      setMessage("Already own this prop!");
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const newState = { ...state };
    newState.money -= prop.cost;
    newState.stageProps.push(prop);
    newState.maintenanceCost += prop.maintenanceCost;
    setMessage(`Purchased ${prop.name}!`);
    onUpdate(newState);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleBuyEffect = (effectId: string) => {
    const effect = SPECIAL_EFFECTS.find(e => e.id === effectId);
    if (!effect) return;

    if (state.money < effect.cost) {
      setMessage("Not enough money!");
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (state.activeEffects.includes(effectId)) {
      setMessage("Already own this effect!");
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const newState = { ...state };
    newState.money -= effect.cost;
    newState.activeEffects.push(effectId);
    newState.maintenanceCost += effect.maintenanceCost;
    setMessage(`Purchased ${effect.name}!`);
    onUpdate(newState);
    setTimeout(() => setMessage(''), 2000);
  };

  const totalAppeal = state.stageProps.reduce((sum, prop) => sum + prop.appeal, 0);
  const totalImpact = state.activeEffects.reduce((sum, effectId) => {
    const effect = SPECIAL_EFFECTS.find(e => e.id === effectId);
    return sum + (effect?.impact || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎪 Stage Customization</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800 rounded p-3">
            <div className="text-sm text-gray-400">Stage Appeal</div>
            <div className="text-2xl font-bold text-purple-400">{totalAppeal}</div>
          </div>
          <div className="bg-gray-800 rounded p-3">
            <div className="text-sm text-gray-400">Effect Impact</div>
            <div className="text-2xl font-bold text-pink-400">{totalImpact}</div>
          </div>
        </div>

        <div className="p-3 bg-yellow-900/30 rounded border border-yellow-500">
          <div className="text-sm">
            <span className="font-bold">Daily Maintenance:</span>{' '}
            <span className="text-red-400">${state.maintenanceCost}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Paid automatically each day for props and effects
          </div>
        </div>
      </div>

      {/* Stage Props */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎭 Stage Props</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STAGE_PROPS.map((prop) => {
            const owned = state.stageProps.some(p => p.id === prop.id);
            return (
              <div
                key={prop.id}
                className={`p-4 rounded border-2 ${
                  owned ? 'border-green-500 bg-green-900/30' : 'border-gray-600 bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold">{prop.name}</div>
                  {owned && <span className="text-green-400 text-sm">✓ OWNED</span>}
                </div>
                <div className="text-xs text-gray-300 mb-3">{prop.description}</div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-purple-400">Appeal: +{prop.appeal}</span>
                  <span className="text-yellow-400">${prop.cost}</span>
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  Maintenance: ${prop.maintenanceCost}/day
                </div>
                {!owned && (
                  <button
                    onClick={() => handleBuyProp(prop.id)}
                    disabled={state.money < prop.cost}
                    className={`w-full py-2 rounded text-sm font-bold transition ${
                      state.money >= prop.cost
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Purchase
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Effects */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">✨ Special Effects</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SPECIAL_EFFECTS.map((effect) => {
            const owned = state.activeEffects.includes(effect.id);
            return (
              <div
                key={effect.id}
                className={`p-4 rounded border-2 ${
                  owned ? 'border-green-500 bg-green-900/30' : 'border-gray-600 bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold">{effect.name}</div>
                  {owned && <span className="text-green-400 text-sm">✓ ACTIVE</span>}
                </div>
                <div className="text-xs text-gray-300 mb-3">{effect.description}</div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-pink-400">Impact: +{effect.impact}</span>
                  <span className="text-yellow-400">${effect.cost}</span>
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  Maintenance: ${effect.maintenanceCost}/day
                </div>
                {!owned && (
                  <button
                    onClick={() => handleBuyEffect(effect.id)}
                    disabled={state.money < effect.cost}
                    className={`w-full py-2 rounded text-sm font-bold transition ${
                      state.money >= effect.cost
                        ? 'bg-pink-600 hover:bg-pink-700'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Purchase
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {message && (
        <div className="fixed bottom-4 right-4 p-4 bg-purple-900 border border-purple-500 rounded-lg shadow-lg">
          <div className="text-white">{message}</div>
        </div>
      )}

      <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded">
        💡 <span className="font-bold">Tip:</span> Props and effects boost show ratings and audience satisfaction, leading to higher income!
      </div>
    </div>
  );
}
