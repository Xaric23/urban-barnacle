import { GameState } from '@/lib/types';
import { unlockCamShowBranch, unlockVIPWebsite } from '@/lib/gameLogic';

interface ExpansionDashboardProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
}

export default function ExpansionDashboard({ state, onUpdate }: ExpansionDashboardProps) {
  const handleUnlockCamShow = () => {
    const newState = { ...state };
    const result = unlockCamShowBranch(newState);
    if (result.success) {
      alert(result.message);
      onUpdate(newState);
    } else {
      alert(result.message);
    }
  };

  const handleUnlockVIP = () => {
    const newState = { ...state };
    const result = unlockVIPWebsite(newState);
    if (result.success) {
      alert(result.message);
      onUpdate(newState);
    } else {
      alert(result.message);
    }
  };

  const getFameColor = (fame: number): string => {
    if (fame >= 80) return 'text-yellow-400';
    if (fame >= 60) return 'text-purple-400';
    if (fame >= 40) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getFameLevel = (fame: number): string => {
    if (fame >= 90) return '🌟 LEGENDARY';
    if (fame >= 80) return '⭐ SUPERSTAR';
    if (fame >= 60) return '✨ FAMOUS';
    if (fame >= 40) return '📈 RISING';
    if (fame >= 20) return '🌱 EMERGING';
    return '🔰 UNKNOWN';
  };

  return (
    <div className="space-y-6">
      {/* Fame Meter */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">⭐ Fame & Recognition</h3>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Fame Level:</span>
            <span className={`font-bold ${getFameColor(state.fame)}`}>
              {getFameLevel(state.fame)}
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${
                state.fame >= 80 ? 'bg-yellow-500' :
                state.fame >= 60 ? 'bg-purple-500' :
                state.fame >= 40 ? 'bg-blue-500' :
                'bg-gray-500'
              }`}
              style={{ width: `${state.fame}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">{state.fame}/100</div>
        </div>

        {state.fame >= 70 && (
          <div className="p-3 bg-yellow-900/30 rounded border border-yellow-500">
            <div className="font-bold text-yellow-300">🎬 Celebrity Cameos Available!</div>
            <div className="text-sm text-gray-300 mt-1">
              High fame attracts celebrity guests who boost your club's reputation
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400">
          💡 Increase fame by earning high profits and maintaining high reputation
        </div>
      </div>

      {/* Expansion Options */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">💼 Business Expansions</h3>
        
        <div className="space-y-4">
          {/* Cam Show Branch */}
          <div className={`p-4 rounded border-2 ${
            state.camShowBranch ? 'border-green-500 bg-green-900/30' : 'border-gray-600 bg-gray-800'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold">📹 Cam Show Branch</div>
                <div className="text-sm text-gray-300 mt-1">
                  Performers earn passive income streaming from home
                </div>
              </div>
              {state.camShowBranch && (
                <span className="text-green-400 font-bold">✓ ACTIVE</span>
              )}
            </div>
            
            {state.camShowBranch ? (
              <div className="mt-3 p-2 bg-gray-900 rounded text-sm">
                <div className="text-green-400">
                  Daily Income: ~${state.performers.length * 100}+ per day
                </div>
              </div>
            ) : (
              <button
                onClick={handleUnlockCamShow}
                disabled={state.money < 10000}
                className={`mt-3 w-full py-2 rounded font-bold transition ${
                  state.money >= 10000
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                Unlock for $10,000
              </button>
            )}
          </div>

          {/* VIP Website */}
          <div className={`p-4 rounded border-2 ${
            state.vipWebsite ? 'border-green-500 bg-green-900/30' : 'border-gray-600 bg-gray-800'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold">🌐 VIP Member Website</div>
                <div className="text-sm text-gray-300 mt-1">
                  Exclusive content attracts premium paying members
                </div>
              </div>
              {state.vipWebsite && (
                <span className="text-green-400 font-bold">✓ ACTIVE</span>
              )}
            </div>
            
            {state.vipWebsite ? (
              <div className="mt-3 p-2 bg-gray-900 rounded text-sm">
                <div className="text-green-400">
                  Daily Income: ~${Math.floor(state.reputation * 10)}+ per day
                </div>
              </div>
            ) : (
              <button
                onClick={handleUnlockVIP}
                disabled={state.money < 15000}
                className={`mt-3 w-full py-2 rounded font-bold transition ${
                  state.money >= 15000
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                Unlock for $15,000
              </button>
            )}
          </div>

          {/* Managed Troupes (Coming Soon) */}
          <div className="p-4 rounded border-2 border-gray-700 bg-gray-800/50 opacity-60">
            <div className="font-bold">🎭 Manage Other Clubs</div>
            <div className="text-sm text-gray-300 mt-1">
              Expand your empire by managing troupes at partner clubs
            </div>
            <div className="mt-3 text-xs text-gray-400">
              🔒 Coming in future update
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
