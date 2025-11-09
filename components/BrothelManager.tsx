import { useState } from 'react';
import { GameState, BrothelWorker, BrothelService } from '@/lib/types';
import { 
  generateBrothelWorker, 
  hireBrothelWorker, 
  unlockBrothel, 
  purchaseBrothelRoom,
  runBrothelOperations,
  trainBrothelWorker,
  fireBrothelWorker,
  toggleWorkerService
} from '@/lib/gameLogic';
import { BROTHEL_ROOMS, SEX_ACTIONS } from '@/lib/constants';

interface BrothelManagerProps {
  state: GameState;
  onUpdate: (state: GameState) => void;
  onBack: () => void;
}

type BrothelView = 'main' | 'hire' | 'manage' | 'rooms' | 'operate';

export default function BrothelManager({ state, onUpdate, onBack }: BrothelManagerProps) {
  const [view, setView] = useState<BrothelView>('main');
  const [selectedWorker, setSelectedWorker] = useState<BrothelWorker | null>(null);
  const [candidateWorkers, setCandidateWorkers] = useState<BrothelWorker[]>([]);
  const [message, setMessage] = useState<string>('');

  const handleUnlockBrothel = () => {
    const result = unlockBrothel(state);
    setMessage(result.message);
    if (result.success) {
      onUpdate({ ...state });
    }
  };

  const generateCandidates = () => {
    const candidates = [];
    for (let i = 0; i < 3; i++) {
      candidates.push(generateBrothelWorker());
    }
    setCandidateWorkers(candidates);
    setView('hire');
  };

  const handleHireWorker = (worker: BrothelWorker) => {
    const result = hireBrothelWorker(state, worker);
    setMessage(result.message);
    if (result.success) {
      onUpdate({ ...state });
      setCandidateWorkers([]);
      setView('main');
    }
  };

  const handlePurchaseRoom = (roomId: string) => {
    const result = purchaseBrothelRoom(state, roomId);
    setMessage(result.message);
    if (result.success) {
      onUpdate({ ...state });
    }
  };

  const handleRunOperations = () => {
    const result = runBrothelOperations(state);
    
    // Apply ethics change
    state.ethicsScore = Math.max(0, Math.min(100, state.ethicsScore + result.ethicsChange));
    
    setMessage(result.messages.join('\n'));
    onUpdate({ ...state });
  };

  const handleTrainWorker = (workerId: string) => {
    const result = trainBrothelWorker(state, workerId);
    setMessage(result.message);
    if (result.success) {
      onUpdate({ ...state });
    }
  };

  const handleFireWorker = (workerId: string) => {
    const result = fireBrothelWorker(state, workerId);
    setMessage(result.message);
    if (result.success) {
      onUpdate({ ...state });
      setSelectedWorker(null);
    }
  };

  const handleToggleService = (workerId: string, service: BrothelService) => {
    const result = toggleWorkerService(state, workerId, service);
    setMessage(result.message);
    if (result.success) {
      onUpdate({ ...state });
      // Update selected worker reference
      const updated = state.brothelWorkers.find(w => w.id === workerId);
      if (updated) {
        setSelectedWorker({ ...updated });
      }
    }
  };

  // Main View - Not Unlocked
  if (!state.brothelEnabled) {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-center mb-4">🏩 Brothel</h2>
        
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Unlock the Brothel</h3>
          <p className="text-gray-300 mb-4">
            Expand your underground empire with a discrete brothel operation. 
            Hire workers, manage services, and earn substantial income.
          </p>
          
          <div className="bg-gray-800 rounded p-4 mb-4">
            <h4 className="font-bold mb-2">Requirements:</h4>
            <ul className="space-y-2 text-sm">
              <li className={state.money >= 10000 ? 'text-green-400' : 'text-red-400'}>
                💰 Cost: $10,000 {state.money >= 10000 ? '✓' : '✗'}
              </li>
              <li className={state.reputation >= 40 ? 'text-green-400' : 'text-red-400'}>
                ⭐ Reputation: 40+ (Current: {state.reputation}) {state.reputation >= 40 ? '✓' : '✗'}
              </li>
              <li className={state.ethicsScore <= 40 ? 'text-green-400' : 'text-red-400'}>
                ⚖️ Ethics: ≤40 (Current: {state.ethicsScore}) {state.ethicsScore <= 40 ? '✓' : '✗'}
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-900 border border-yellow-600 rounded p-4 mb-4">
            <p className="text-yellow-200 text-sm">
              ⚠️ <strong>Warning:</strong> Operating a brothel will impact your ethics score and 
              may affect your club's reputation. Proceed with caution.
            </p>
          </div>
          
          <button
            onClick={handleUnlockBrothel}
            disabled={state.money < 10000 || state.reputation < 40 || state.ethicsScore > 40}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Unlock Brothel ($10,000)
          </button>
        </div>
        
        {message && (
          <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
            <p className="text-blue-200">{message}</p>
          </div>
        )}
        
        <button
          onClick={onBack}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  // Main Menu View
  if (view === 'main') {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-center mb-4">🏩 Brothel Management</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{state.brothelWorkers.length}</div>
            <div className="text-sm text-gray-300">Workers</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{state.brothelRooms.length}</div>
            <div className="text-sm text-gray-300">Rooms</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{state.brothelReputation}</div>
            <div className="text-sm text-gray-300">Reputation</div>
          </div>
        </div>
        
        <button
          onClick={generateCandidates}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
        >
          <span>👥 Hire Worker</span>
          <span className="text-sm opacity-75">View candidates</span>
        </button>
        
        <button
          onClick={() => setView('manage')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
          disabled={state.brothelWorkers.length === 0}
        >
          <span>📋 Manage Workers</span>
          <span className="text-sm opacity-75">{state.brothelWorkers.length} worker(s)</span>
        </button>
        
        <button
          onClick={() => setView('rooms')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
        >
          <span>🏠 Purchase Rooms</span>
          <span className="text-sm opacity-75">{state.brothelRooms.length} owned</span>
        </button>
        
        <button
          onClick={handleRunOperations}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-between"
          disabled={state.brothelWorkers.length === 0 || state.brothelRooms.length === 0}
        >
          <span>🌙 Run Operations</span>
          <span className="text-sm opacity-75">Operate for the night</span>
        </button>
        
        {state.brothelSessions.length > 0 && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-bold mb-2">Recent Sessions</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {state.brothelSessions.slice(-10).reverse().map((session, idx) => (
                <div key={idx} className="text-sm bg-gray-800 rounded p-2">
                  <div className="flex justify-between">
                    <span>{session.workerName}</span>
                    <span className="text-green-400">+${session.income}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {session.service} • Satisfaction: {session.clientSatisfaction}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {message && (
          <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 whitespace-pre-line">
            <p className="text-blue-200">{message}</p>
          </div>
        )}
        
        <button
          onClick={onBack}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          ← Back to Menu
        </button>
      </div>
    );
  }

  // Hire View
  if (view === 'hire') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">👥 Hire Brothel Worker</h2>
        
        <div className="space-y-4">
          {candidateWorkers.map((worker, idx) => (
            <div key={idx} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{worker.name}</h3>
                  <p className="text-sm text-gray-400">{worker.gender} • {worker.personalityArchetype}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Skill</div>
                  <div className="text-2xl font-bold text-yellow-400">{worker.skill}/10</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="bg-gray-800 rounded p-2">
                  <div className="text-gray-400">Energy</div>
                  <div className="font-bold">{worker.energy}/10</div>
                </div>
                <div className="bg-gray-800 rounded p-2">
                  <div className="text-gray-400">Comfort</div>
                  <div className="font-bold">{worker.comfortLevel}/100</div>
                </div>
                <div className="bg-gray-800 rounded p-2">
                  <div className="text-gray-400">Salary</div>
                  <div className="font-bold text-green-400">${worker.salary}/day</div>
                </div>
                <div className="bg-gray-800 rounded p-2">
                  <div className="text-gray-400">Hiring Cost</div>
                  <div className="font-bold text-red-400">${worker.salary * 30}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-400 mb-1">Physical Attributes:</div>
                <div className="text-sm">
                  {worker.breastSize && <span className="mr-3">Bust: {worker.breastSize}</span>}
                  {worker.penisSize && <span>Size: {worker.penisSize}</span>}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-400 mb-1">Services Offered:</div>
                <div className="flex flex-wrap gap-1">
                  {worker.offeredServices.map(service => (
                    <span key={service} className="bg-purple-900 text-purple-200 text-xs px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-400 mb-1">Traits:</div>
                <div className="flex flex-wrap gap-1">
                  {worker.traits.map(trait => (
                    <span key={trait} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => handleHireWorker(worker)}
                disabled={state.money < worker.salary * 30}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition"
              >
                Hire for ${worker.salary * 30}
              </button>
            </div>
          ))}
        </div>
        
        {message && (
          <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
            <p className="text-blue-200">{message}</p>
          </div>
        )}
        
        <button
          onClick={() => setView('main')}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  // Manage Workers View
  if (view === 'manage') {
    if (selectedWorker) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4">📋 Manage: {selectedWorker.name}</h2>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded p-3">
                <div className="text-sm text-gray-400">Skill</div>
                <div className="text-xl font-bold text-yellow-400">{selectedWorker.skill}/10</div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-sm text-gray-400">Energy</div>
                <div className="text-xl font-bold">{selectedWorker.energy}/10</div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-sm text-gray-400">Comfort</div>
                <div className="text-xl font-bold">{selectedWorker.comfortLevel}/100</div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-sm text-gray-400">Reputation</div>
                <div className="text-xl font-bold">{selectedWorker.reputation}</div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded p-3 mb-4">
              <div className="text-sm text-gray-400">Career Stats</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>Total Earnings: <span className="text-green-400 font-bold">${selectedWorker.totalEarnings}</span></div>
                <div>Shifts Worked: <span className="font-bold">{selectedWorker.shiftsWorked}</span></div>
              </div>
              <div className="mt-2">Daily Salary: <span className="text-red-400 font-bold">${selectedWorker.salary}</span></div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold mb-2">Services Offered:</h4>
              <div className="space-y-2">
                {Object.values(BrothelService).map(service => {
                  const isOffered = selectedWorker.offeredServices.includes(service);
                  return (
                    <div key={service} className="flex items-center justify-between bg-gray-800 rounded p-2">
                      <span className={isOffered ? 'text-green-400' : 'text-gray-500'}>{service}</span>
                      <button
                        onClick={() => handleToggleService(selectedWorker.id, service)}
                        className={`px-3 py-1 rounded text-sm ${
                          isOffered 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        } transition`}
                      >
                        {isOffered ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleTrainWorker(selectedWorker.id)}
                disabled={selectedWorker.skill >= 10 || state.money < selectedWorker.skill * 500}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition"
              >
                Train Worker (${selectedWorker.skill * 500})
              </button>
              
              <button
                onClick={() => handleFireWorker(selectedWorker.id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Fire Worker (Severance: ${selectedWorker.salary * 7})
              </button>
            </div>
          </div>
          
          {message && (
            <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
              <p className="text-blue-200">{message}</p>
            </div>
          )}
          
          <button
            onClick={() => {
              setSelectedWorker(null);
              setMessage('');
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            ← Back to Workers
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">📋 Manage Workers</h2>
        
        <div className="space-y-3">
          {state.brothelWorkers.map(worker => (
            <div 
              key={worker.id}
              className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition"
              onClick={() => setSelectedWorker(worker)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{worker.name}</h3>
                  <p className="text-sm text-gray-400">{worker.gender} • {worker.personalityArchetype}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Skill</div>
                  <div className="text-xl font-bold text-yellow-400">{worker.skill}/10</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>Energy: <span className="font-bold">{worker.energy}/10</span></div>
                <div>Comfort: <span className="font-bold">{worker.comfortLevel}/100</span></div>
                <div>Salary: <span className="text-green-400 font-bold">${worker.salary}/day</span></div>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                {worker.offeredServices.length} services • ${worker.totalEarnings} earned
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setView('main')}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  // Rooms View
  if (view === 'rooms') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">🏠 Brothel Rooms</h2>
        
        <div className="space-y-4">
          {BROTHEL_ROOMS.map(room => {
            const owned = state.brothelRooms.some(r => r.id === room.id);
            const canAfford = state.money >= room.cost;
            const meetsReputation = state.reputation >= room.unlockRequirement.reputation;
            const meetsEthics = state.ethicsScore <= room.unlockRequirement.ethics;
            
            return (
              <div key={room.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    <p className="text-sm text-gray-400">Tier {room.tier}</p>
                  </div>
                  {owned && (
                    <span className="bg-green-600 text-white text-sm px-3 py-1 rounded">Owned</span>
                  )}
                </div>
                
                <p className="text-sm text-gray-300 mb-3">{room.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">Cost</div>
                    <div className={`font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                      ${room.cost}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">Daily Income</div>
                    <div className="font-bold text-green-400">${room.dailyIncome}</div>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">Capacity</div>
                    <div className="font-bold">{room.capacity} workers</div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded p-2 mb-3 text-sm">
                  <div className="font-bold mb-1">Requirements:</div>
                  <div className={meetsReputation ? 'text-green-400' : 'text-red-400'}>
                    Reputation: {room.unlockRequirement.reputation}+ {meetsReputation ? '✓' : '✗'}
                  </div>
                  <div className={meetsEthics ? 'text-green-400' : 'text-red-400'}>
                    Ethics: ≤{room.unlockRequirement.ethics} {meetsEthics ? '✓' : '✗'}
                  </div>
                </div>
                
                {!owned && (
                  <button
                    onClick={() => handlePurchaseRoom(room.id)}
                    disabled={!canAfford || !meetsReputation || !meetsEthics}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition"
                  >
                    Purchase Room
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        {message && (
          <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
            <p className="text-blue-200">{message}</p>
          </div>
        )}
        
        <button
          onClick={() => setView('main')}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  return null;
}
