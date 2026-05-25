/* ==========================================================================
   ROAST ME AI - INTERACTIVE LOGIC & SYNTHESIZER (Expanded Dialogues V2)
   ========================================================================== */

// 1. Audio System (Web Audio API Synthesizer)
let audioCtx = null;
let isMuted = false;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Short synthetic beep for UI interaction
function playClickSound() {
  if (isMuted) return;
  initAudio();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

// Custom synthesizers for different intensities
function playRoastSound(intensity) {
  if (isMuted) return;
  initAudio();

  const now = audioCtx.currentTime;

  if (intensity === 'mild') {
    // Mild Sizzle: White noise sizzle
    const bufferSize = audioCtx.sampleRate * 0.8;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to make it sound like cooking/sizzling
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 1.5;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noiseNode.start();
    noiseNode.stop(now + 0.8);

  } else if (intensity === 'spicy') {
    // Spicy: Neon retro laser zap
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);

    // Add a second detuned oscillator for crunchiness
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(810, now);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.6);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc2.start();
    osc.stop(now + 0.6);
    osc2.stop(now + 0.6);

  } else if (intensity === 'nuclear') {
    // Nuclear: Synthesized bass-heavy explosion + alarm sound
    
    // 1. Bass drop
    const bassOsc = audioCtx.createOscillator();
    const bassGain = audioCtx.createGain();
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(120, now);
    bassOsc.frequency.linearRampToValueAtTime(10, now + 1.5);
    
    bassGain.gain.setValueAtTime(0.3, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    // Filter to make it muddy and heavy
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 150;
    
    bassOsc.connect(lowpass);
    lowpass.connect(bassGain);
    bassGain.connect(audioCtx.destination);
    
    bassOsc.start();
    bassOsc.stop(now + 1.5);

    // 2. Alarm siren sliding up and down
    const sirenOsc = audioCtx.createOscillator();
    const sirenGain = audioCtx.createGain();
    sirenOsc.type = 'sine';
    
    sirenOsc.frequency.setValueAtTime(300, now);
    sirenOsc.frequency.linearRampToValueAtTime(600, now + 0.4);
    sirenOsc.frequency.linearRampToValueAtTime(300, now + 0.8);
    sirenOsc.frequency.linearRampToValueAtTime(600, now + 1.2);
    
    sirenGain.gain.setValueAtTime(0.06, now);
    sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    
    sirenOsc.connect(sirenGain);
    sirenGain.connect(audioCtx.destination);
    
    sirenOsc.start();
    sirenOsc.stop(now + 1.4);
  }
}

// Success chime
function playSuccessSound() {
  if (isMuted) return;
  initAudio();
  
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
  
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const noteTime = now + (idx * 0.1);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.setValueAtTime(0.12, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(noteTime);
    osc.stop(noteTime + 0.35);
  });
}

// Sad failure slide
function playFailSound() {
  if (isMuted) return;
  initAudio();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 0.6);
  
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}

// Retro arcade alert sound for the egg button
function playEggSound() {
  if (isMuted) return;
  initAudio();
  
  const now = audioCtx.currentTime;
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc1.type = 'square';
  osc1.frequency.setValueAtTime(220, now);
  osc1.frequency.setValueAtTime(110, now + 0.15);
  osc1.frequency.setValueAtTime(55, now + 0.3);
  
  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(225, now);
  osc2.frequency.setValueAtTime(115, now + 0.15);
  osc2.frequency.setValueAtTime(60, now + 0.3);
  
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc1.start();
  osc2.start();
  osc1.stop(now + 0.5);
  osc2.stop(now + 0.5);
}

// 2. Roast Database (Keywords & Categories)
const KEYWORD_ROASTS = {
  // Languages
  "python": {
    "mild": "You write Python? You probably cannot write complex code and your programs run very slowly. Try harder, for real.",
    "spicy": "You write Python? You think you are smart because you copy packages that other people wrote to do your work. 💀",
    "nuclear": "YOU USE PYTHON? YOU SPEND ALL DAY FIXING SPACING ERRORS. YOUR PROGRAMS RUN SLOWER THAN A TURTLE. COPIED SCRIPT DEV, NO CAP."
  },
  "javascript": {
    "mild": "Javascript? A very confusing language where simple math doesn't work. The math is not mathing, just like your life choices.",
    "spicy": "Javascript is your main skill? You spend all day fixing errors and trying to find out why your page is blank. Mid.",
    "nuclear": "JAVASCRIPT DEVELOPMENT? THE WHOLE LANGUAGE IS A JOKE. YOU INSTALL GIANT PACKAGES JUST TO CENTER A SUBTITLE. CODE IS UNSTABLE, FR."
  },
  "js": {
    "mild": "Javascript? A very confusing language where simple math doesn't work. The math is not mathing, just like your life choices.",
    "spicy": "Javascript is your main skill? You spend all day fixing errors and trying to find out why your page is blank. Mid.",
    "nuclear": "JAVASCRIPT DEVELOPMENT? THE WHOLE LANGUAGE IS A JOKE. YOU INSTALL GIANT PACKAGES JUST TO CENTER A SUBTITLE. CODE IS UNSTABLE, FR."
  },
  "rust": {
    "mild": "You use Rust? You spend 4 hours satisfying the compiler just to print a list of numbers.",
    "spicy": "You code in Rust? You haven't finished a single project in 2 years, but you write articles about memory safety. Delulu.",
    "nuclear": "RUST FANBOY! WE GET IT, YOU LIKE MEMORY SAFETY. TOO BAD NOBODY WANTS TO TALK TO YOU ANYWAY. GO COMPILE FOR AN HOUR AND CRY."
  },
  "react": {
    "mild": "React? Why write standard clean website files when you can wrap it in 4 layers of hooks and states?",
    "spicy": "Using React for everything? You spent more time fixing packages than building actual websites. Coping.",
    "nuclear": "REACT OVERLORD! OVER-ENGINEERING A SIMPLE PORTFOLIO JUST TO LOOK COOL. A SIMPLE BUTTON NEEDS 4 PACKAGES AND FAITH TO RUN. 💀"
  },
  "c++": {
    "mild": "C++? Enjoy manual memory errors. Do not leak your personal details like your code leaks memory.",
    "spicy": "C++ code? You feel superior to web developers but spend 3 days tracking down a single pointer that crashed your computer.",
    "nuclear": "C++ USER! YOU VOLUNTARILY GET COMPUTER CRASHES IN 2026. THE COMPILER IS BULLYING YOU AND YOU LOVE IT. YOUR CODE CRASHES HARDER THAN YOUR EGO."
  },
  "cpp": {
    "mild": "C++? Enjoy manual memory errors. Do not leak your personal details like your code leaks memory.",
    "spicy": "C++ code? You feel superior to web developers but spend 3 days tracking down a single pointer that crashed your computer.",
    "nuclear": "C++ USER! YOU VOLUNTARILY GET COMPUTER CRASHES IN 2026. THE COMPILER IS BULLYING YOU AND YOU LOVE IT. YOUR CODE CRASHES HARDER THAN YOUR EGO."
  },
  "html": {
    "mild": "HTML and CSS? Bro centers one text box and calls himself a professional engineer. Calm down.",
    "spicy": "Calling yourself a programmer for styling a page? That's like claiming to be a pilot because you folded a paper airplane.",
    "nuclear": "HTML SCRUB! YOU THINK A COLUMN GRID IS ADVANCED MATH. YOU SPEND 8 HOURS ADJUSTING PADDING ONLY TO BREAK MOBILE VIEW. GO LEARN REAL PROGRAMMING, FR."
  },
  "css": {
    "mild": "HTML and CSS? Bro centers one text box and calls himself a professional engineer. Calm down.",
    "spicy": "Calling yourself a programmer for styling a page? That's like claiming to be a pilot because you folded a paper airplane.",
    "nuclear": "HTML SCRUB! YOU THINK A COLUMN GRID IS ADVANCED MATH. YOU SPEND 8 HOURS ADJUSTING PADDING ONLY TO BREAK MOBILE VIEW. GO LEARN REAL PROGRAMMING, FR."
  },
  // Tech buzzwords
  "ai": {
    "mild": "AI enthusiast? You just write prompts and call it your own work.",
    "spicy": "Using AI for everything? Your brain is getting lazy. Even the chatbot is tired of doing your work.",
    "nuclear": "AI WRAPPER DEV! YOU CANNOT WRITE A SIMPLE LOOP WITHOUT AN AI PROMPT. IF THE CHATBOT GOES DOWN, YOU WILL NOT BE ABLE TO THINK."
  },
  "chatgpt": {
    "mild": "AI enthusiast? You just write prompts and call it your own work.",
    "spicy": "Using AI for everything? Your brain is getting lazy. Even the chatbot is tired of doing your work.",
    "nuclear": "AI WRAPPER DEV! YOU CANNOT WRITE A SIMPLE LOOP WITHOUT AN AI PROMPT. IF THE CHATBOT GOES DOWN, YOU WILL NOT BE ABLE TO THINK."
  },
  "gemini": {
    "mild": "AI enthusiast? You just write prompts and call it your own work.",
    "spicy": "Using AI for everything? Your brain is getting lazy. Even the chatbot is tired of doing your work.",
    "nuclear": "AI WRAPPER DEV! YOU CANNOT WRITE A SIMPLE LOOP WITHOUT AN AI PROMPT. IF THE CHATBOT GOES DOWN, YOU WILL NOT BE ABLE TO THINK."
  },
  // Finance/Crypto
  "crypto": {
    "mild": "Crypto? Keep holding. I am sure that digital coin will pay your bills one day. Coping hard.",
    "spicy": "Crypto trader? The only thing more unstable than your coin is your ability to hold a normal conversation. 💀",
    "nuclear": "CRYPTO SPECULATOR! YOU ARE DOWN 98% ALL-TIME AND CALL IT 'BUYING THE DIP'. YOU GET FINANCIAL ADVICE FROM TWITTER JOKES. TRAGIC VIBE."
  },
  "bitcoin": {
    "mild": "Crypto? Keep holding. I am sure that digital coin will pay your bills one day. Coping hard.",
    "spicy": "Crypto trader? The only thing more unstable than your coin is your ability to hold a normal conversation. 💀",
    "nuclear": "CRYPTO SPECULATOR! YOU ARE DOWN 98% ALL-TIME AND CALL IT 'BUYING THE DIP'. YOU GET FINANCIAL ADVICE FROM TWITTER JOKES. TRAGIC VIBE."
  },
  "nft": {
    "mild": "Crypto? Keep holding. I am sure that digital coin will pay your bills one day. Coping hard.",
    "spicy": "Crypto trader? The only thing more unstable than your coin is your ability to hold a normal conversation. 💀",
    "nuclear": "CRYPTO SPECULATOR! YOU ARE DOWN 98% ALL-TIME AND CALL IT 'BUYING THE DIP'. YOU GET FINANCIAL ADVICE FROM TWITTER JOKES. TRAGIC VIBE."
  },
  // Games
  "valorant": {
    "mild": "Valorant player? Check your corners. And check if you took a shower this week. You smell bad.",
    "spicy": "Hardstuck Silver in Valorant? You spend $100 on game skins but cannot buy yourself any self-respect. Mid.",
    "nuclear": "VALORANT ADDICT! YOU SPEND 6 HOURS A DAY SCREAMING AT TEENAGERS FOR A GAME. AIM IS SHAKIER THAN YOUR FUTURE. TOUCH GRASS."
  },
  "league": {
    "mild": "League of Legends? I'm sorry to hear that. Life gets better, promise. Or does it? 💀",
    "spicy": "League player? You have toxic talking skills. You probably get mad when your friends do not reply in 2 seconds.",
    "nuclear": "LEAGUE OF LEGENDS PLAYER! YOU SPEND ALL DAY SCREAMING AT TEAMMATES. REPORTED MORE PEOPLE THAN THE POLICE. SHOWER IMMEDIATELY."
  },
  "lol": {
    "mild": "League of Legends? I'm sorry to hear that. Life gets better, promise. Or does it? 💀",
    "spicy": "League player? You have toxic talking skills. You probably get mad when your friends do not reply in 2 seconds.",
    "nuclear": "LEAGUE OF LEGENDS PLAYER! YOU SPEND ALL DAY SCREAMING AT TEAMMATES. REPORTED MORE PEOPLE THAN THE POLICE. SHOWER IMMEDIATELY."
  },
  // Lifestyle
  "gym": {
    "mild": "Going to the gym? Nice. Remember to train your social skills too. Those look weak.",
    "spicy": "Gym bro? Lifting heavy weights to forget about your empty inbox? Your protein powder has more personality than you, fr.",
    "nuclear": "GYM ADDICT! STANDING IN FRONT OF THE MIRROR FOR 2 HOURS. YOU CALCULATE MACROS BUT CANNOT DO SIMPLE MATH. FLEXING WON'T MAKE HER COME BACK, BRUH."
  },
  "dating": {
    "mild": "Dating? I'm sure your personality is good... somewhere. Just keep swiping, delulu.",
    "spicy": "Your dating bio says you 'love travel' because you have absolutely nothing else to say. Mid.",
    "nuclear": "DATING DISASTER! YOU GO ON DATES JUST TO GET GHOSTED. BIO IS A MESS. SAVE 500 LOVE QUOTES BUT ALONE FOR LIFE. TRAGIC."
  },
  "single": {
    "mild": "Single? That's fine, it gives you more time to focus on your zero hobbies.",
    "spicy": "Single by choice? Yeah, the choice of every other person around you.",
    "nuclear": "SINGLE FOREVER! YOUR PERSONALITY IS A NATURAL REPELLENT. YOUR LIFESTYLE IS AN EMERGENCY BROADCAST. SHOWER IMMEDIATELY."
  }
};

