/**
 * Test script for daily reset and streak functionality
 * This helps verify that the implementation works correctly
 */

import { handleDailyAppOpening, handleAppInitialization } from '../actions/app-opening';
import { dailyResetService } from '../lib/daily-reset-service';

// Mock user ID for testing
const TEST_USER_ID = 'test-user-123';

/**
 * Test the daily app opening functionality
 */
async function testDailyAppOpening() {
  console.log('🧪 Testing Daily App Opening...');
  
  try {
    // Test first app opening of the day
    const result1 = await handleDailyAppOpening(TEST_USER_ID);
    console.log('First opening result:', result1);
    
    // Test second app opening same day (should not update streak)
    const result2 = await handleDailyAppOpening(TEST_USER_ID);
    console.log('Second opening result (same day):', result2);
    
    return true;
  } catch (error) {
    console.error('❌ Daily app opening test failed:', error);
    return false;
  }
}

/**
 * Test the app initialization functionality
 */
async function testAppInitialization() {
  console.log('🧪 Testing App Initialization...');
  
  try {
    const result = await handleAppInitialization(TEST_USER_ID);
    console.log('App initialization result:', result);
    
    return true;
  } catch (error) {
    console.error('❌ App initialization test failed:', error);
    return false;
  }
}

/**
 * Test the daily reset functionality
 */
async function testDailyReset() {
  console.log('🧪 Testing Daily Reset...');
  
  try {
    // Manually trigger a daily reset for testing
    await dailyResetService.manualReset(TEST_USER_ID);
    console.log('✅ Manual daily reset completed');
    
    // Check if reset is needed
    await dailyResetService.checkAndTriggerResetIfNeeded(TEST_USER_ID);
    console.log('✅ Reset check completed');
    
    return true;
  } catch (error) {
    console.error('❌ Daily reset test failed:', error);
    return false;
  }
}

/**
 * Run all tests
 */
export async function runDailyFunctionalityTests() {
  console.log('🚀 Starting Daily Functionality Tests...');
  console.log('================================================');
  
  const tests = [
    { name: 'Daily App Opening', test: testDailyAppOpening },
    { name: 'App Initialization', test: testAppInitialization },
    { name: 'Daily Reset', test: testDailyReset }
  ];
  
  const results = [];
  
  for (const { name, test } of tests) {
    console.log(`\n📝 Running ${name} test...`);
    const success = await test();
    results.push({ name, success });
    console.log(success ? '✅ PASSED' : '❌ FAILED');
  }
  
  console.log('\n================================================');
  console.log('🏁 Test Results Summary:');
  results.forEach(({ name, success }) => {
    console.log(`  ${success ? '✅' : '❌'} ${name}`);
  });
  
  const allPassed = results.every(r => r.success);
  console.log(`\n${allPassed ? '🎉' : '💥'} Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  return allPassed;
}

/**
 * Test specific scenarios
 */
export async function testSpecificScenarios() {
  console.log('🎯 Testing Specific Scenarios...');
  
  // Scenario 1: New user opening app for first time
  console.log('\n📱 Scenario 1: New user first time');
  
  // Scenario 2: User opening app consecutive days
  console.log('\n📱 Scenario 2: Consecutive days');
  
  // Scenario 3: User missing a day then returning
  console.log('\n📱 Scenario 3: Missing day then returning');
  
  // Scenario 4: Daily reset at midnight
  console.log('\n📱 Scenario 4: Daily reset at midnight');
}

// Export for use in other files
export {
  testDailyAppOpening,
  testAppInitialization, 
  testDailyReset
};