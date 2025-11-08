import { GameState } from '@/lib/types';

interface CrowdMoodDashboardProps {
  state: GameState;
}

export default function CrowdMoodDashboard({ state }: CrowdMoodDashboardProps) {
  const getMoodColor = (value: number): string => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMoodBar = (value: number): string => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">📊 Crowd Demands & Trends</h3>
      
      {/* Viral Trends */}
      {state.viralTrends.length > 0 && (
        <div className="mb-4 p-3 bg-pink-900/30 rounded border border-pink-500">
          <div className="font-bold text-pink-300 mb-2">🔥 VIRAL TRENDS!</div>
          {state.viralTrends.map((trend, i) => (
            <div key={i} className="text-sm text-pink-200">⚡ {trend}</div>
          ))}
        </div>
      )}
      
      {/* Seasonal Trends */}
      {state.seasonalTrends.length > 0 && (
        <div className="mb-4 p-3 bg-blue-900/30 rounded border border-blue-500">
          <div className="font-bold text-blue-300 mb-2">🌟 Seasonal Favorites</div>
          <div className="text-sm text-blue-200">
            {state.seasonalTrends.join(', ')}
          </div>
        </div>
      )}
      
      {/* Crowd Mood Bars */}
      <div className="space-y-3">
        <div className="text-sm font-bold text-gray-400 mb-2">Audience Interest:</div>
        {Object.entries(state.crowdMood).map(([kink, value]) => (
          <div key={kink} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm capitalize">{kink.replace('_', ' ')}</span>
              <span className={`text-sm font-bold ${getMoodColor(value)}`}>{value}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className={`${getMoodBar(value)} h-2 rounded-full transition-all`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        💡 Tip: Schedule themed nights matching high-demand trends for maximum profit!
      </div>
    </div>
  );
}