const CATEGORY_ROASTS = {
  "code": {
    "mild": [
      "Your code looks like a toddler slammed their hands on the keyboard.",
      "I have seen cleaner code in websites from 30 years ago.",
      "Your save messages are just 'please work' and 'I hate this'. Mid developer.",
      "Your code is so messy that it looks like a cat walked on the keyboard.",
      "Using basic console logs to find errors? Junior dev energy.",
      "Still pushing code directly to the main server? Very risky.",
      "Your project size is larger than your bank account. Fix it.",
      "You spend all your time styling buttons and call it programming.",
      "Force pushing is the only way you know how to solve code issues.",
      "You hide failing tests instead of fixing them. Lazy developer.",
      "You use bright screen mode because you like hurting your eyes.",
      "Still using old ways to query databases? Enjoy database leaks.",
      "Your folder names are just 'final (1)', 'final (2)'. Total mess.",
      "Your HTML is so bad you write spacing tags just to make it look taller.",
      "Using a helper package for simple math? The calculator is crying.",
      "You spend hours fixing conflicts on a blog that nobody reads.",
      "Your code theme is the best thing about your whole project.",
      "Your variables are named a, b, c. Nobody knows what they mean.",
      "You copy code from tutorials and forget to change the text.",
      "You write CSS files with 5000 lines of code. It takes forever to load.",
      "Your code editor has 50 open tabs. You are not using any of them.",
      "You center a box on a page and put it on your resume as full stack.",
      "You spend more time picking fonts than writing actual logic.",
      "You download a library to check if a number is even or odd."
    ],
    "spicy": [
      "Your save history is a list of your coding mistakes. Mid developer.",
      "You spend 8 hours automating a task that takes 2 minutes. Lazy work.",
      "Your variable names are confusing. 'temp_final_v2'? Ridiculous.",
      "Your code has so many patches. A single small change will break it all.",
      "Writing 200 lines of code for something that needs one line. Bad logic.",
      "You argued for 3 hours about tabs vs spaces but the site still fails to load.",
      "Leaving passwords in your public code files. You got caught in 4k.",
      "You write low-level code like you want your computer to crash.",
      "Your code is so slow that the cleanup script fell asleep waiting.",
      "You use advanced libraries but do not know why your page renders 50 times.",
      "Your manual is just a link that returns error messages. Great job.",
      "You call yourself a backend dev because you set up a simple server template.",
      "Your tests are cheating to show fake good results.",
      "Your database runs like Jenga. One user clicks and it collapses.",
      "You call yourself senior but still copy basic code for standard functions.",
      "Your code is so heavy that loading it on a phone makes it hot.",
      "You spend 5 hours setting up tools but still fail the simple test.",
      "You use AI to write code but do not know how to fix its errors.",
      "Your website breaks every time the browser updates. Terrible quality.",
      "You use database queries inside loops. Your server is crying.",
      "Your code is copy-pasted and you are hoping nobody checks it.",
      "You spent two weeks on a dark mode toggle instead of fixing the login button.",
      "You close error messages without reading them. Ignorance is not bliss.",
      "You spend more time on Twitter talking about code than coding."
    ],
    "nuclear": [
      "YOUR CODE EDITOR IS A TRASH BIN OF EXPIRED LIBRARIES. COPIED SCRIPT CODES HELD TOGETHER BY HOPES. IT IS A SECURITY DISASTER.",
      "COMPILING YOUR WORK SHOWS MORE WARNINGS THAN A TWITTER RATIO. DEINSTALL YOUR EDITOR NOW.",
      "YOUR CODE IS AN ENEMY OF THE COMPUTER. NESTED LOOPS SO DEEP THEY BREACH THE EARTH'S CORE.",
      "YOUR DATABASE LACKS ANY INDEXES. SELECT QUERIES TAKE FOREVER, JUST LIKE YOUR DMs.",
      "YOUR CODE IS A CRIME AGAINST CLEAN PROGRAMMING. RECURSIONS SO DEEP THEY CRASH THE MEMORY. RE-INSTALL SYSTEM.",
      "YOUR WEB SERVER CRASHES IF TWO USERS CLICK A BUTTON AT THE SAME TIME. NO BACKUPS, JUST FAITH AND VIBES.",
      "YOUR SCRIPTS ARE LITERALLY SCREAMING IN PAIN. CHANGE YOUR CAREER IMMEDIATELY.",
      "THE ONLY RECURSIVE THING IS YOUR TECHNICAL ERRORS. YOU REPEAT THE SAME MISTAKES EVERY DAY.",
      "YOUR DOCKER IMAGE IS 8 GIGABYTES RUNNING A SIMPLE TEXT PAGE. MASSIVE CRIME IN PROGRESS.",
      "YOUR COMPILER WARNINGS COUNT IS IN THE SIX FIGURES. RUNNING CODE ON GLUE AND VIBES.",
      "YOUR CODE IS AN EXTINCTION EVENT FOR THE SERVER. NOT A SINGLE FUNCTION WORKS WITHOUT GOOGLE TABS OPEN.",
      "BRO PUSHES CODE THAT DESTROYS THE SYSTEM. RUNNING ON GLUE AND BAD PASSWORDS.",
      "THE ARCHITECTURE LOOKS LIKE A CYBER WAR CRIME. YOUR CODE DEPTH CAUSES LOCAL ALERTS. APOLOGIZE FR.",
      "YOUR PRODUCTION SCRIPTS IMPLODE WHEN A SINGLE USER LOGS IN. RETIRE FROM COMPUTER WORK.",
      "YOUR APPLICATION TAKES 10 GIGABYTES OF MEMORY TO RENDER A BLANK PAGE. DEINSTALL EVERYTHING.",
      "YOUR CODE IS SO BAD THAT THE COMPUTER WOULD RATHER TURN OFF THAN RUN IT. TOTAL DISASTER.",
      "YOU WROTE AN ENTIRE SAAS WITH ZERO DATABASE INDEXES. ONE SEARCH QUERY WILL BURN DOWN THE CLOUD SERVER.",
      "YOUR CODE IS HELD TOGETHER BY FAITH AND COFFEE. A SINGLE CLICK WILL DELETE YOUR WHOLE CUSTOMER LIST.",
      "THE THREADS ARE LITERALLY FIGHTING EACH OTHER TO CRASH FIRST. RE-INSTALL LIFE CHOICES.",
      "YOUR REPOSITORY IS SO CONFUSING THAT GITHUB SENT YOU A WARNING TO CLEAN IT UP. MID DEV FR."
    ]
  },
  "dating": {
    "mild": [
      "Your dating bio is probably just 'I love coffee, travel, and dogs' like everyone else.",
      "You consider a date to be watching TV in silence while looking at your phone. Zero effort.",
      "The bar for you is so low it is practically under the floor.",
      "Your love life is in a recession. Time to buy more coping coins.",
      "Bro sends 'good morning' texts to people who have ignored him for 3 months. Desperate.",
      "Your type is 'people who do not like me' because you love setting yourself up for failure.",
      "Your dating bio says 'good vibes only' but your presence in a chat is a mood killer.",
      "Still swiping on profiles that were active two years ago. Coping hard.",
      "Your idea of a second date is sending random short videos at 2 AM with no context.",
      "Bro uses bad pickup lines translated from online pages. It is not working.",
      "You match with someone and immediately search their entire social media history.",
      "Your love language is double-texting and getting left on read. Classic.",
      "Your dating pictures are all group photos where you are the least attractive one, no cap.",
      "You spend 2 hours matching your socks for a date only to get ghosted before you leave the house.",
      "Your dating pictures are all group shots where your friends do all the heavy lifting.",
      "You reply to messages so fast it shows you have zero plans for the next three years.",
      "Your type is 'someone who ignores me' because you love the thrill of an empty inbox.",
      "Your bio says you are 'spontaneous' but you get nervous ordering pizza on the phone.",
      "You practice conversations in the mirror and still stutter when they say hello.",
      "You check your dating apps every 5 minutes hoping for a match that is not a bot.",
      "Your standards are sky high but you wear gym shorts on a first date.",
      "You screenshot messages to ask 5 friends how to reply to 'ok'.",
      "Your match asks for your hobby and you panic because you only watch memes.",
      "You swipe right on everyone because your ego cannot handle another empty day."
    ],
    "spicy": [
      "You get ghosted so often that your message history looks like a list of silent chats. Rent free.",
      "You send 'hey' and wonder why they don't want to marry you. Boring talker.",
      "Left on delivered so long that your messages are practically history lessons.",
      "You rewrite your dating bio every week like a business project but your match count is still zero.",
      "Your standard is just 'breathing' and yet you still find yourself matching with disappointment.",
      "You spend 3 hours drafting a message to get 'cool' back. Rizz failure.",
      "Bro is in a relationship with the 'typing...' bubble. The message is never coming, fr.",
      "Your dating standards are higher than your credit score, which explains why you are single.",
      "You tell everyone you are 'focusing on yourself' but you still check their profile daily.",
      "Bro gets friendzoned by automated chatbots. Tragic.",
      "You match on Tinder just to argue about zodiac signs. Delulu activity.",
      "You send paragraph essays to people who reply with one emoji. The energy is not mathing.",
      "You write paragraph essays to someone who replies with 'haha true'. Big rizz failure.",
      "You schedule dates around TV show releases because you are scared of real talk.",
      "Your standards are sky-high for someone whose entire personality is drinking coffee and complaining.",
      "Bro gets nervous talking to the delivery driver, no wonder your chat list is empty since 2023.",
      "You fall in love with someone because they looked at you for two seconds on the train.",
      "You spend three days planning a date only to get the 'I'm suddenly busy' text. Sad.",
      "Your dating profile has been reviewed by 10 people and they all told you to start over.",
      "You buy new clothes for a date and they cancel 15 minutes before. Classic L.",
      "You get matching zodiac tattoos for someone who doesn't even remember your birthday.",
      "Your dating bio says you are 'not like other people', but you look exactly like a default character.",
      "You ask them what their favorite music is and then pretend to like a band you never heard of."
    ],
    "nuclear": [
      "YOU ARE HARDSTUCK SINGLE. YOUR BEST RELATIONSHIP ACCOMPLISHMENT IS AN AUTOMATED BIRTHDAY TEXT. SWIPING HAS GIVEN YOU ZERO MATCHES.",
      "YOUR TALKING SKILLS ARE LOWER THAN A STONE. ANALYZING SIMPLE TEXTS LIKE CODES, ONLY TO SEND A DOUBLE-TEXT THAT ENDS THE CHAT.",
      "IF REJECTION HAD A FACE, IT WOULD MATCH YOUR FRONT CAMERA ANGLE. YOU ARE IN A RELATIONSHIP WITH THE CEILING FAN. GO TOUCH GRASS.",
      "YOU ARE AN EXPERT IN GETTING GHOSTED. BLOCKED EVERYWHERE, SO YOU SENT AN EMAIL. DESPERATION INCARNATE.",
      "YOUR RIZZ IS LOWER THAN THE TEMPERATURE OF DEEP SPACE. COMPLIMENTING THEIR LEFT EYEBROW? GO HIBERNATE AND DELETE APPS.",
      "YOUR DMs ARE A GHOST TOWN CAPTIONED BY BLOCKED CONTACTS. CARPAL TUNNEL AND ZERO MATCH STATISTICS.",
      "YOU ANALYZE TEXT MESSAGES LIKE DANGEROUS CODES ONLY TO SEND AN EMOJI THAT ENDS THE CHAT PERMANENTLY.",
      "IF REJECTION HAD A FACE, IT WOULD BE YOUR PHONE SCREEN. ZERO ROMANTIC TRACTION.",
      "YOUR BIO IS A CRIME SCENE OF SELF-ABSORBED YAP. NO WONDER CONVERSATIONS DIE IN UNDER FOUR MESSAGES.",
      "CHRONICALLY SINGLE NOMAD. RETIREMENT PLAN INVOLVES BEING A CAT OWNER. SHOWER IMMEDIATELY.",
      "BRO IS FLOUNDERING IN THE SHALLOW END OF REJECTION. GO TALK TO REAL GRASS.",
      "YOUR ROMANTIC RIZZ IS LOWER THAN A FROZEN ROCK. MULTI-PLATINUM IN GETTING LEFT ON DELIVERED.",
      "YOU ARE AN EXPERT IN EXCLUSIVITY WITH UNUSED CHAT INBOXES. BLOCKED IN FIVE LANGUAGES, SO YOU SENT A HELLO ON A VENMO APP.",
      "IF REJECTION WAS AN INVESTABLE ASSET, YOU WOULD BE A BILLIONAIRE. SWIPING GIVES YOU HAND PAIN AND ZERO MATCH HISTORY.",
      "YOUR LOVE LIFE IS A GRAVEYARD OF GHOSTED CHATS AND UNANSWERED QUESTION MARKS. FRIENDZONED BY CHATBOTS.",
      "YOU HAVE BEEN ON 50 FIRST DATES AND ZERO SECOND DATES. THE COMMON FACTOR IN ALL OF THEM IS YOU.",
      "YOUR DATING PROFILE HAS MORE RED FLAGS THAN A SOVIET PARADE. EVERY MATCH LEAVES WITHIN 5 SECONDS.",
      "YOU SENT A 10-PAGE MESSAGE EXPLAINING YOUR FEELINGS AND GOT A THUMBS UP REACTION. ABSOLUTE EGO WRECK.",
      "SWIPING RIGHT ON 10,000 PEOPLE AND GETTING 0 MATCHES IS A STATISTICAL DISASTER. YOUR VIBE IS AN EMERGENCY.",
      "YOUR ONLY LONG-TERM RELATIONSHIP IS WITH YOUR INTERNET ROUTER. EVEN THAT DISCONNECTS WHEN YOU ARE NEAR.",
      "BRO IS SO SINGLE THAT HE SENDS FLIRTING TEXTS TO TELEMARKETERS. GO TOUCH GRASS IMMEDIATELY."
    ]
  },
  "resume": {
    "mild": [
      "Putting 'Proficient in Word' on your resume is just code for 'I know how to turn on a computer'. Mid.",
      "Your resume font is Comic Sans, isn't it? Tell the truth, fr.",
      "You list 'Fast Learner' to cover up the fact that you have zero actual skills right now.",
      "Listing 'team player' because you have absolutely no achievements to show off.",
      "Your resume is mostly links to half-finished tutorials you copied online. Mid.",
      "Your job search is a marathon, mostly because you keep running in the wrong direction.",
      "Listing 'strong communicator' on a resume when you get social anxiety from ordering food, fr.",
      "Your resume is in PDF format but looks basic and boring. Design L.",
      "Listing 'problem solver' when your first instinct on a problem is to restart the computer.",
      "Your LinkedIn work history looks like a list of clubs you got kicked out of in college.",
      "You list 'fluent in spanish' because you took 3 classes online. Delulu fr.",
      "Putting 'flexible' because you don't have a schedule or a job right now.",
      "Listing skills you haven't touched since a 15-minute tutorial in 2021. Padded hard.",
      "Putting 'Proficient in multitasking' because you can watch TV while eating cereal. Very impressive.",
      "You write your resume in 3 different fonts because you think it makes your lack of jobs look creative.",
      "Your resume gaps are so big they look like a calendar from a deserted island.",
      "Bro puts 'Self-motivated' but needs 4 alarms and a cup of coffee just to sit upright.",
      "You listed 'Microsoft Office' as a skill in 2026. What next? Listing 'Google Search'?",
      "Your resume is so empty that the whitespace is doing all the work.",
      "Listing 'hobbies: reading' because you read the back of the cereal box this morning.",
      "You put 'detail-oriented' but spelled your own name wrong on the application.",
      "Listing 'works well under pressure' when you cry when the printer runs out of paper.",
      "Your resume looks like it was written in 1995. Even the retro fans think it is outdated.",
      "You list 'high energy' but your average screen time is 14 hours of lying in bed."
    ],
    "spicy": [
      "You have had more jobs in the last two years than projects you completed. Recruiters see red flags, bruh.",
      "Your resume is padded harder than a puffer jacket. 'Synergy Specialist'? You worked at a cash register, Gary.",
      "Your LinkedIn headline is longer than your actual career achievements. Network in a soup line, fr.",
      "Putting 'Experienced Leader' because you were the captain of a game server. Peak padder.",
      "Your work experience gap is wider than the Grand Canyon. What were you doing, finding yourself? Still lost, fr.",
      "Bro lists 'Agile Methodologies' but can't organize a simple calendar invite. Clowning.",
      "Your resume gaps are so large they have their own timezone changes.",
      "Your LinkedIn network is just recruitment bots trying to sell you premium upgrades. Synergy failure.",
      "Bro got laid off from an unpaid internship. That takes actual talent, no cap.",
      "You list 'Fast Learner' to cover up the fact that you have zero experience in the actual industry.",
      "You spend more time polishing the borders of your resume than writing actual achievements.",
      "Your cover letter reads like it was translated through 4 layers of bad prompting. Mid fr.",
      "You list 'Group Project Leader' on your resume, but we all know you just bought the snacks and stayed quiet.",
      "Your LinkedIn work history looks like a collection of clubs you got kicked out of for bad vibes.",
      "You spend 4 hours designing a header logo for your resume to hide the fact that there are only two lines of work history.",
      "Listing 'fluent in three languages' when you only know how to order food and say hello. Delulu fr.",
      "You sent 200 applications and only got replies from automated rejection bots. Ratios are bad.",
      "Your LinkedIn photo looks like a mugshot from a very boring crime. Professional L.",
      "You put 'expert level' on skills you only used for one homework assignment in high school.",
      "You claim to be a 'strategic thinker' but you spent your last $5 on a mystery box online.",
      "Your resume bullet points are just rewritten versions of the job description. We can see it.",
      "You applied for a senior role with 6 months of internship experience. The confidence is delulu.",
      "You list 'references available upon request' because you have nobody who will say nice things about you."
    ],
    "nuclear": [
      "YOUR RESUME IS AN UNSUBSTANTIATED COMEDY SCRIPT. HR MANAGERS RECYCLE IT BEFORE THE FIRST PAGE FINISHES. 'MOTIVATED SELF-STARTER' IS A EUPHEMISM FOR UNEMPLOYED.",
      "YOUR WORK HISTORY IS SO FRAGMENTED IT LOOKS LIKE A SHATTERED GLASS. TUTORIALS LISTED AS PROFESSIONAL CONTRACTS. DISASTER.",
      "YOU SPEND 5 HOURS REFORMATTING YOUR RESUME TO FIT A PAGE WHEN YOUR ACTUAL ACHIEVEMENTS COULD FIT ON A STICKY NOTE. GO FIND A STABLE JOB.",
      "YOUR SKILLS SECTION IS AN ENCYCLOPEDIA OF LIES. RATING YOURSELF 5 STARS IN HARD WORK WHEN YOU STILL SEARCH HOW TO WRITE A BASIC EMAIL. THE RECRUITERS LAUGH IN THE GC.",
      "BRO LISTS 'SELF-MOTIVATED' BUT CAN'T STAND UP TO GET A GLASS OF WATER. CAREER PROSPECTS FLATTER THAN CARDBOARD.",
      "YOUR WORK DETAILS ARE A COMEDY SCRIPT. HR DEPARTMENTS RECYCLE IT TO CLEAR CACHE RECORDS. CAREER OUTLOOK: ABSOLUTELY EMPTY.",
      "BRO LISTS COPIED PROJECTS AS CONTRACTS. RECRUITERS ARE RATIOING YOUR PROFILE IN THEIR PRIVATE GROUP CHATS. EMBARRASSING.",
      "YOUR CAREER PATH IS A SPEEDRUN OF DEPRECIATING ASSETS. APOLOGIZE TO LINKEDIN FOR SYSTEM WASTAGE.",
      "YOU SPEND 5 HOURS REFORMATTING YOUR RESUME TO FIT A PAGE WHEN AN INDEX CARD COULD HOLD YOUR ACTUAL VALUE.",
      "MOTIVATED SELF-STARTER IS CODE FOR COGNITIVELY INERT. GO FILL AN EMPLOYMENT SLIP AT A FAST FOOD CHAIN.",
      "YOUR WORK HISTORY IS AN ENCYCLOPEDIA OF LIES. HR MANAGERS USE YOUR RESUME AS A RECYCLING STACK BEFORE THE FIRST SENTENCE FINISHES. 'CEO OF VIBES' IS CODE FOR LIVING IN YOUR PARENTS' BASEMENT CORNER.",
      "BRO HAS LESS PROFESSIONAL TRACTION THAN A NEWBORN KITTEN. THE RECRUITER IS LITERALLY SHARING YOUR SKILLS RATIO IN THEIR GC.",
      "YOUR ENTIRE RESUME IS A DRAFT OF FICTION. CAREER PROSPECTS FLATTER THAN A PIECE OF CARDBOARD. LINKEDIN PROFILE LOOKS LIKE A SPAM BOT IN THE LATE 2000s. SHUT IT DOWN IMMEDIATELY.",
      "UNEMPLOYED RESUME EXTRAORDINAIRE! SKILLS INVOLVE COMPLAINING AND RETWEETING MOTIVATIONAL CAREER QUOTES. YOUR APPLICATION GAP HAS ITS OWN POSTAL CODE. RE-INSTALL INDEED NOW.",
      "YOU LIED ABOUT YOUR DEGREE, YOUR EXPERIENCE, AND YOUR SKILLS. THE SYSTEM CAUGHT YOU IN 2 SECONDS. HR BLACKLIST SPEEDRUN.",
      "YOUR LINKEDIN PROFILE IS SO BORING THAT EVEN BOTS REFUSE TO VISIT. YOUR PORTFOLIO IS LITERALLY AN INDEX FILE OF EMPTY PAGES.",
      "YOUR CAREER PROSPECTS ARE FLATTER THAN CARDBOARD. YOU ARE APPLYING TO JOBS THAT DO NOT EXIST WITH EXPERIENCE YOU DO NOT HAVE. SHUT IT DOWN.",
      "BRO SAYS HE IS AN 'EXECUTIVE LEADER' BUT GOT FIRED FROM A VOLUNTEER POSITION FOR DOING NOTHING. PATHETIC.",
      "THE GAP IN YOUR RESUME IS SO HUGE THAT IT HAS AN ACCUMULATED DEBT IN SAVINGS. CAREER PROSPECTS: ZERO.",
      "YOUR PORTFOLIO HAS ONE PROJECT AND IT IS A COPIED CALENDAR. YOU ARE RUNNING AN UNEMPLOYMENT SPEEDRUN, NO CAP."
    ]
  },
  "life": {
    "mild": [
      "You spend money on game microtransactions and wonder why you're eating instant ramen. Financial skills are mid.",
      "Your main life strategy is 'we'll cross that bridge when we burn it'. Unhinged.",
      "You stay up until 3 AM looking at TikTok memes and wake up wishing you were a plant. Delulu.",
      "Bro orders food delivery from a restaurant across the street because walking 100 meters is 'too draining'.",
      "Your main hobby is scrolling short videos until your brain turns to digital mush.",
      "You buy a planner every January and write in it exactly once before losing it under your bed.",
      "You buy gym memberships in January and your only exercise is walking to the counter to cancel it.",
      "Bro spent his entire paycheck on a concert ticket for an artist he only knows from short videos.",
      "Your main coping mechanism is buying stuff you don't need with money you don't have.",
      "You stay up until 4 AM watching speedruns of games you will never play. Sleep schedule is mid.",
      "Bro gets motivated to change his life at 11 PM and wakes up at 11 AM completely inert.",
      "You buy organic vegetables just to watch them rot in your fridge for two weeks. Money waste.",
      "Your desk has more empty soda cans than sheets of paper. It's giving goblin den.",
      "You buy a salad spinner and use it to store empty plastic bags. Peak life management.",
      "You start a diary and only write about how tired you are. Absolute diary peak.",
      "Buying books you'll never open just to make your room look like you read. Aesthetic delulu.",
      "Your morning routine is just checking your phone for 40 minutes while staring at the wall.",
      "You have 5 subscription plans and you have not used any of them in six months.",
      "Your plants are dry and brown. Even plastic plants would die in your room.",
      "You spend $10 on a coffee because the cup looks pretty on social media. Financial genius.",
      "Your laundry pile is so high it is starting to look like a roommate.",
      "You clean your room only when you lose your phone and need to find it.",
      "You drink 4 energy drinks a day and wonder why your heart is racing and you can't sleep.",
      "Your favorite hobby is lying in bed and complaining that you have no time."
    ],
    "spicy": [
      "Your lifestyle choices are sponsored by poor financial planning and emotional coping mechanisms.",
      "You make decisions based on what makes you look coolest to people you don't even like. Absolute clown behavior, fr.",
      "If procrastinating was an Olympic sport, you'd qualify but skip the finals because you 'weren't in the vibe'.",
      "Bro is 25 and still relies on his parents to schedule his doctor appointments. Peak adulting failure.",
      "You make a 5-year plan but get distracted by a discount code for sneakers you can't afford. Financial disaster.",
      "Bro spends 90% of his day complaining about his life and 10% actually changing it. Absolute yap champion.",
      "You make decisions based on what looks best for your social media story. Peak performative life.",
      "Bro is 25 and his primary retirement strategy is hoping inflation drops back to 2012 levels. Delulu.",
      "You spend $15 on delivery fees for a $10 meal because you're too lazy to walk 2 blocks. Financial L.",
      "Your sleep schedule is currently running in Australian time while you live in Chicago.",
      "Bro spends 8 hours a day arguing on forums about topics he researched 10 minutes ago. Yap master.",
      "You buy self-help books to look smart on your shelf but haven't opened a page. Coping mechanism.",
      "Your life plan is currently held together by caffeine, wishful thinking, and expired coupons.",
      "You complain about being broke but ordered delivery twice today because walking outside is 'too much work'.",
      "You set a goal to change your life at 12 AM and wake up at 12 PM with the exact same lazy habits.",
      "Your life decisions are sponsored by short attention spans and emotional buying sprees. Financial crisis in progress.",
      "Bro spends 6 hours arguing with random strangers online about things he researched 2 minutes ago on a meme page.",
      "You spent your savings on a mystery box online hoping to get a console. You got a sticker.",
      "You skip hangouts with real friends to play games with people who mute you. Great social life.",
      "You tell everyone you are 'busy' but your screen time report says 12 hours of social media.",
      "You bought a gym pass to take photos in the mirror. You left after 5 minutes.",
      "You spent your grocery budget on delivery and now you are eating dry toast for a week.",
      "Your retirement plan is literally just hoping the lottery card works out. Delulu behavior.",
      "You complain that nobody texts you, but you take three days to reply to 'hello'."
    ],
    "nuclear": [
      "YOUR LIFE IS A DISASTER OF LOGISTICAL AND MORAL INCOMPETENCE. BUYING SUBSCRIPTIONS YOU DON'T USE AND CANCELING SAVINGS PLANS. RETIREMENT PLAN IS WINNING A SCRATCH-OFF.",
      "FLOUNDERING IN A SHALLOW PUDDLE OF YOUR OWN SHAME. INDECISIVE, UNMOTIVATED, AND SENSITIVE TO MILD CRITICISM. YOUR PILLOW HAS MORE AMBITION.",
      "BRO IS RUNNING A SPEEDRUN OF EXISTENTIAL RUIN. YOU MAKE POOR CHOICES AND BLAME THE ALIGNMENT OF THE PLANETS. IT'S GIVING ZERO RESPONSIBILITY.",
      "YOUR FINANCIAL DECISIONS ARE A PERPETUAL EMERGENCY. ORDERING DELIVERIES WITH $4 IN YOUR ACCOUNT. DEBT COLLECTORS HAVE YOU ON SPEED DIAL.",
      "PROCRASTINATING UNTIL THE LAST SECOND AND BLAMING 'BURNOUT' FOR YOUR TOTAL INACTION. YOU ARE THE MAIN ARCHITECT OF YOUR OWN WRECKAGE.",
      "YOUR ENTIRE FINANCES ARE AN EMERGENCY BROADCAST. CARD DECLINED AT A LOCAL DOLLAR GENERAL. RETIREMENT PLAN: NONE.",
      "BRO MAKES DISASTROUS DECISIONS AND BLAMES THE SHIFTING SIGNS OF THE MOON. THE APEX OF LOGISTICAL FAILURE.",
      "YOU PROCRASTINATE SO HARD THAT YOUR PROBLEMS HAVE ACQUIRED ACCUMULATED INTEREST. SPEEDRUNNING DEBT CONVERSION.",
      "YOUR MENTAL CAPACITY IS SPONSORED BY 15-SECOND SHORT MEMES. TOTAL COGNITIVE BANKRUPTCY, FR.",
      "YOU PROMISE TO CHANGE BUT YOUR DAILY ROUTINE IS DEGENERATIVE INERTIA. WAKE UP BRUH, YOUR VIBE IS AN L.",
      "THE ONLY THING HOLDING YOUR LIFE TOGETHER IS ACCUMULATED GRAVITY AND EXPIRED NOODLES. TRAGIC OUTLOOK.",
      "YOUR LIFE IS A DISASTER OF LOGISTICAL AND MORAL INCOMPETENCE. YOU PROCRASTINATE SO HARD YOUR PROBLEMS HAVE ACCUMULATED HIGH COMPOUND INTEREST. DEBT COLLECTORS CALL YOU JUST TO HEAR A VOICE.",
      "WAKING UP AT NOON AND COMPLAINING ABOUT BURNOUT FROM DOING NOTHING. RETIREMENT PLAN IS THE INHERITANCE FROM A RELATIVE WHO DOESN'T EVEN LIKE YOU. GO TOUCH GRASS IMMEDIATELY.",
      "BRO'S DAILY ROUTINE IS RUNNING A SPEEDRUN OF EXISTENTIAL RUIN. YOU MAKE AWFUL CHOICES AND BLAME THE SHIFTING STARS. PILLOW HAS MORE DRIVE AND DIRECTION.",
      "THE CONVERSATIONAL GAP BETWEEN YOUR GOALS AND YOUR ACTIONS IS THE SIZE OF THE OCEAN. YOU SPEND EARNINGS YOU DON'T HAVE ON ITEMS YOU DON'T NEED. ABSOLUTE SYSTEM COLLAPSE.",
      "YOUR SAVINGS ACCOUNT HAS ZERO DOLLARS AND YOU JUST BOUGHT AN EXPENSIVE STATUE. YOU ARE A FINANCIAL DISASTER IN MOTION.",
      "YOU BLAME THE SYSTEM FOR YOUR PROBLEMS BUT YOU SPEND 16 HOURS A DAY LYING DOWN DOING ABSOLUTELY NOTHING.",
      "BRO'S EXISTENCE IS HELD TOGETHER BY EXPIRED RAMEN AND BAD DECISIONS. YOUR FAMILY USES YOU AS A EXAMPLE OF WHAT NOT TO BE.",
      "DEBT IS YOUR ONLY CONSTANT COMPANION. YOUR CARD GETS DECLINED WHEN BUYING WATER. GO GET AN ACTUAL EDUCATION ON LIFE.",
      "YOUR ATTENTION SPAN IS GONE. YOU CANNOT WATCH A 2-MINUTE VIDEO WITHOUT SLIDING BACK TO SHORT PICTURES. MENTAL DISASTER FR.",
      "BRO COMPLAINS ABOUT LACK OF OPPORTUNITY BUT DELETED THE ONLY JOB OFFER HE GOT BECAUSE IT WAS TOO EARLY IN THE MORNING."
    ]
  },
  "appearance": {
    "mild": [
      "Your fashion sense is 'whatever was on top of the laundry basket'. No drip.",
      "You look like a default character model that hasn't finished loading yet, fr.",
      "That haircut is certainly... a bold choice. Very brave of you.",
      "Your outfit is giving 'default video game character starting armor'.",
      "Bro wears sunglasses inside to hide the absolute lack of eye contact skills.",
      "That posture is giving 'overcooked macaroni'. Stand up straight, fr.",
      "Your drip is giving 'unlocked starter skins' in a free-to-play game.",
      "Bro wears beanies in the summer because he thinks it makes him look like an artist. Mid.",
      "You slouch so hard your neck looks like a question mark. Stand straight, fr.",
      "Your posture looks like a shrimp playing mobile games. Sitting like a hook, no cap.",
      "Bro wears giant sneakers to distract from the complete lack of conversational skills.",
      "Your outfit is giving 'first option on the thrift store rack'. Design crisis.",
      "You wear glasses with no prescription because you want to seem deep. The view is empty.",
      "Your drip is giving 'unlocked starter skins' in a free game. Extremely basic.",
      "That outfit looks like you rolled around in a pile of clothes and walked out the door.",
      "Posture so bad you look like a shrimp playing mobile games on a low stool.",
      "You wear oversized beanies in 90-degree weather because you think it gives you a personality.",
      "Your shoes look like they survived a dog attack and a volcano explosion.",
      "That shirt color is so bright it is hurting the neighbors.",
      "You stand like you are trying to hide from your own shadow. Walk tall.",
      "Your jacket is three sizes too big. You look like a walking coat hanger.",
      "You wore green pants with a purple shirt. Are you trying to look like a grape?",
      "Your haircut looks like your friend did it with their eyes closed.",
      "You wear hoodies in a heatwave and complain that the weather is too hot."
    ],
    "spicy": [
      "You look like you're trying to pull off a vintage retro vibe, but you just end up looking like you raided a dumpster. It's giving trash energy.",
      "You walk into a room and the room's energy levels drop by 45%. You're like a walking black hole of rizz.",
      "You dress like you're about to go hiking, go to a club, and sleep on a park bench all at the same time. Zero coordination.",
      "That haircut makes you look like a character selection preview that got cancelled halfway through. L cut.",
      "Bro wears oversized hoodies to hide the fact that his personality is also completely hollow.",
      "Your fashion sense is a random generator of trends that died three months ago on short video apps.",
      "Bro walks into a room and the room's overall energy levels decline by 40%. Charisma void.",
      "You wear high-end brands but your shoes look like they survived a volcanic explosion.",
      "Your posture is so bad that your spine is practically a spiral staircase. Sit up, bruh.",
      "That haircut makes you look like a lawnmower accident that someone tried to fix with glue. L cut.",
      "You dress like you're about to go hiking, go to a wedding, and take a nap all in the same outfit.",
      "You wear glasses with no prescription because you think it makes your empty stare look deep. Delulu.",
      "Bro spends $200 on shoes but still slouches like a wet noodle. Walk tall next time, fr.",
      "You bought designer clothes but you still look like a default character from a boring game.",
      "Your posture is so bent that the chiropractor asked you to leave. Stand straight, bruh.",
      "You wear cargo pants with 10 pockets and they are all empty except for one mint candy.",
      "That haircut makes your head look like a round egg. The barber did you dirty, fr.",
      "You wear oversized shirts and look like a child trying on their parent's clothes.",
      "Your fashion choice is 'anything that does not match'. Total visual crisis, fr.",
      "You spent a week choosing a outfit for a photo and still got zero likes. Tragic drip."
    ],
    "nuclear": [
      "YOUR STYLE VIBE IS 'ACCIDENT SURVIVOR AT A THRIFT STORE DUMPSTER'. COMPLIMENTED BY A DISMAL SLOUCH AND AN EMANATING AURA OF DESPAIR.",
      "YOU LOOK LIKE YOU DEPRECIATED A DECADE AGO. MIRRORS LOOK AWAY TO AVOID RENDERING EXCEPTION ALERTS. THE ONLY GLOW UP YOU ARE GETTING IS FROM YOUR PHONE SCREEN.",
      "IF DISAPPOINTMENT HAD A PHYSICAL FORM, IT WOULD DRESS PRECISELY LIKE YOU. EXPENSIVE BRAND APPAREL OVER AN EXTENSIVE VOID OF CHARISMA. L VIBES.",
      "YOUR STYLE IS A CRIMINAL OFFENSE IN THREE SEPARATE JURISDICTIONS. APOLOGIZE TO EVERY MIRROR YOU WALK PAST.",
      "FASHION DISASTER INCARNATE. EXPENSIVE ACCESSORIES OVER A COMPLETE VOID OF CHARISMA. CERTIFIED MID.",
      "YOUR DRIP IS AN ABSOLUTE WAR CRIME. CLOTHES FIT LIKE RUSTED CAR PARTS AND OUTFIT COLORS ARE SCREAMING FOR AN EMERGENCY INTERVENTION. VIBE CHECK IS NEGATIVE DISASTER.",
      "BRO LOOKS LIKE A GRAPHICS CLIPPING ACCIDENT IN THE REAL WORLD. ASYMMETRICAL CONVERGENCES OF PURE STYLELESSNESS. EVERY MIRROR YOU WALK PAST REFUSES TO SHOW THE REFLECTION.",
      "STYLE SENSIBILITY DETECTED: ABSOLUTE ZERO. DRESSING LIKE AN ACCIDENT SURVIVOR AT A THRIFT STORE REJECT PILE. YOUR POSTURE HAS GIVEN YOUR SPINE A SPIRAL SHAPE. STAND UP FR.",
      "THE ONLY GLOW-UP YOU ARE GETTING IS THE GLARE FROM YOUR PHONE SCREEN. APOLOGIZE TO EVERYONE WHO HAS EYE CONTACT WITH YOUR HAIRCUT. IT'S A DESIGN EMERGENCY.",
      "YOU LOOK LIKE A CREATURE CONSTRUCTED FROM EXPIRED THRIFT ITEMS. WARDROBE IS AN ACTUAL CRIME ZONE. STAND STRAIGHT OR COLLAPSE.",
      "YOUR OUTFIT SAYS 'I GAVE UP ON LIFE IN 2018'. COLOR COMBINATION IS A VIOLENT ATTACK ON EVERYONE'S EYES. SHAME.",
      "BRO'S DRIP IS SO BAD THAT BROWSER WARNINGS FLAG YOU IN PUBLIC. YOUR POSTURE LOOKS LIKE A SHATTERED UMBRELLA. STAND UP.",
      "YOU BOUGHT A $500 COAT BUT YOU LOOK LIKE A BAG OF LAUNDRY. THE DESIGNER IS LITERALLY SUING YOU FOR DAMAGE TO THE BRAND.",
      "THE POSTURE HAS PERMANENTLY DECAYED. SPINE LOOKS LIKE A ROLLERCOASTER TRACK. DISASTER VIBES ONLY.",
      "YOUR HAIR LOOKS LIKE A BIRD NEST THAT SURVIVED A HURRICANE. APOLOGIZE TO THE BARBER AND EVERY MIRROR IN TOWN."
    ]
  },
  "general": {
    "mild": [
      "You are a background character in other people's dreams, fr.",
      "You have the presence of a blank piece of printer paper. Mid.",
      "I'd roast you, but nature already did a spectacular job.",
      "You have the carbon footprint of an industrial factory but the productivity of a sloth.",
      "Bro spends more time editing his profile pictures than reading books. Mid intellectual.",
      "Your main contribution to conversations is 'that's crazy'. Absolute NPC speech.",
      "You bring absolutely nothing to the table except a massive appetite. Complete resource user.",
      "Your presence in a Discord call makes everyone suddenly mute their microphones. Silence.",
      "You are the human equivalent of a blank sheet of printer paper. Zero flavor.",
      "Your main contribution to a group conversation is just saying 'that's crazy' and looking at your phone.",
      "I would roast you, but life has already done a pretty thorough job, no cap.",
      "Bro spends 4 hours selecting a playlist for a 10-minute task. Peak procrastination.",
      "You repeat the same three jokes every day and wonder why nobody laughs.",
      "You talk so much that even your own shadow walks away from you.",
      "You are the first person people forget to invite to hangouts. Oof.",
      "You get tired from sleeping. Your energy levels are in the negatives.",
      "You ask questions and then check your phone while people answer. Bad conversationalist.",
      "You have zero hobbies and spend your weekend staring at a blank screen.",
      "You tell stories that have no ending and no point. Absolute yap master."
    ],
    "spicy": [
      "You are the reason why instructions are printed on shampoo bottles. Absolute clown.",
      "If you were any more boring, you'd be classified as a sleep aid by the doctor, no cap.",
      "You are the physical embodiment of a 'Skip Ad' button. Everyone wishes they could fast forward past your yapping.",
      "Bro gets offended by terms like 'touch grass' because it hits way too close to home.",
      "Your presence in a room makes everyone suddenly remember they have somewhere else to be. Charisma check failed.",
      "You are the human equivalent of a 'Skip Ad' button. Everyone wishes they could fast forward past your yapping.",
      "Bro gets offended by phrases like 'touch grass' because it hits way too close to home.",
      "Your presence in a room makes everyone suddenly remember they have somewhere else to be. Charisma 0.",
      "You spend 6 hours on social media every day and wonder why you have no hobbies. Mathematical L.",
      "Bro's attention span is shorter than a goldfish's memory. Go do some reading, fr.",
      "You ask for feedback on your plans but ignore every single piece of advice. True delulu.",
      "Your opinion on politics is just a summary of the first two comments on a short video.",
      "You ask for feedback on your plans but ignore every single piece of advice because you're in a committed relationship with being delulu.",
      "You send 5 voice notes in a row and they are all just you breathing and saying 'uhm'.",
      "You complain that the world is boring but you have not left your room in 4 days.",
      "Your social skill is so low that you get nervous when the cashier says 'have a nice day'.",
      "You buy expensive things to feel interesting but you still have nothing to talk about.",
      "Bro argues with automated email notifications. Absolute peak delulu energy.",
      "You try to act cool online but in real life you cover your face when you cough.",
      "Your personality is just a collection of opinions you copied from internet videos. Zero original thoughts."
    ],
    "nuclear": [
      "YOU ARE A COGNITIVE ANOMALY OF TRIVIAL TRIVIA AND SHATTERED POTENTIAL. AN ULTIMATE CONSUMER OF RESOURCE, CONTRIBUTING NOTHING TO THE GALAXY. VALUE = ZERO.",
      "YOU FLOP THROUGH LIFE LIKE A BEFEATHERED FISH ON A HOT PAVEMENT. SPECTACULAR MONUMENT TO MEDIOCRITY. GO APOLOGIZE TO EVERY TREE FOR WASTING OXYGEN.",
      "YOU ARE AN ABSOLUTE DISASTER. EVERY INTERACTION LEAVES PEOPLE WISHING THEY HAD A RESPAWN BUTTON. BEGONE, YAP MERCHANT.",
      "YOU ARE A STATISTICAL ANOMALY OF AVERAGE PERFORMANCE. GALAXY WASTING SOLAR CORES TO POWER YOU.",
      "BRO IS A MONUMENT OF MEDIOCRITY. LOUD, PANICKED, AND CONDEMNED. APOLOGIZE TO TREES FOR WASTING THEIR OXYGEN.",
      "EVERY INTERACTION WITH YOU LEAVES PEOPLE WISHING THEY HAD A RESPAWN BUTTON. BEGONE, CRINGE MERCHANT.",
      "YOU ARE AN ABSOLUTE DISASTER OF AN INDIVIDUAL. YOUR PRESENCE DAMPENS SOUND WAVES AND ENERGY LEVELS ENTIRELY.",
      "BRO YAP LEVEL HAS REACHED CRITICAL MASS. THE COUNCIL OF YAP HAS DECLARED YOU A NATIONAL EMERGENCY.",
      "YOU CONTRIBUTED EXACTLY ZERO ENERGY TO THE UNIVERSE. AN ABSOLUTE VOID OF AN NPC. RETIRE YOUR SYSTEM.",
      "YOU ARE A MONUMENT OF MEDIOCRITY. YAP LEVEL HAS REACHED CRITICAL MASS. EVERY INTERACTION LEAVES PEOPLE WISHING THEY HAD A RESPAWN BUTTON TO ESCAPE THE SHAME.",
      "BRO IS A WALKING CHARISMA VOID. YOU CONTRIBUTE EXACTLY ZERO VALUE TO THE CONVERSATION. GO APOLOGIZE TO TREES FOR WASTING THE OXYGEN THEY WORKED HARD FOR.",
      "YOUR PRESENCE DAMPENS THE ENERGY LEVEL OF EVERY CHAT ROOM. A STATISTICAL ANOMALY IN HAVING ABSOLUTELY ZERO ENGAGING CHARACTER TRAITS. BEGONE, CRINGE MERCHANT."
    ]
  }
};

