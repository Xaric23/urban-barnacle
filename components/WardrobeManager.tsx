import { useState } from 'react';
import { GameState, Performer, ClothingSlot } from '@/lib/types';
import { CLOTHING_CATALOG } from '@/lib/constants';

interface WardrobeManagerProps {
  state: GameState;
  performer: Performer;
  performerIndex: number;
  onUpdate: (state: GameState) => void;
  onBack: () => void;
}

export default function WardrobeManager({ state, performer, performerIndex, onUpdate, onBack }: WardrobeManagerProps) {
  const [selectedSlot, setSelectedSlot] = useState<ClothingSlot | null>(null);

  const handleBuyClothing = (itemId: string) => {
    const item = CLOTHING_CATALOG.find(c => c.id === itemId);
    if (!item) return;

    if (state.money < item.cost) {
      alert(`Not enough money! Need $${item.cost}`);
      return;
    }

    if (state.ownedClothing.includes(itemId)) {
      alert('You already own this item!');
      return;
    }

    const newState = { ...state };
    newState.money -= item.cost;
    newState.ownedClothing = [...newState.ownedClothing, itemId];
    onUpdate(newState);
    alert(`Purchased ${item.name} for $${item.cost}!`);
  };

  const handleEquipClothing = (itemId: string) => {
    const item = CLOTHING_CATALOG.find(c => c.id === itemId);
    if (!item) return;

    if (!state.ownedClothing.includes(itemId)) {
      alert('You must purchase this item first!');
      return;
    }

    const newState = { ...state };
    const updatedPerformer = { ...newState.performers[performerIndex] };
    updatedPerformer.wardrobe = { ...updatedPerformer.wardrobe };
    updatedPerformer.wardrobe[item.slot] = itemId;
    newState.performers[performerIndex] = updatedPerformer;
    onUpdate(newState);
    alert(`${performer.name} is now wearing ${item.name}!`);
    setSelectedSlot(null);
  };

  const handleUnequip = (slot: ClothingSlot) => {
    const newState = { ...state };
    const updatedPerformer = { ...newState.performers[performerIndex] };
    updatedPerformer.wardrobe = { ...updatedPerformer.wardrobe };
    updatedPerformer.wardrobe[slot] = null;
    newState.performers[performerIndex] = updatedPerformer;
    onUpdate(newState);
    alert(`Unequipped ${slot}`);
  };

  const getItemById = (itemId: string | null) => {
    if (!itemId) return null;
    return CLOTHING_CATALOG.find(c => c.id === itemId);
  };

  const getSlotName = (slot: ClothingSlot) => {
    const names = {
      [ClothingSlot.TOP]: 'Top',
      [ClothingSlot.BOTTOM]: 'Bottom',
      [ClothingSlot.SHOES]: 'Shoes',
      [ClothingSlot.ACCESSORY]: 'Accessory',
    };
    return names[slot];
  };

  if (selectedSlot !== null) {
    const slotItems = CLOTHING_CATALOG.filter(item => item.slot === selectedSlot);
    const equippedItemId = performer.wardrobe[selectedSlot];

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Select {getSlotName(selectedSlot)}</h2>
        
        {equippedItemId && (
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Currently Equipped</h3>
                <p>{getItemById(equippedItemId)?.name}</p>
              </div>
              <button
                onClick={() => handleUnequip(selectedSlot)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Unequip
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {slotItems.map((item) => {
            const isOwned = state.ownedClothing.includes(item.id);
            const isEquipped = performer.wardrobe[selectedSlot] === item.id;

            return (
              <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Appeal</div>
                    <div className="font-bold text-purple-400">{item.appeal}/10</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-green-400 font-bold">${item.cost}</div>
                  
                  {isEquipped ? (
                    <span className="text-blue-400 font-bold">✓ Equipped</span>
                  ) : isOwned ? (
                    <button
                      onClick={() => handleEquipClothing(item.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Equip
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyClothing(item.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setSelectedSlot(null)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          ← Back to Wardrobe
        </button>
      </div>
    );
  }

  const totalAppeal = Object.values(performer.wardrobe).reduce((sum, itemId) => {
    if (!itemId) return sum;
    const item = getItemById(itemId);
    return sum + (item?.appeal || 0);
  }, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{performer.name}&apos;s Wardrobe 👔</h2>
      
      <div className="bg-gray-700 rounded-lg p-6">
        <div className="text-center mb-4">
          <div className="text-gray-400 text-sm">Total Outfit Appeal</div>
          <div className="text-3xl font-bold text-purple-400">{totalAppeal}/40</div>
          <div className="text-xs text-gray-500 mt-1">Higher appeal = More tips!</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.values(ClothingSlot).map((slot) => {
            const equippedItemId = performer.wardrobe[slot];
            const equippedItem = getItemById(equippedItemId);

            return (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className="bg-gray-800 hover:bg-gray-600 rounded-lg p-4 text-left transition"
              >
                <div className="text-gray-400 text-xs mb-1">{getSlotName(slot)}</div>
                {equippedItem ? (
                  <>
                    <div className="font-bold">{equippedItem.name}</div>
                    <div className="text-xs text-purple-400">Appeal: {equippedItem.appeal}</div>
                  </>
                ) : (
                  <div className="text-gray-500 italic">Empty</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        ← Back to Performer
      </button>
    </div>
  );
}
