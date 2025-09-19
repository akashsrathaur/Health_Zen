export const motivationalMessages = [
  "Aaj ka date, tum aur tumhari gym shoes. Miss mat karna. 😉",
  "Ready to get hooked? Our workout plan is more addictive than your crush's DPs.",
  "Wanna feel a spark? Let's get your metabolism going. 🔥",
  "Humara breakup nahi hoga. We'll stick with you until you hit your goal.",
  "Your body is not a machine, it's a masterpiece. Let's sculpt it. 💖",
  "I have a crush on your discipline. Let's turn it into a full-blown routine.",
  "Suno, I know a secret. Your workout session is the best self-care you can do. ✨",
  "Pyaar karna hai toh apne aap se karo. Start with a 15-min workout.",
  "Tum fitness ke liye bane ho, aur hum tumhe inspire karne ke liye. Aaja, shuru karte hain.",
  "Your heart is saying, \"Let's run a little.\" Listen to it. ❤️",
  "Feeling hungry? Let's feed that muscle, not the cravings. 💪",
  "Are you a workout session? Because I can't wait to see you every day.",
  "Don't just dream of a six-pack, let's make it a reality, one crunch at a time.",
  "Is the gym your ex? Time to find a new love: consistency. 🏃‍♂️",
  "Ready to feel good from the inside out? Let's start now. You've got this!",
  "Missed your workout? Don't worry, we're not mad. Just disappointed (and ready to help). 😉",
  "Aaj ka menu: Sweat, dedication, and progress. Order now!",
  "Chalo, ek date par chalte hain. You and a dumbbell. A perfect match. 💑",
  "Your body is saying, \"I miss you.\" Reply with a workout session. 💌",
  "Tired of the same old Netflix and chill? Let's try \"Squat and Thrill.\"",
  "Humne dekha hai tumko, sirf mobile mein scrolling karte hue. Chal, thodi stretching karle. 👀",
  "Ready to Glow Up? Let's make that skin, mind, and body shine. 💖",
  "Why are you scrolling? Your future healthy self is waiting! 😊",
  "Aao, fitness ke liye aag lagate hain! No, not literally. Just with a workout. 🔥",
  "Dil pe haath rakho aur bolo, \"Aaj main workout karunga.\" 🤞",
  "Ready to impress yourself? Let's smash that fitness goal. 💪",
  "Your muscles are lonely. Show them some love with a new challenge! 🥰",
  "Pyaar kiya toh darna kya? Workout kiya toh thakna kya? 😉",
  "Your health is your first love. Let's nurture it. ❤️",
  "Feeling stressed? A quick workout session can fix that. 🤗",
  "Let's make some memories... and burn some calories along the way! 📸",
  "Ready to make your heart happy? A little cardio will do the trick. ❤️",
  "What's your plan for today? Hint: It should involve some sweat. 🌬️",
  "Your future self will thank you for today's workout. Trust me. 🙏",
  "Fitness is not a destination, it's a beautiful journey. Let's start! 🚶‍♀️",
  "Hey, stranger, it's been a while. Let's reconnect with a healthy habit. 👋",
  "Don't just talk about it, be about it. Let's start today.",
  "Bahar mausam bada romantic hai, chal, ek quick workout ho jaye? 🚶‍♂️",
  "Don't let yesterday's workout be today's excuse. Get moving! 🏃",
  "You had me at \"Let's go for a run.\" 😉",
  "Ready to get serious? Let's schedule your next workout.",
  "Missed a day? Don't worry, we still love you. Just don't make it a habit. 😉",
  "Your daily dose of motivation, delivered right here. Tap to get started.",
  "Feeling lazy? A little workout can be the perfect pick-me-up.",
  "Ready to build that habit? Every workout counts.",
  "What's your excuse today? Let's find a solution together.",
  "Suno, there's a new challenge waiting for you. Are you ready for it?",
  "Consistency is key, and we're here to help you turn the lock. 🔑",
  "Don't just swipe away. This is your sign to get moving.",
  "You're stronger than you think. Let's prove it with a new routine. 💪"
];

export function getRandomMotivationalMessage(): string {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
}

export function getMotivationalNotification() {
  const message = getRandomMotivationalMessage();
  return {
    title: "HealthZen Motivation 🌿",
    description: message
  };
}