const LOADING_PHASES = [
  "Letting the AI cook...",
  "Assembling the yapping matrix...",
  "Consulting the Council of Bullies...",
  "Analyzing your delulu choices...",
  "Charging the insult batteries, fr fr...",
  "Reading your text with intense side-eye...",
  "Formatting emotional wreckage protocols...",
  "Generating grade-A incinerations..."
];

const COPY_TOASTS = [
  "Copied! Go cry about it, fr.",
  "Copied! Go paste it in the GC and get ratioed further.",
  "Copied to clipboard. Ego damage successfully duplicated.",
  "Copied. Ready to infect another poor soul, no cap.",
  "Copied! Don't let your therapist see this."
];

const SHARE_TOASTS = [
  "Copied share format! Time to ruin the Discord chat 💀",
  "Copied! Go tweet this and get ratioed.",
  "Share text copied. Ready to show the world your shame."
];

// Emojis for float animation
const FLOATING_EMOJIS = ['🔥', '💀', '🤡', '😭', '🌶️', '☢️', '🪦', '💩', '💥', '💔', '📉', '🥀'];

// Speech Synthesis Engine (TTS)
function speakRoast(text) {
  if (isMuted) return;
  if (window.speechSynthesis) {
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    
    // Clean up text slang slightly so TTS says it clearly
    let cleanText = text.replace(/GC/g, "group chat")
                        .replace(/NPC/g, "N P C")
                        .replace(/fr/gi, "for real")
                        .replace(/DMs/g, "D Ms")
                        .replace(/RTX/g, "R T X")
                        .replace(/RGB/g, "R G B")
                        .replace(/SaaS/g, "sass")
                        .replace(/L /g, "L ")
                        .replace(/API/g, "A P I");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Load available voices
    const voices = window.speechSynthesis.getVoices();
    // Try to find a decent English voice
    let englishVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
                       voices.find(v => v.lang.startsWith('en')) || 
                       voices[0];
                       
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    // Robot-sarcasm pitch & rate parameters
    utterance.pitch = 0.90;
    utterance.rate = 1.05;
    
    window.speechSynthesis.speak(utterance);
  }
}

