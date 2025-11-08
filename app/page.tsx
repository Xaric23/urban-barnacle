"use client";

import { useState, useEffect } from 'react';
import GameMenu from '@/components/GameMenu';
import GameHeader from '@/components/GameHeader';
import RecruitPerformer from '@/components/RecruitPerformer';
import ManagePerformers from '@/components/ManagePerformers';
import RunClubNight from '@/components/RunClubNight';
import ViewStats from '@/components/ViewStats';
import UpgradeShop from '@/components/UpgradeShop';
import { GameState } from '@/lib/types';
import { createInitialGameState, saveGameState, loadGameState, advanceDay } from '@/lib/gameLogic';

type GameView = 'menu' | 'recruit' | 'manage' | 'run' | 'stats' | 'upgrades';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      setGameState(saved);
      setShowWelcome(false);
    } else {
      setGameState(createInitialGameState());
    }
  }, []);

  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  const handleAdvanceDay = () => {
    if (gameState) {
      const newState = { ...gameState };
      advanceDay(newState);
      
      if (newState.money < 0) {
        alert("💀 GAME OVER! You ran out of money!");
        const newGame = createInitialGameState();
        setGameState(newGame);
        setCurrentView('menu');
      } else {
        setGameState(newState);
        setCurrentView('menu');
      }
    }
  };

  const handleNewGame = () => {
    if (confirm("Start a new game? This will erase your current progress.")) {
      const newState = createInitialGameState();
      setGameState(newState);
      setCurrentView('menu');
      setShowWelcome(false);
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="max-w-2xl bg-gray-800 rounded-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-4 text-center">🎭 Underground Club Manager 🎭</h1>
          <p className="text-lg mb-4">
            Welcome to Underground Club Manager! Manage your nightclub, recruit performers, 
            and navigate moral dilemmas.
          </p>
          <div className="bg-gray-700 rounded p-4 mb-6">
            <h2 className="text-xl font-bold mb-2">How to Play:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Recruit performers to work at your club</li>
              <li>Train them to increase their skills</li>
              <li>Run club nights to earn money</li>
              <li>Balance profit with ethics and relationships</li>
              <li>Navigate events and make tough decisions</li>
            </ul>
          </div>
          <div className="bg-gray-700 rounded p-4 mb-6">
            <h2 className="text-xl font-bold mb-2">Starting Resources:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Money: $5,000</li>
              <li>Reputation: 50/100</li>
              <li>Ethics Score: 50/100</li>
            </ul>
          </div>
          <button
            onClick={() => setShowWelcome(false)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Start Playing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <GameHeader state={gameState} onNewGame={handleNewGame} />
        
        <div className="mt-6 bg-gray-800 rounded-lg p-6 min-h-[500px]">
          {currentView === 'menu' && (
            <GameMenu
              state={gameState}
              onNavigate={setCurrentView}
              onAdvanceDay={handleAdvanceDay}
            />
          )}
          
          {currentView === 'recruit' && (
            <RecruitPerformer
              state={gameState}
              onUpdate={setGameState}
              onBack={() => setCurrentView('menu')}
            />
          )}
          
          {currentView === 'manage' && (
            <ManagePerformers
              state={gameState}
              onUpdate={setGameState}
              onBack={() => setCurrentView('menu')}
            />
          )}
          
          {currentView === 'run' && (
            <RunClubNight
              state={gameState}
              onUpdate={setGameState}
              onBack={() => setCurrentView('menu')}
            />
          )}
          
          {currentView === 'stats' && (
            <ViewStats
              state={gameState}
              onBack={() => setCurrentView('menu')}
            />
          )}
          
          {currentView === 'upgrades' && (
            <UpgradeShop
              state={gameState}
              onUpdate={setGameState}
              onBack={() => setCurrentView('menu')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
