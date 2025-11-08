import { Performer } from '@/lib/types';
import { getChemistryIcon } from '@/lib/gameLogic';

interface ChemistryDisplayProps {
  performer: Performer;
  allPerformers: Performer[];
}

export default function ChemistryDisplay({ performer, allPerformers }: ChemistryDisplayProps) {
  const otherPerformers = allPerformers.filter(p => p.name !== performer.name);

  if (otherPerformers.length === 0) {
    return (
      <div className="text-sm text-gray-400 text-center p-4">
        No other performers to check chemistry with
      </div>
    );
  }

  const getRelationshipIcon = (relationship?: "alliance" | "feud" | "romance" | "neutral"): string => {
    if (!relationship || relationship === "neutral") return "🤝";
    if (relationship === "romance") return "💕";
    if (relationship === "alliance") return "🤜🤛";
    if (relationship === "feud") return "⚔️";
    return "🤝";
  };

  const getRelationshipColor = (relationship?: "alliance" | "feud" | "romance" | "neutral"): string => {
    if (!relationship || relationship === "neutral") return "text-gray-400";
    if (relationship === "romance") return "text-pink-400";
    if (relationship === "alliance") return "text-blue-400";
    if (relationship === "feud") return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-bold text-gray-300 mb-3">
        Chemistry & Relationships:
      </div>

      {otherPerformers.map((other) => {
        const chemistry = performer.chemistryWith[other.name] || 50;
        const relationship = performer.relationships[other.name] || "neutral";
        const chemIcon = getChemistryIcon(chemistry);
        const relIcon = getRelationshipIcon(relationship);

        return (
          <div key={other.name} className="bg-gray-800 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{chemIcon}</span>
                <span className="font-bold text-sm">{other.name}</span>
              </div>
              <span className={`text-xl ${getRelationshipColor(relationship)}`} title={relationship}>
                {relIcon}
              </span>
            </div>

            <div className="space-y-1">
              {/* Chemistry Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Chemistry</span>
                  <span className={
                    chemistry >= 80 ? "text-green-400" :
                    chemistry >= 60 ? "text-yellow-400" :
                    chemistry >= 40 ? "text-orange-400" :
                    "text-red-400"
                  }>{chemistry}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      chemistry >= 80 ? 'bg-green-500' :
                      chemistry >= 60 ? 'bg-yellow-500' :
                      chemistry >= 40 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${chemistry}%` }}
                  />
                </div>
              </div>

              {/* Relationship Status */}
              {relationship !== "neutral" && (
                <div className={`text-xs ${getRelationshipColor(relationship)} font-bold capitalize`}>
                  {relationship}
                </div>
              )}

              {/* Chemistry Tip */}
              {chemistry >= 80 && (
                <div className="text-xs text-green-400">
                  💕 Excellent chemistry! Pair them for themed nights!
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded mt-4">
        💡 <span className="font-bold">Chemistry Icons:</span> 💕 Excellent (80+), ⚡ Good (60+), 🤝 Neutral (40+), ❌ Poor (below 40)
      </div>
    </div>
  );
}