// 3. UI Helper functions
function createToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-skull"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  // Slide out after 3.5s
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3500);
}

// Particle Floating Emojis
function spawnParticle(x, y, forcedEmoji = null) {
  const container = document.getElementById('particle-container');
  if (!container) return;
  
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random position, rotation, and animation speed
  particle.style.left = (x !== undefined ? x : Math.random() * 100) + (x !== undefined ? 'px' : 'vw');
  particle.style.bottom = (y !== undefined ? y : '-50px');
  
  const emoji = forcedEmoji || FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)];
  particle.textContent = emoji;
  
  const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
  particle.style.fontSize = `${size}rem`;
  
  const duration = Math.random() * 5 + 4; // 4s to 9s
  particle.style.animationDuration = `${duration}s`;
  
  // Rotate speed
  particle.style.transform = `rotate(${Math.random() * 360}deg)`;
  
  container.appendChild(particle);
  
  // Clean up
  setTimeout(() => {
    particle.remove();
  }, duration * 1000);
}

// Burst of particles
function triggerParticleBurst(emoji = null, count = 20) {
  const isMobile = window.innerWidth < 600;
  const actualCount = isMobile ? Math.floor(count / 2) : count;
  
  for (let i = 0; i < actualCount; i++) {
    setTimeout(() => {
      // Spawn around the screen bottom
      spawnParticle(Math.random() * window.innerWidth, undefined, emoji);
    }, i * 50);
  }
}

