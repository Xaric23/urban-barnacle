import { Performer } from '@/lib/types';
import { SKILL_CARDS } from '@/lib/constants';

interface CardDeckManagerProps {
  performer: Performer;
}

export default function CardDeckManager({ performer }: CardDeckManagerProps) {
  const performerCards = SKILL_CARDS.filter(card => performer.cards.includes(card.id));

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      tease: 'bg-pink-900/50 border-pink-500',
      dominance: 'bg-red-900/50 border-red-500',
      submission: 'bg-purple-900/50 border-purple-500',
      comedy: 'bg-yellow-900/50 border-yellow-500',
      mystery: 'bg-indigo-900/50 border-indigo-500',
      vanilla: 'bg-blue-900/50 border-blue-500',
    };
    return colors[category] || 'bg-gray-900/50 border-gray-500';
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      tease: '💋',
      dominance: '👑',
      submission: '🙇',
      comedy: '😂',
      mystery: '🎭',
      vanilla: '💝',
    };
    return icons[category] || '🎴';
  };

  return (
    <div className="space-y-4">
      {/* Performer's Cards */}
      <div>
        <h4 className="font-bold mb-3">🎴 {performer.name}&apos;s Card Collection</h4>
        {performerCards.length === 0 ? (
          <div className="text-gray-400 text-sm text-center p-4">
            No cards unlocked yet. Train and perform to earn cards!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {performerCards.map((card) => (
              <div
                key={card.id}
                className={`p-3 rounded border-2 ${getCategoryColor(card.category)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getCategoryIcon(card.category)}</span>
                  <span className="font-bold text-sm">{card.name}</span>
                </div>
                <div className="text-xs text-gray-300 mb-2">{card.description}</div>
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-400">⚡ {card.power}</span>
                  <span className="text-blue-400">Energy: {card.energyCost}</span>
                </div>
                {card.comboWith.length > 0 && (
                  <div className="mt-2 text-xs text-purple-300">
                    🔗 Combos: {card.comboWith.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archetype Info */}
      <div className="p-3 bg-gray-800 rounded">
        <div className="text-sm">
          <span className="font-bold">Personality:</span>{' '}
          <span className="text-purple-300 capitalize">{performer.personalityArchetype}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Each personality type starts with and can unlock specific cards
        </div>
      </div>

      {/* Card Usage Tip */}
      <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded">
        💡 <span className="font-bold">During Club Nights:</span> Use cards to boost performance and trigger combos for massive bonuses!
      </div>
    </div>
  );
}
