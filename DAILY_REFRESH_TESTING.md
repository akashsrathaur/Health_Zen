# Daily Task Refresh - Testing Guide

## ✅ **FIXED: Daily Task Refresh Issues**

The Health Zen app now has multiple mechanisms to ensure tasks refresh daily:

### **1. Automatic Daily Reset Triggers**

#### **On App Launch**
- Dashboard checks for daily reset when it loads
- Auth context triggers reset check during login
- Ensures tasks are fresh when you start the app

#### **Periodic Background Checks** 
- Dashboard checks every 5 minutes for daily reset
- Ensures tasks refresh even if app stays open overnight
- Automatic without user intervention

### **2. Manual Reset Options**

#### **"Reset Day" Button**
- Added to dashboard for immediate testing
- Manually triggers daily reset for current user
- Useful for testing and debugging

#### **Development Testing**
```javascript
// In browser console (when logged in):
dailyResetService.manualReset(user.uid)
```

### **3. How Daily Reset Works**

#### **Reset Conditions**
- Automatically triggers when `lastResetDay !== today`
- Resets all daily metrics to zero
- Preserves streak based on actual activity
- Updates task completion states

#### **What Gets Reset Daily:**
✅ **Water Intake**: `0/8 glasses`  
✅ **Sleep Hours**: `0h`  
✅ **Gym Minutes**: `0/60 minutes`  
✅ **Medication**: `Pending` (doses reset to 0)  
✅ **Custom Tasks**: Reset to `Not set`  
✅ **Challenge Progress**: `isCompletedToday = false`  
✅ **Daily Points**: Reset to 0  

#### **What Persists:**
🔄 **Streak**: Based on consecutive daily activity  
🔄 **Total Points**: Cumulative lifetime points  
🔄 **Achievement Progress**: Unlocked badges remain  
🔄 **User Profile**: Settings and preferences  

### **4. Testing Steps**

#### **Method 1: Wait for Midnight**
1. Complete some tasks during the day
2. Wait until after midnight (12:00 AM)
3. Refresh the dashboard
4. All daily tasks should be reset to zero

#### **Method 2: Manual Testing (Immediate)**
1. Complete some tasks (water, gym, etc.)
2. Click the "Reset Day" button in dashboard
3. Observe all daily metrics reset immediately
4. Streak should update based on activity pattern

#### **Method 3: Browser Console Testing**
```javascript
// Open browser console (F12)
// Execute this when logged in:
await dailyResetService.checkAndTriggerResetIfNeeded(user.uid);
// Check console logs for reset confirmation
```

### **5. Expected Console Messages**

#### **When Reset is Needed:**
```
Checking daily reset for user xxx: lastResetDay=2025-09-20, today=2025-09-21
Triggering daily reset for user xxx
Starting daily reset for user: xxx
✅ Successfully reset daily metrics for user xxx
```

#### **When Reset Already Done:**
```
Checking daily reset for user xxx: lastResetDay=2025-09-21, today=2025-09-21  
Daily reset already completed today for user xxx
```

### **6. Troubleshooting**

#### **If Tasks Don't Reset:**

1. **Check Console Logs**
   - Open browser DevTools (F12)
   - Look for daily reset messages
   - Check for any error messages

2. **Verify Firebase Connection**
   - Ensure `.env.local` has correct Firebase config
   - Check if user is properly authenticated
   - Verify Firestore permissions

3. **Manual Trigger**
   - Use "Reset Day" button in dashboard
   - Should immediately reset all daily tasks
   - Check console for success/error messages

4. **Force Refresh**
   - Close and reopen the browser tab
   - Daily reset check runs on dashboard load
   - Should trigger if new day detected

### **7. Firebase Data Structure**

#### **User Document** (`users/{userId}`)
```json
{
  "lastResetDay": "2025-09-21",
  "dailyPoints": 0,
  "streak": 2,
  "dailyVibes": [
    {
      "id": "water",
      "value": "0/8 glasses", 
      "progress": 0,
      "completedAt": null
    }
  ]
}
```

#### **Daily Activities** (`dailyActivities/{userId-YYYY-MM-DD}`)
```json
{
  "date": "2025-09-21",
  "waterIntake": 0,
  "sleepHours": 0, 
  "gymMinutes": 0,
  "resetAt": "2025-09-21T00:00:00.000Z"
}
```

## **Result: ✅ Daily Tasks Now Refresh Properly**

- **Automatic**: Tasks reset at midnight and on app launch
- **Reliable**: Multiple fallback mechanisms ensure consistency
- **Manual**: "Reset Day" button for immediate testing
- **Persistent**: Historical data saved before reset
- **Smart**: Streak calculation based on actual activity patterns

Your Health Zen app now properly refreshes daily tasks! 🎉