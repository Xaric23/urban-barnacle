import { GameState } from '@/lib/types';

interface GameHeaderProps {
  state: GameState;
  onNewGame: () => void;
}

export default function GameHeader({ state, onNewGame }: GameHeaderProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border-2 border-purple-500">
      <h1 className="text-3xl font-bold text-center mb-4">🎭 Underground Club Manager 🎭</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-400 text-sm">Day</div>
          <div className="text-2xl font-bold">{state.day}</div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-400 text-sm">Money</div>
          <div className="text-2xl font-bold text-green-400">${state.money}</div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-400 text-sm">Reputation</div>
          <div className="text-2xl font-bold text-blue-400">{state.reputation}/100</div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-400 text-sm">Ethics</div>
          <div className="text-2xl font-bold text-purple-400">{state.ethicsScore}/100</div>
        </div>
      </div>
      <button
        onClick={onNewGame}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
      >
        New Game
      </button>
    </div>
  );
}