// 4. Core Roasting Engine
function generateRoast(inputText, category, intensity) {
  // Normalize input
  const cleanInput = inputText.toLowerCase().trim();
  
  // 1. Keyword Check
  // Loop through keywords to see if user input contains any
  let matchedKeyword = null;
  for (const kw in KEYWORD_ROASTS) {
    // Check word boundaries roughly or direct inclusion
    if (cleanInput.includes(kw)) {
      matchedKeyword = kw;
      break;
    }
  }
  
  // If we matched a keyword, fetch that roast
  if (matchedKeyword) {
    return KEYWORD_ROASTS[matchedKeyword][intensity];
  }
  
  // 2. Category Fallback
  const choices = CATEGORY_ROASTS[category][intensity];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

// 5. DOM Event Listeners & Main flow
document.addEventListener('DOMContentLoaded', () => {
  // Element references
  const soundToggle = document.getElementById('sound-toggle');
  const roastInput = document.getElementById('roast-input');
  const charCount = document.getElementById('char-count');
  const roastCategory = document.getElementById('roast-category');
  const intensityButtons = document.querySelectorAll('.intensity-btn');
  const generateBtn = document.getElementById('generate-btn');
  const loadingBox = document.getElementById('loading-box');
  const loadingText = document.getElementById('loading-text');
  const progressFill = document.getElementById('progress-fill');
  const resultBox = document.getElementById('result-box');
  const roastOutput = document.getElementById('roast-output');
  const copyBtn = document.getElementById('copy-btn');
  const speakBtn = document.getElementById('speak-btn');
  const shareBtn = document.getElementById('share-btn');
  const resetBtn = document.getElementById('reset-btn');
  const eggBtn = document.getElementById('egg-btn');
  const eggResponse = document.getElementById('egg-response');
  const heroCta = document.getElementById('hero-cta');

  let currentIntensity = 'mild';

  // Seed some background floating emojis slowly
  setInterval(() => {
    if (document.hidden) return;
    spawnParticle();
  }, 2500);
  
  // Spawn a couple on page load
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnParticle, i * 400);
  }

  // Audio Toggle
  soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
      soundToggle.classList.add('muted');
      soundToggle.innerHTML = `<i class="fas fa-volume-mute"></i> <span>AUDIO OFF</span>`;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      soundToggle.classList.remove('muted');
      soundToggle.innerHTML = `<i class="fas fa-volume-up"></i> <span>AUDIO ON</span>`;
      playClickSound();
    }
  });

  // Character Counter
  roastInput.addEventListener('input', () => {
    const len = roastInput.value.length;
    charCount.textContent = len;
  });

  // Intensity Switcher
  intensityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      intensityButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      currentIntensity = btn.dataset.intensity;
    });
  });

  // Smooth scroll for Hero CTA
  heroCta.addEventListener('click', (e) => {
    e.preventDefault();
    playClickSound();
    const target = document.querySelector(heroCta.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });

  // GENERATE ROAST MAIN ACTION
  generateBtn.addEventListener('click', () => {
    const text = roastInput.value;
    const category = roastCategory.value;
    
    // UI Validation
    if (!text.trim()) {
      playFailSound();
      createToast("Enter some yapping first, fr!");
      roastInput.focus();
      return;
    }

    playClickSound();
    
    // Hide previous results (if any)
    resultBox.classList.add('hidden');
    
    // Show loading box
    loadingBox.classList.remove('hidden');
    loadingBox.scrollIntoView({ behavior: 'smooth' });
    
    // Sound FX trigger for generation start
    playRoastSound(currentIntensity);
    
    // If Nuclear, trigger screen shake on container
    if (currentIntensity === 'nuclear') {
      document.body.classList.add('shake-screen');
      // Trigger intensive warning particles
      triggerParticleBurst('☢️', 16);
    } else if (currentIntensity === 'spicy') {
      triggerParticleBurst('🔥', 12);
    } else {
      triggerParticleBurst('🌶️', 8);
    }

    // Animate the Loading Progress
    let progress = 0;
    progressFill.style.width = '0%';
    
    // Cycle text
    let textIndex = 0;
    loadingText.textContent = LOADING_PHASES[0];
    
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % LOADING_PHASES.length;
      loadingText.textContent = LOADING_PHASES[textIndex];
    }, 450);

    const progressInterval = setInterval(() => {
      progress += 2;
      progressFill.style.width = `${progress}%`;
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        clearInterval(textInterval);
        
        // Done loading!
        loadingBox.classList.add('hidden');
        document.body.classList.remove('shake-screen');
        
        // Generate roast text
        const roastResult = generateRoast(text, category, currentIntensity);
        roastOutput.textContent = roastResult;
        
        // Show result box
        resultBox.classList.remove('hidden');
        resultBox.scrollIntoView({ behavior: 'smooth' });
        
        // Success Sound
        playSuccessSound();
        
        // Speak Roast TTS
        speakRoast(roastResult);
        
        // Burst celebration particles
        triggerParticleBurst(null, 25);
      }
    }, 40); // 100 steps * 40ms = 4000ms (4 seconds of loading tension!)
  });

  // Result: Copy Roast to Clipboard
  copyBtn.addEventListener('click', () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const textToCopy = roastOutput.textContent;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        playSuccessSound();
        const randToast = COPY_TOASTS[Math.floor(Math.random() * COPY_TOASTS.length)];
        createToast(randToast);
      })
      .catch(() => {
        playFailSound();
        createToast("Clipboard copying failed. How pathetic.");
      });
  });

  // Result: Speak Roast manually
  speakBtn.addEventListener('click', () => {
    playClickSound();
    speakRoast(roastOutput.textContent);
  });

  // Result: Share formatted text
  shareBtn.addEventListener('click', () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const textToCopy = roastOutput.textContent;
    const shareText = `🤖 ROAST ME AI [Intensity: ${currentIntensity.toUpperCase()}]\n\n"${textToCopy}"\n\nGet roasted at: RoastMeAI.meme 💀`;
    
    navigator.clipboard.writeText(shareText)
      .then(() => {
        playSuccessSound();
        const randToast = SHARE_TOASTS[Math.floor(Math.random() * SHARE_TOASTS.length)];
        createToast(randToast);
      })
      .catch(() => {
        playFailSound();
        createToast("Failed to copy share text.");
      });
  });

  // Result: Reset and Roast Again
  resetBtn.addEventListener('click', () => {
    playClickSound();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    // Clear & Focus
    roastInput.value = '';
    charCount.textContent = '0';
    
    // Hide results
    resultBox.classList.add('hidden');
    
    // Scroll back to roast box console
    const consoleBox = document.getElementById('roast-box');
    consoleBox.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      roastInput.focus();
    }, 600);
  });

  // Easter Egg button click
  eggBtn.addEventListener('click', () => {
    playEggSound();
    
    // Toggle bubble
    eggResponse.classList.toggle('hidden');
    
    if (!eggResponse.classList.contains('hidden')) {
      // Trigger explosion of skulls
      triggerParticleBurst('💀', 18);
      createToast("Bro has zero reading comprehension, fr 💀");
      
      // Randomize the egg text slightly for replayability
      const eggs = [
        "You actually clicked it. Absolute NPC behavior. Delulu fr.",
        "Bro clicked it. It's giving low attention span. Go touch grass.",
        "Ego crash incoming. Why are you like this, no cap?",
        "ERROR 404: RIZZ NOT FOUND. Please restart your brain cells.",
        "Stop tapping me, you persistent little yap merchant. Go do something useful."
      ];
      eggResponse.textContent = eggs[Math.floor(Math.random() * eggs.length)];
    }
  });
});
