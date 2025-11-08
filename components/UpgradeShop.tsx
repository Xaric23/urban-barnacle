import { GameState } from '@/lib/types';
import { UPGRADE_CATALOG, calculateUpgradeCost, purchaseUpgrade } from '@/lib/gameLogic';

interface UpgradeShopProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
  onBack: () => void;
}

export default function UpgradeShop({ state, onUpdate, onBack }: UpgradeShopProps) {
  const handlePurchase = (upgradeId: string) => {
    const newState = { ...state };
    const result = purchaseUpgrade(newState, upgradeId);
    
    if (result.success) {
      onUpdate(newState);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Club Upgrades</h2>
      
      <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 mb-4">
        <p className="text-blue-200">
          💡 Upgrades improve your club&apos;s performance and unlock new opportunities. Costs increase with each level.
        </p>
      </div>
      
      <div className="space-y-3">
        {Object.entries(UPGRADE_CATALOG).map(([id, upgrade]) => {
          const currentLevel = state.upgrades[id] || 0;
          const isMaxed = currentLevel >= upgrade.maxLevel;
          const cost = isMaxed ? 0 : calculateUpgradeCost(upgrade, currentLevel);
          const canAfford = state.money >= cost;

          return (
            <div key={id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{upgrade.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{upgrade.desc}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-400">Level</div>
                  <div className="text-xl font-bold text-purple-400">
                    {currentLevel}/{upgrade.maxLevel}
                  </div>
                </div>
              </div>
              
              {!isMaxed ? (
                <button
                  onClick={() => handlePurchase(id)}
                  disabled={!canAfford}
                  className={`w-full font-bold py-2 px-4 rounded transition ${
                    canAfford
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? `Purchase - $${cost}` : `Not enough money - $${cost}`}
                </button>
              ) : (
                <div className="bg-purple-900 border border-purple-600 rounded p-2 text-center text-purple-200">
                  ✓ MAXED OUT
                </div>
              )}
            </div>
          );
        })}
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
