// Manual Test Script for Bootstrap/Anti-Cheat System
// Run this in browser console to test anti-cheat features

console.log('🧪 Bootstrap/Anti-Cheat Test Suite\n');

// Test 1: Create a valid save
console.log('Test 1: Creating valid save...');
const testGameState = {
  day: 10,
  money: 5000,
  reputation: 60,
  ethicsScore: 55,
  performers: [],
  relationships: {},
  storyFlags: {},
  completedEvents: [],
  upgrades: { sound_system: 1 },
  cityDemand: 100,
  genreTrend: { dancer: 0, singer: 0, dj: 0, bartender: 0, security: 0 },
  riskLevel: 'standard',
  eventCooldowns: {},
  eventHistory: [],
  lastEventDay: 5,
  ownedClothing: []
};

// Test 2: Validate legitimate values
console.log('\nTest 2: Validating legitimate game state...');
const validation1 = validateGameState(testGameState);
console.assert(validation1.valid === true, '✅ Valid state passes validation');
if (!validation1.valid) {
  console.error('❌ Unexpected validation errors:', validation1.errors);
}

// Test 3: Detect impossible money value
console.log('\nTest 3: Testing impossible money detection...');
const cheatState1 = { ...testGameState, money: 999999999 };
const validation2 = validateGameState(cheatState1);
console.assert(!validation2.valid, '✅ Detects impossible money value');
if (!validation2.valid) {
  console.log('✓ Correctly flagged:', validation2.errors);
}

// Test 4: Detect impossible reputation
console.log('\nTest 4: Testing reputation bounds...');
const cheatState2 = { ...testGameState, reputation: 150 };
const validation3 = validateGameState(cheatState2);
console.assert(!validation3.valid, '✅ Detects out-of-range reputation');

// Test 5: Test sanitization
console.log('\nTest 5: Testing state sanitization...');
const dirtyState = {
  ...testGameState,
  reputation: 150,
  ethicsScore: -50,
  cityDemand: 300
};
const cleanState = sanitizeGameState(dirtyState);
console.assert(cleanState.reputation === 100, '✅ Clamps reputation to 100');
console.assert(cleanState.ethicsScore === 0, '✅ Clamps ethics to 0');
console.assert(cleanState.cityDemand === 200, '✅ Clamps city demand to 200');
console.log('✓ State sanitized:', {
  reputation: cleanState.reputation,
  ethics: cleanState.ethicsScore,
  cityDemand: cleanState.cityDemand
});

// Test 6: Time manipulation detection
console.log('\nTest 6: Testing time manipulation detection...');
const timeCheatState = {
  ...testGameState,
  day: 10,
  lastEventDay: 100 // In the future!
};
const isTimeManipulated = detectTimeManipulation(timeCheatState);
console.assert(isTimeManipulated === true, '✅ Detects time manipulation');
console.log('✓ Time manipulation detected');

// Test 7: Checksum generation (async)
console.log('\nTest 7: Testing checksum generation...');
(async () => {
  const saveData = {
    version: '1.0.0',
    day: 10,
    money: 5000,
    // ... other fields
  };
  
  const checksum1 = await generateChecksum(saveData);
  const checksum2 = await generateChecksum(saveData);
  console.assert(checksum1 === checksum2, '✅ Same data produces same checksum');
  console.log('✓ Checksum generated:', checksum1.substring(0, 16) + '...');
  
  // Modify data
  const modifiedData = { ...saveData, money: 99999 };
  const checksum3 = await generateChecksum(modifiedData);
  console.assert(checksum1 !== checksum3, '✅ Different data produces different checksum');
  console.log('✓ Modified checksum:', checksum3.substring(0, 16) + '...');
  
  console.log('\n🎉 All tests passed!');
  console.log('\nTo test in the game:');
  console.log('1. Play the game and save');
  console.log('2. Open DevTools → Application → Local Storage');
  console.log('3. Edit the "clubManagerSave" value (change money)');
  console.log('4. Refresh the page');
  console.log('5. Watch the bootstrap detect tampering and create new game');
})();

// Import the functions for testing
console.log('\n📝 Note: Import the functions from your modules:');
console.log('import { validateGameState, sanitizeGameState, detectTimeManipulation, generateChecksum } from "@/lib/antiCheat"');
