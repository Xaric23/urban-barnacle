"use client";

import { useState, useEffect } from 'react';
import GameMenu from '@/components/GameMenu';
import GameHeader from '@/components/GameHeader';
import RecruitPerformer from '@/components/RecruitPerformer';
import ManagePerformers from '@/components/ManagePerformers';
import RunClubNight from '@/components/RunClubNight';
import ViewStats from '@/components/ViewStats';
import UpgradeShop from '@/components/UpgradeShop';
import LoadingScreen from '@/components/LoadingScreen';
import DramaManager from '@/components/DramaManager';
import StageCustomizer from '@/components/StageCustomizer';
import ExpansionDashboard from '@/components/ExpansionDashboard';
import CrowdMoodDashboard from '@/components/CrowdMoodDashboard';
import { GameState } from '@/lib/types';
import { createInitialGameState, advanceDay, updateChemistryForAllPerformers, updateCrowdMood, applySeasonalTrends, checkForViralTrend, generateRumor, checkForSabotage, calculateExpansionIncome, checkForCelebrityCameo } from '@/lib/gameLogic';
import { bootstrapGame, saveToStorage, deleteSave, BootstrapState, BootstrapStatus } from '@/lib/bootstrap';

type GameView = 'menu' | 'recruit' | 'manage' | 'run' | 'stats' | 'upgrades' | 'drama' | 'stage' | 'expansions' | 'trends';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [showWelcome, setShowWelcome] = useState(true);
  const [bootstrapState, setBootstrapState] = useState<BootstrapState>({
    status: BootstrapStatus.INITIALIZING,
    progress: 0,
    message: 'Starting...',
    warnings: [],
  });
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    // Bootstrap the game on mount
    const initGame = async () => {
      const result = await bootstrapGame(setBootstrapState);
      
      if (result.success) {
        setGameState(result.gameState);
        setShowWelcome(result.isNewGame);
        
        // Show warnings if any
        if (result.warnings.length > 0) {
          setTimeout(() => {
            alert('⚠️ Warnings:\n' + result.warnings.join('\n'));
          }, 500);
        }
      } else {
        alert('Failed to load game: ' + result.error);
        setGameState(createInitialGameState());
      }
      
      // Keep loading screen visible for a moment
      setTimeout(() => {
        setIsBootstrapping(false);
      }, 800);
    };

    initGame();
  }, []);

  useEffect(() => {
    // Auto-save game state changes
    if (gameState && !isBootstrapping) {
      saveToStorage(gameState);
    }
  }, [gameState, isBootstrapping]);

  const handleAdvanceDay = () => {
    if (gameState) {
      const newState = { ...gameState };
      
      // Update chemistry for all performers
      updateChemistryForAllPerformers(newState.performers);
      
      // Update crowd mood and trends
      updateCrowdMood(newState);
      applySeasonalTrends(newState);
      const viralTrend = checkForViralTrend(newState);
      
      // Generate rumors
      const rumor = generateRumor(newState);
      if (rumor) {
        newState.activeRumors.push(rumor);
        newState.dramaLevel = Math.min(100, newState.dramaLevel + 5);
      }
      
      // Check for sabotage
      const sabotage = checkForSabotage(newState);
      
      // Calculate expansion income
      const expansionIncome = calculateExpansionIncome(newState);
      newState.money += expansionIncome.income;
      
      // Advance day (pays salaries, etc.)
      advanceDay(newState);
      
      // Apply maintenance costs
      newState.money -= newState.maintenanceCost;
      
      // Build event messages
      const messages: string[] = [];
      if (viralTrend) messages.push(`🔥 Viral Trend Alert: ${viralTrend} is trending!`);
      if (rumor) messages.push(`🎭 New Rumor: ${rumor.title}`);
      if (sabotage) messages.push(`⚠️ SABOTAGE: ${sabotage.message}`);
      if (expansionIncome.income > 0) messages.push(...expansionIncome.messages);
      
      // Check for celebrity cameo
      const cameo = checkForCelebrityCameo(newState);
      if (cameo) {
        messages.push(`⭐ Celebrity Cameo: ${cameo.celebrity} visited your club! +$${cameo.bonus}`);
        newState.money += cameo.bonus;
        newState.fame = Math.min(100, newState.fame + 5);
      }
      
      // Show messages
      if (messages.length > 0) {
        alert("Day " + newState.day + " Events:\n\n" + messages.join('\n'));
      }
      
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
      deleteSave();
      const newState = createInitialGameState();
      setGameState(newState);
      setCurrentView('menu');
      setShowWelcome(false);
    }
  };

  // Show loading screen during bootstrap
  if (isBootstrapping) {
    return <LoadingScreen bootstrapState={bootstrapState} />;
  }

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
          <div className="bg-purple-900 bg-opacity-40 border border-purple-500 rounded p-4 mb-6">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              🔒 Protected by Anti-Cheat
            </h2>
            <p className="text-sm text-gray-300">
              Your save files are protected with SHA-256 checksums to ensure fair play and prevent tampering.
            </p>
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
          
          {currentView === 'drama' && (
            <DramaManager
              state={gameState}
              onUpdate={setGameState}
            />
          )}
          
          {currentView === 'stage' && (
            <StageCustomizer
              state={gameState}
              onUpdate={setGameState}
            />
          )}
          
          {currentView === 'expansions' && (
            <ExpansionDashboard
              state={gameState}
              onUpdate={setGameState}
            />
          )}
          
          {currentView === 'trends' && (
            <CrowdMoodDashboard
              state={gameState}
            />
          )}
        </div>
        
        {/* Back button for new views */}
        {(currentView === 'drama' || currentView === 'stage' || currentView === 'expansions' || currentView === 'trends') && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentView('menu')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              ← Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
