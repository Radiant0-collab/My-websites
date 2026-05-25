/* ==========================================================================
   ROAST ME AI - INTERACTIVE LOGIC & SYNTHESIZER
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
    "mild": "Python developer? Cool. It's giving 'I can't handle semicolons' and 'my code runs in slideshow mode'. Import some rizz next time, fr.",
    "spicy": "Oh, you write Python? You probably think you're a hacker because you know how to type `import library` to do all your actual thinking. 💀",
    "nuclear": "YOU PROGRAM IN PYTHON? BRO'S GREATEST FEAR IS INDENTATION ERRORS. YOU IMPORT PACKAGES SO HEAVY THEY BEND SPACE-TIME JUST TO AVOID C COMPILERS. YOUR SCRIPT RUNS SLOWER THAN YOUR CONVERSATION FLOW, NO CAP."
  },
  "javascript": {
    "mild": "Javascript? The only language where adding an array to a number gives you literal trash. The math is not mathing, just like your life choices.",
    "spicy": "Javascript is your main stack? You spend half your life writing `.then()` callbacks and the other half trying to figure out why `this` is referring to your keyboard. Mid.",
    "nuclear": "JAVASCRIPT DEVELOPMENT? OF COURSE! THE LANGUAGE WHERE `[] == ![]` IS ACTUAL LOGIC. YOU INSTALL 200MB OF NODE_MODULES JUST TO CENTER A SUBTITLE. YOUR CODE IS AS UNSTABLE AS YOUR DMs, FR."
  },
  "js": {
    "mild": "Javascript? The only language where adding an array to a number gives you literal trash. The math is not mathing, just like your life choices.",
    "spicy": "Javascript is your main stack? You spend half your life writing `.then()` callbacks and the other half trying to figure out why `this` is referring to your keyboard. Mid.",
    "nuclear": "JAVASCRIPT DEVELOPMENT? OF COURSE! THE LANGUAGE WHERE `[] == ![]` IS ACTUAL LOGIC. YOU INSTALL 200MB OF NODE_MODULES JUST TO CENTER A SUBTITLE. YOUR CODE IS AS UNSTABLE AS YOUR DMs, FR."
  },
  "rust": {
    "mild": "Rust? Cool. You spend 4 hours satisfying the borrow checker just to print a list of numbers.",
    "spicy": "You code in Rust? Let me guess: you haven't finished a single project in 2 years, but you've written 15 threads on why memory safety will save humanity. Delulu.",
    "nuclear": "RUST FANBOY! WE GET IT, YOU'RE MEMORY SAFE. TOO BAD YOUR ROMANTIC PROSPECTS ARE COMPLETELY SEGFAULTED. THE BORROW CHECKER IS THE ONLY THING CHECKING ON YOU ANYWAY. GO COMPILE FOR AN HOUR AND CRY."
  },
  "react": {
    "mild": "React? Sure. Why write standard clean HTML when you can wrap it in 4 layers of hooks and state variables?",
    "spicy": "Using React for everything? You've spent more time resolving dependency conflicts and folder structures than building actual products. Coping.",
    "nuclear": "REACT OVERLORD! OVER-ENGINEERING STATIC PORTFOLIOS WITH NEXT.JS TO COVER UP YOUR ABSOLUTE INABILITY TO WRITE PLAIN JS. A SIMPLE BUTTON NEEDS 4 NPM MODULES AND A FAITH HEALER TO RUN. 💀"
  },
  "c++": {
    "mild": "C++? Enjoy manual memory leaks. Make sure you don't leak your personal details like you leak heap memory.",
    "spicy": "C++ code? You feel superior to web devs while spending 3 days tracking down a single pointer that crashed your computer.",
    "nuclear": "C++ SADIST! YOU ARE VOLUNTARILY MANAGING MEMORY AND GETTING SEGMENTATION FAULTS IN 2026. THE COMPILER IS BULLYING YOU AND YOU HAVE DEVELOPED STOCKHOLM SYNDROME. YOUR CODE CRASHES HARDER THAN YOUR EGO."
  },
  "cpp": {
    "mild": "C++? Enjoy manual memory leaks. Make sure you don't leak your personal details like you leak heap memory.",
    "spicy": "C++ code? You feel superior to web devs while spending 3 days tracking down a single pointer that crashed your computer.",
    "nuclear": "C++ SADIST! YOU ARE VOLUNTARILY MANAGING MEMORY AND GETTING SEGMENTATION FAULTS IN 2026. THE COMPILER IS BULLYING YOU AND YOU HAVE DEVELOPED STOCKHOLM SYNDROME. YOUR CODE CRASHES HARDER THAN YOUR EGO."
  },
  "html": {
    "mild": "HTML/CSS? Bro centers one div and calls himself a 'Full Stack Engineer' on LinkedIn. Calm down, design school dropout.",
    "spicy": "Calling yourself a developer for styling a page? That's like claiming to be an aerospace engineer because you folded a paper airplane.",
    "nuclear": "HTML ACCENTED SCRUB! YOU THINK CSS GRID IS ADVANCED MATHEMATICS. YOU SPEND 8 HOURS ADJUSTING PADDING ONLY TO REALIZE IT BREAKS ON MOBILE. WE CAN ALL SEE YOUR ENTIRE SKILLSET IN ONE FILE. GO DOWNLOAD AN ACTUAL COMPILER, FR."
  },
  "css": {
    "mild": "HTML/CSS? Bro centers one div and calls himself a 'Full Stack Engineer' on LinkedIn. Calm down, design school dropout.",
    "spicy": "Calling yourself a developer for styling a page? That's like claiming to be an aerospace engineer because you folded a paper airplane.",
    "nuclear": "HTML ACCENTED SCRUB! YOU THINK CSS GRID IS ADVANCED MATHEMATICS. YOU SPEND 8 HOURS ADJUSTING PADDING ONLY TO REALIZE IT BREAKS ON MOBILE. WE CAN ALL SEE YOUR ENTIRE SKILLSET IN ONE FILE. GO DOWNLOAD AN ACTUAL COMPILER, FR."
  },
  // Tech buzzwords
  "ai": {
    "mild": "AI enthusiast? You just write wrappers around APIs and call it 'disrupting the industry'.",
    "spicy": "Using AI for everything? Your brain is running on a lossy compression algorithm. Even ChatGPT is tired of carrying your workload.",
    "nuclear": "AI WRAPPER DEV! YOU CANNOT WRITE A LOOP WITHOUT OPENING AN AI PROMPT. YOUR COGNITIVE VALUE IS RESTING ON A SUBSCRIPTION. IF THE API GOES DOWN, YOU WILL BECOME COGNITIVELY INERT."
  },
  "chatgpt": {
    "mild": "AI enthusiast? You just write wrappers around APIs and call it 'disrupting the industry'.",
    "spicy": "Using AI for everything? Your brain is running on a lossy compression algorithm. Even ChatGPT is tired of carrying your workload.",
    "nuclear": "AI WRAPPER DEV! YOU CANNOT WRITE A LOOP WITHOUT OPENING AN AI PROMPT. YOUR COGNITIVE VALUE IS RESTING ON A SUBSCRIPTION. IF CHATGPT GOES DOWN, YOU WILL BECOME COGNITIVELY INERT."
  },
  "gemini": {
    "mild": "AI enthusiast? You just write wrappers around APIs and call it 'disrupting the industry'.",
    "spicy": "Using AI for everything? Your brain is running on a lossy compression algorithm. Even ChatGPT/Gemini is tired of carrying your workload.",
    "nuclear": "AI WRAPPER DEV! YOU CANNOT WRITE A LOOP WITHOUT OPENING AN AI PROMPT. YOUR COGNITIVE VALUE IS RESTING ON A SUBSCRIPTION. IF GEMINI GOES DOWN, YOU WILL BECOME COGNITIVELY INERT."
  },
  // Finance/Crypto
  "crypto": {
    "mild": "Crypto? Keep holding. I'm sure that digital pixel of a golden dog will pay off your student loans eventually. Coping hard.",
    "spicy": "Crypto bro? The only thing more volatile than your coin prices is your ability to hold a conversation that isn't about decentralized ledgers. 💀",
    "nuclear": "CRYPTO SPECULATOR! BRO IS DOWN 98% ALL-TIME AND CALLS IT 'BUYING THE DIP'. YOU LOG INTO TWITTER TO GET FINANCIAL ADVICE FROM ANIME PFP INFLUENCERS. PORTFOLIO LOOKS LIKE A HEART ATTACK AND SO DOES YOUR FUTURE."
  },
  "bitcoin": {
    "mild": "Crypto? Keep holding. I'm sure that digital pixel of a golden dog will pay off your student loans eventually. Coping hard.",
    "spicy": "Crypto bro? The only thing more volatile than your coin prices is your ability to hold a conversation that isn't about decentralized ledgers. 💀",
    "nuclear": "CRYPTO SPECULATOR! BRO IS DOWN 98% ALL-TIME AND CALLS IT 'BUYING THE DIP'. YOU LOG INTO TWITTER TO GET FINANCIAL ADVICE FROM ANIME PFP INFLUENCERS. PORTFOLIO LOOKS LIKE A HEART ATTACK AND SO DOES YOUR FUTURE."
  },
  "nft": {
    "mild": "Crypto? Keep holding. I'm sure that digital pixel of a golden dog will pay off your student loans eventually. Coping hard.",
    "spicy": "Crypto bro? The only thing more volatile than your coin prices is your ability to hold a conversation that isn't about decentralized ledgers. 💀",
    "nuclear": "CRYPTO SPECULATOR! BRO IS DOWN 98% ALL-TIME AND CALLS IT 'BUYING THE DIP'. YOU LOG INTO TWITTER TO GET FINANCIAL ADVICE FROM ANIME PFP INFLUENCERS. PORTFOLIO LOOKS LIKE A HEART ATTACK AND SO DOES YOUR FUTURE."
  },
  // Games
  "valorant": {
    "mild": "Valorant player? Make sure you check your corners. And maybe check if you've showered this week. It's giving swamp smell.",
    "spicy": "Hardstuck Silver in Valorant? You spend $100 on knife skins but can't buy yourself a shred of self-respect or a functional relationship. Mid.",
    "nuclear": "VALORANT CRIPPLING ADDICT! YOU SPEND 6 HOURS A DAY ANGRILY SCREAMING AT 12-YEAR-OLDS FOR NOT SMOKING HEAVEN. YOUR AIM IS SHAKIER THAN YOUR LIFE PLANS. GO OUTSIDE, REAL LIFE DOESN'T HAVE A SURRENDER BUTTON."
  },
  "league": {
    "mild": "League of Legends? I'm sorry to hear that. Life gets better, promise. Or does it? 💀",
    "spicy": "League player? You have toxic yapping skills coded directly into your DNA. You probably ping '?' when your friends don't text back in 2 seconds.",
    "nuclear": "LEAGUE OF LEGENDS SHELL OF A HUMAN! YOU VOLUNTARILY INGEST CHEMICAL-GRADE TOXICITY DAILY. YOU'VE REPORTED MORE PEOPLE THAN THE FBI. YOUR MAIN CHAMPION IS THE ONLY THING THAT SEES ACTION IN YOUR LIFE. SHOWER FR."
  },
  "lol": {
    "mild": "League of Legends? I'm sorry to hear that. Life gets better, promise. Or does it? 💀",
    "spicy": "League player? You have toxic yapping skills coded directly into your DNA. You probably ping '?' when your friends don't text back in 2 seconds.",
    "nuclear": "LEAGUE OF LEGENDS SHELL OF A HUMAN! YOU VOLUNTARILY INGEST CHEMICAL-GRADE TOXICITY DAILY. YOU'VE REPORTED MORE PEOPLE THAN THE FBI. YOUR MAIN CHAMPION IS THE ONLY THING THAT SEES ACTION IN YOUR LIFE. SHOWER FR."
  },
  // Lifestyle
  "gym": {
    "mild": "Going to the gym? Nice. Don't forget to train your social skills too. Those look weak.",
    "spicy": "Gym bro? Lifting heavy circles to make up for the crushing weight of your empty DMs? Your protein powder has more personality than you, fr.",
    "nuclear": "GYM OBSESSIVE INSECURE CREATURE! DRINKING DRY-SCOOPED PREWORKOUT AND STARING AT THE MIRROR FOR 2 HOURS. YOU CALCULATE MACROS BUT CAN'T CALCULATE A RESTAURANT TIP. FLEXING WON'T MAKE HER COME BACK, BRUH."
  },
  "dating": {
    "mild": "Dating? I'm sure your personality shines through... eventually. Just keep swiping, delulu.",
    "spicy": "Your dating profile says you 'love hiking' because you have absolutely nothing else of value to write in 50 characters. Mid.",
    "nuclear": "DATING SWIPING GHOSTED DISASTER! YOU GO ON DATES JUST TO REALIZE THEY ARE USING YOU FOR FREE APPETIZERS. BIO IS AN EMOJI CRIME SCENE. 500 INSPIRATIONAL QUOTES SAVED BUT MULTI-PLATINUM IN BEING SINGLE."
  },
  "single": {
    "mild": "Single? That's fine, it gives you more time to focus on your zero hobbies. Rent free.",
    "spicy": "Single by choice? Yeah, the choice of every other person in a 50-mile radius.",
    "nuclear": "CHRONICALLY SINGLE NOMAD! YOU ARE SO ALONE THAT THE GOOGLE CAPTCHA ASKS YOU TO DEFINE REJECTION. PHONE NOTIFICATIONS SO EMPTY THAT THE LOW BATTERY ALERT GIVES YOU CRIPPLING EXCITMENT. RE-INSTALL TINDER OR ADOPT A CAT."
  },
  "broke": {
    "mild": "Broke? Stop buying Starbies. Just kidding, your systemic failure runs way deeper than caffeine. Mid.",
    "spicy": "Broke again? You spend money you don't have, on things you don't need, to impress people who already think you're a joke. Clowning.",
    "nuclear": "ABSOLUTELY DESTITUTE FINANCIALLY! BRO'S CARD DECLINED AT A DOLLAR TREE. NET WORTH COULD BE WIPED OUT BY A SPEEDING TICKET. GO SECURE A BAG OR SELL YOUR SOUL, NO CAP."
  }
};

const CATEGORY_ROASTS = {
  "code": {
    "mild": [
      "Your code looks like it was written by an angry toddler slamming their hands on a mechanical keyboard. It's giving no syntax.",
      "I've seen cleaner code in legacy systems from the 1970s. This is actual spaghetti, fr.",
      "Your commit messages are just 'fix', 'please work', and 'I hate my life'. Very mid developer behavior."
    ],
    "spicy": [
      "Your git history is a chronological catalog of your failures. Who merges directly to master in 2026? Clowning.",
      "You spend 8 hours automating a task that takes 2 minutes just to avoid doing actual work. Lazy or genius? Definitely lazy.",
      "The only thing worse than your variable naming convention is your architectural planning. `temp_final_v2`? Bruh."
    ],
    "nuclear": [
      "YOUR IDE IS A GRAVEYARD OF DEPRECATED PACKAGES. CODE COPIED FROM STACK OVERFLOW THAT YOU DO NOT UNDERSTAND, SECURED WITH THREADS OF FAITH. YOUR STACK IS AN ACTUAL SECURITY DISASTER.",
      "COMPILING YOUR PROJECT GENERATES MORE WARNINGS THAN A TWITTER RATIO. YOU ARE A SPAGHETTI ARCHITECT. DEINSTALL YOUR EDITOR IMMEDIATELY.",
      "YOUR CODE IS AN ENEMY OF THE CPU. THE GARBAGE COLLECTOR REFUSES TO RUN IN YOUR DIRECTORY. YOU USE NESTED LOOPS SO DEEP THEY BREACH THE EARTH'S CORE."
    ]
  },
  "dating": {
    "mild": [
      "Your dating bio is probably just 'I love coffee, travel, and dogs' like every other unoriginal clone, no cap.",
      "You consider a date to be watching Netflix in silence while looking at TikTok. It's giving zero effort.",
      "The bar for you is so low it's practically under the floorboards."
    ],
    "spicy": [
      "You get ghosted so often, your messaging history looks like a list of radio silence transcripts from deep space. Rent free.",
      "Your love life is like a CSS file: full of overrides, broken media queries, and absolute positioning that leads to disaster.",
      "You send 'hey' and wonder why they don't want to marry you. Peak conversationalist."
    ],
    "nuclear": [
      "YOU ARE HARDSTUCK SINGLE. YOUR GREATEST RELATIONSHIP ACCOMPLISHMENT IS AN AUTOMATED SNAPCHAT HAPPY BIRTHDAY. SWIPING RIGHT HAS GIVEN YOU CARPAL TUNNEL AND ZERO MATCHES.",
      "YOUR EMOTIONAL RIZZ IS ON PAR WITH A DAMP SPONGE. ANALYZING TEXT MESSAGES LIKE ENCRYPTED DATA, ONLY TO SEND A DOUBLE-TEXT THAT ENDS THE CHAT PERMANENTLY.",
      "IF REJECTION HAD A FACE, IT WOULD MATCH YOUR FRONT-FACING CAMERA ANGLE. YOU ARE IN A RELATIONSHIP WITH YOUR CEILING FAN. GO TOUCH GRASS."
    ]
  },
  "resume": {
    "mild": [
      "Putting 'Proficient in Word' on your resume is just code for 'I know how to open a computer'. Mid.",
      "Your resume font is Comic Sans, isn't it? Tell the truth, fr.",
      "You list 'Fast Learner' to cover up the fact that you have zero technical skills right now."
    ],
    "spicy": [
      "You've had more jobs in the last two years than projects you've successfully completed. Recruiters are getting red flags, bruh.",
      "Your resume is padded harder than a TikTok influencer's lips. 'Synergy Evangelist'? You worked at a register, Gary.",
      "Your LinkedIn headline is longer than your actual career achievements. Network in a soup line, fr."
    ],
    "nuclear": [
      "YOUR RESUME IS AN UNSUBSTANTIATED COMEDY SCRIPT. HR MANAGERS RECYCLE IT BEFORE THE FIRST PAGE FINISHES. 'MOTIVATED SELF-STARTER' IS A EUPHEMISM FOR UNEMPLOYED.",
      "YOUR WORK HISTORY IS SO FRAGMENTED IT LOOKS LIKE A SHATTERED GLASS. TUTORIALS ON YOUTUBE LISTED AS PROFESSIONAL CONTRACTS. DISASTER.",
      "YOU SPEND 5 HOURS REFORMATTING YOUR RESUME TO FIT A PAGE WHEN YOUR ACTUAL ACHIEVEMENTS COULD FIT ON A STICKY NOTE. GO FIND A STABLE JOB."
    ]
  },
  "life": {
    "mild": [
      "You spend money on microtransactions and wonder why you're eating instant ramen. Financial skills are mid.",
      "Your main life strategy is 'we'll cross that bridge when we burn it'. Unhinged.",
      "You stay up until 3 AM looking at TikTok memes and wake up wishing you were a plant. Delulu."
    ],
    "spicy": [
      "Your lifestyle choices are sponsored by poor financial planning and emotional coping mechanisms.",
      "You make decisions based on what makes you look coolest to people you don't even like. Absolute clown behavior, fr.",
      "If procrastinating was an Olympic sport, you'd qualify but skip the finals because you 'weren't in the vibe'."
    ],
    "nuclear": [
      "YOUR LIFE IS A DISASTER OF LOGISTICAL AND MORAL INCOMPETENCE. BUYING SUBSCRIPTIONS YOU DON'T USE AND CANCELING SAVINGS PLANS. RETIREMENT PLAN IS WINNING A SCRATCH-OFF.",
      "FLOUNDERING IN A SHALLOW PUDDLE OF YOUR OWN SHAME. INDECISIVE, UNMOTIVATED, AND SENSITIVE TO MILD CRITICISM. YOUR PILLOW HAS MORE AMBITION.",
      "BRO IS RUNNING A SPEEDRUN OF EXISTENTIAL RUIN. YOU MAKE POOR CHOICES AND BLAME THE ALIGNMENT OF JUPITER AND SATURN. IT'S GIVING ZERO RESPONSIBILITY."
    ]
  },
  "appearance": {
    "mild": [
      "Your fashion sense is 'whatever was on top of the laundry basket'. No drip.",
      "You look like a default character model that hasn't finished loading yet, fr.",
      "That haircut is certainly... a bold choice. Very brave of you."
    ],
    "spicy": [
      "You look like you're trying to pull off a vintage retro vibe, but you just end up looking like you raided a dumpster. It's giving trash energy.",
      "Your posture looks like a shrimp that spent its life studying computer science. Sit up straight, bruh.",
      "You walk into a room and the room's energy levels drop by 45%. You're like a walking black hole of rizz."
    ],
    "nuclear": [
      "YOUR STYLE VIBE IS 'ACCIDENT SURVIVOR AT A THRIFT STORE DUMPSTER'. COMPLIMENTED BY A DISMAL SLOUCH AND AN EMANATING AURA OF DESPAIR.",
      "YOU LOOK LIKE YOU DEPRECIATED A DECADE AGO. MIRRORS LOOK AWAY TO AVOID RENDERING ERRORS. THE ONLY GLOW UP YOU ARE GETTING IS FROM YOUR PHONE SCREEN.",
      "IF DISAPPOINTMENT HAD A PHYSICAL FORM, IT WOULD DRESS PRECISELY LIKE YOU. EXPENSIVE BRAND APPAREL OVER AN EXTENSIVE VOID OF CHARISMA. L VIBES."
    ]
  },
  "general": {
    "mild": [
      "You are a background NPC in other people's dreams, fr.",
      "You have the presence of a blank piece of printer paper. Mid.",
      "I'd roast you, but nature already did a spectacular job."
    ],
    "spicy": [
      "You are the reason why instructions are printed on shampoo bottles. Absolute clown.",
      "You bring absolutely nothing to the table except an appetite. A complete consumer of bandwidth.",
      "If you were any more boring, you'd be classified as a sleep aid by the FDA, no cap."
    ],
    "nuclear": [
      "YOU ARE A COGNITIVE ANOMALY OF TRIVIAL TRIVIA AND SHATTERED POTENTIAL. AN ULTIMATE USER OF BANDWIDTH, CONTRIBUTING NOTHING TO THE GALAXY. VALUE = ZERO.",
      "YOU FLOP THROUGH LIFE LIKE A BEFEATHERED FISH ON A HOT PAVEMENT. SPECTACULAR MONUMENT TO MEDIOCRITY. GO APOLOGIZE TO EVERY TREE FOR WASTING OXYGEN.",
      "YOU ARE AN ABSOLUTE DISASTER. EVERY INTERACTION LEAVES PEOPLE WISHING THEY HAD A RESPAWN BUTTON. BEGONE, YAP MERCHANT."
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
        
        // Burst celebration particles
        triggerParticleBurst(null, 25);
      }
    }, 40); // 100 steps * 40ms = 4000ms (4 seconds of loading tension!)
  });

  // Result: Copy Roast to Clipboard
  copyBtn.addEventListener('click', () => {
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

  // Result: Share formatted text
  shareBtn.addEventListener('click', () => {
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
