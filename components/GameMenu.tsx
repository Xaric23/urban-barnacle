import { GameState } from '@/lib/types';

interface GameMenuProps {
  state: GameState;
  onNavigate: (view: 'recruit' | 'manage' | 'run' | 'stats' | 'upgrades' | 'drama' | 'stage' | 'expansions' | 'trends') => void;
  onAdvanceDay: () => void;
}

export default function GameMenu({ state, onNavigate, onAdvanceDay }: GameMenuProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Main Menu</h2>
      
      <button
        onClick={() => onNavigate('recruit')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
      >
        <span>🎤 Recruit Performer</span>
        <span className="text-sm opacity-75">Hire new talent</span>
      </button>
      
      <button
        onClick={() => onNavigate('manage')}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
        disabled={state.performers.length === 0}
      >
        <span>👥 Manage Performers</span>
        <span className="text-sm opacity-75">{state.performers.length} performer(s)</span>
      </button>
      
      <button
        onClick={() => onNavigate('run')}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
        disabled={state.performers.length === 0}
      >
        <span>🎭 Run Club Night</span>
        <span className="text-sm opacity-75">Open for business</span>
      </button>
      
      <button
        onClick={() => onNavigate('upgrades')}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
      >
        <span>⬆️ Club Upgrades</span>
        <span className="text-sm opacity-75">Improve facilities</span>
      </button>
      
      <button
        onClick={() => onNavigate('drama')}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
      >
        <span>🎭 Staff Drama</span>
        <span className="text-sm opacity-75">{state.activeRumors.length} active rumor(s)</span>
      </button>
      
      <button
        onClick={() => onNavigate('stage')}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
      >
        <span>🎪 Stage & Effects</span>
        <span className="text-sm opacity-75">{state.stageProps.length + state.activeEffects.length} items</span>
      </button>
      
      <button
        onClick={() => onNavigate('expansions')}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
      >
        <span>⭐ Fame & Expansions</span>
        <span className="text-sm opacity-75">Fame: {state.fame}/100</span>
      </button>
      
      <button
        onClick={() => onNavigate('trends')}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
      >
        <span>📊 Crowd Trends</span>
        <span className="text-sm opacity-75">{state.viralTrends.length} viral trend(s)</span>
      </button>
      
      <button
        onClick={() => onNavigate('stats')}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
      >
        <span>📊 View Statistics</span>
        <span className="text-sm opacity-75">Club overview</span>
      </button>
      
      <button
        onClick={onAdvanceDay}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
      >
        <span>⏭️ Advance Day</span>
        <span className="text-sm opacity-75">Next day</span>
      </button>
      
      {state.performers.length === 0 && (
        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mt-4">
          <p className="text-yellow-200 text-center">
            ⚠️ You need to recruit performers to run your club!
          </p>
        </div>
      )}
    </div>
  );
}
