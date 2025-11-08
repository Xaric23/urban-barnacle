import { useState } from 'react';
import { GameState, ThemedNightType } from '@/lib/types';
import { performWork, calculateTraitBonus, calculateTips, calculateAdultServiceIncome, calculateThemedNightBonus, updateFame } from '@/lib/gameLogic';
import ThemedNightSelector from './ThemedNightSelector';

interface RunClubNightProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
  onBack: () => void;
}

export default function RunClubNight({ state, onUpdate, onBack }: RunClubNightProps) {
  const [selectedThemedNight, setSelectedThemedNight] = useState<ThemedNightType | null>(null);
  const [results, setResults] = useState<{
    performers: { name: string; income: number; tips: number; adultBonus: number; message: string; adultMessages: string[] }[];
    totalIncome: number;
    totalTips: number;
    totalAdultBonus: number;
    totalExpenses: number;
    netProfit: number;
    themedNightBonus?: string;
  } | null>(null);

  const handleRunNight = () => {
    const newState = { ...state };
    let totalIncome = 0;
    let totalTips = 0;
    let totalAdultBonus = 0;
    let totalExpenses = 0;
    const performerResults: { 
      name: string; 
      income: number; 
      tips: number; 
      adultBonus: number; 
      message: string;
      adultMessages: string[];
    }[] = [];

    newState.performers.forEach((performer, index) => {
      let income = performWork(performer);
      totalExpenses += performer.salary;

      let message = '';
      let tips = 0;
      let adultBonus = 0;
      const adultMessages: string[] = [];
      
      if (income > 0) {
        // Trait bonus
        const { bonus, message: traitMsg } = calculateTraitBonus(performer, income);
        income += bonus;
        
        // Tips
        const tipResult = calculateTips(performer, income, newState.ownedClothing);
        tips = tipResult.tips;
        
        // Adult services
        const adultResult = calculateAdultServiceIncome(performer, income);
        adultBonus = adultResult.bonus;
        adultMessages.push(...adultResult.messages);
        
        const total = income + tips + adultBonus;
        totalIncome += income;
        totalTips += tips;
        totalAdultBonus += adultBonus;
        
        message = traitMsg 
          ? `Base: $${income} (${traitMsg}) | Tips: $${tips} | Total: $${total}` 
          : `Base: $${income} | Tips: $${tips} | Total: $${total}`;
        
        // Update performer's lifetime tips
        const updatedPerformer = { ...performer };
        updatedPerformer.tipsEarned += tips;
        newState.performers[index] = updatedPerformer;
      } else {
        message = 'Too tired to perform';
        newState.performers[index] = { ...performer };
      }

      performerResults.push({
        name: performer.name,
        income,
        tips,
        adultBonus,
        message,
        adultMessages
      });
    });

    const totalRevenue = totalIncome + totalTips + totalAdultBonus;
    
    // Apply themed night bonus
    let themedNightBonusMessage = '';
    let themedNightMultiplier = 1;
    if (selectedThemedNight) {
      const workingPerformers = newState.performers.filter(p => p.energy >= 2);
      const themedBonus = calculateThemedNightBonus(workingPerformers, selectedThemedNight);
      if (themedBonus.bonus > 1) {
        themedNightMultiplier = themedBonus.bonus;
        themedNightBonusMessage = themedBonus.message;
      }
    }
    
    const finalRevenue = Math.floor(totalRevenue * themedNightMultiplier);
    const netProfit = finalRevenue - totalExpenses;
    newState.money += netProfit;

    // Update fame based on income
    updateFame(newState, finalRevenue);
    
    // Stage props and effects bonus
    const stageBonus = newState.stageProps.reduce((sum, prop) => sum + prop.appeal, 0);
    const effectsBonus = newState.activeEffects.length * 5; // 5% bonus per effect
    const stageBonusPct = (stageBonus + effectsBonus) / 100;
    const stageBonusMoney = Math.floor(finalRevenue * stageBonusPct);
    if (stageBonusMoney > 0) {
      newState.money += stageBonusMoney;
    }

    // Reputation changes
    if (netProfit > 0) {
      const repGain = Math.min(5, Math.floor(netProfit / 200));
      newState.reputation = Math.min(100, newState.reputation + repGain);
    }
    
    // Reset used cards
    newState.usedCardsThisNight = [];

    onUpdate(newState);
    setResults({
      performers: performerResults,
      totalIncome,
      totalTips,
      totalAdultBonus,
      totalExpenses,
      netProfit: netProfit + stageBonusMoney,
      themedNightBonus: themedNightBonusMessage || undefined
    });
  };

  if (results) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Club Night Results</h2>
        
        <div className="bg-gray-700 rounded-lg p-6 space-y-3">
          <h3 className="text-xl font-bold mb-3">Performer Results</h3>
          {results.performers.map((result, index) => (
            <div key={index} className="bg-gray-800 rounded p-3">
              <div className="flex justify-between items-start">
                <span className="font-bold">{result.name}</span>
                <span className={result.income > 0 ? 'text-green-400' : 'text-gray-400'}>
                  {result.income > 0 ? `$${result.income + result.tips + result.adultBonus}` : '-'}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-1">{result.message}</div>
              {result.adultMessages.length > 0 && (
                <div className="mt-2 space-y-1">
                  {result.adultMessages.map((msg, i) => (
                    <div key={i} className="text-xs text-pink-400">🔞 {msg}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3">Financial Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Income:</span>
              <span className="font-bold text-green-400">${results.totalIncome}</span>
            </div>
            <div className="flex justify-between">
              <span>💵 Tips:</span>
              <span className="font-bold text-green-400">${results.totalTips}</span>
            </div>
            {results.totalAdultBonus > 0 && (
              <div className="flex justify-between">
                <span>🔞 Adult Services:</span>
                <span className="font-bold text-pink-400">${results.totalAdultBonus}</span>
              </div>
            )}
            {results.themedNightBonus && (
              <div className="flex justify-between">
                <span>🎭 Themed Night:</span>
                <span className="font-bold text-purple-400">Bonus Applied!</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Total Expenses:</span>
              <span className="font-bold text-red-400">${results.totalExpenses}</span>
            </div>
            <div className="border-t border-gray-600 pt-2 mt-2"></div>
            <div className="flex justify-between text-lg">
              <span>Net Profit:</span>
              <span className={`font-bold ${results.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {results.netProfit >= 0 ? '+' : ''}{results.netProfit > 0 && '$'}{results.netProfit}
              </span>
            </div>
          </div>
        </div>
        
        {results.themedNightBonus && (
          <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
            <div className="font-bold text-purple-300 mb-1">🎭 Themed Night Success!</div>
            <div className="text-sm text-gray-300">{results.themedNightBonus}</div>
          </div>
        )}
        
        <button
          onClick={() => {
            setResults(null);
            onBack();
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Run Club Night</h2>
      
      {/* Themed Night Selector */}
      <ThemedNightSelector
        state={state}
        selectedNight={selectedThemedNight}
        onSelect={setSelectedThemedNight}
      />
      
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">Tonight&apos;s Lineup</h3>
        {state.performers.length === 0 ? (
          <p className="text-gray-400">No performers available!</p>
        ) : (
          <div className="space-y-2">
            {state.performers.map((performer, index) => (
              <div key={index} className="bg-gray-800 rounded p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold">{performer.name}</div>
                  <div className="text-sm text-gray-400">
                    {performer.performerType.toUpperCase()} • Skill: {performer.skill}/10
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Energy</div>
                  <div className={`font-bold ${performer.energy < 2 ? 'text-red-400' : 'text-green-400'}`}>
                    {performer.energy}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
        <p className="text-blue-200">
          💡 Tip: Make sure your performers have enough energy (at least 2) to work effectively!
        </p>
      </div>
      
      <button
        onClick={handleRunNight}
        disabled={state.performers.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition"
      >
        🎭 Open the Club!
      </button>
      
      <button
        onClick={onBack}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        ← Back to Menu
      </button>
    </div>
  );
}
