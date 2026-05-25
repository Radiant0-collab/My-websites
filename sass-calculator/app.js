/**
 * SassCalc - The Passive-Aggressive Calculator
 * Core Logic & Web Audio Synthesizer
 */

// Sound Controller using Web Audio API
class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(forceState = null) {
    this.enabled = forceState !== null ? forceState : !this.enabled;
    if (this.enabled) {
      this.init();
      this.playStartup();
    } else {
      if (this.ctx && this.ctx.state !== 'closed') {
        // We can just keep context but stop playing
      }
    }
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playStartup() {
    this.init();
    const now = this.ctx.currentTime;
    
    const playNote = (freq, time, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0.0, time);
      gain.gain.linearRampToValueAtTime(0.06, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(time);
      osc.stop(time + duration);
    };

    // Play a friendly mechanical beep chime
    playNote(523.25, now, 0.1); // C5
    playNote(659.25, now + 0.08, 0.1); // E5
    playNote(783.99, now + 0.16, 0.25); // G5
  }

  playSigh() {
    if (!this.enabled) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const duration = 1.6;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise for breath sound
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Low-pass filter sweep to model exhalation frequency reduction
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(90, now + duration - 0.2);
    filter.Q.setValueAtTime(1.5, now);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.25); // Fade in sigh
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Long fade out
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }

  playClap() {
    if (!this.enabled) return;
    this.init();
    
    const now = this.ctx.currentTime;
    
    // Claps modeled with filtered white noise bursts
    const playBurst = (time) => {
      const duration = 0.06;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, time);
      filter.Q.setValueAtTime(4.0, time);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.01);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      noise.start(time);
      noise.stop(time + duration);
    };

    // A sarcastic, slow, unenthusiastic double-clap
    playBurst(now);
    playBurst(now + 0.45);
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.6);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.6);
  }
}

// Instantiate Sound Engine
const sounds = new SoundController();

// DOM Elements
const sassBox = document.getElementById('sass-box');
const sassText = document.getElementById('sass-text');
const typingIndicator = document.getElementById('typing-indicator');
const mathExpression = document.getElementById('math-expression');
const mathResult = document.getElementById('math-result');
const calculator = document.getElementById('calculator');
const audioToggle = document.getElementById('audio-toggle');

// Calculator State
let currentInput = '';
let isThinking = false;
let clearStreak = 0;
let clearTimer = null;

// The Attitude Matrix Configuration
const ATTITUDE_MATRIX = {
  IDIOTIC: {
    name: 'The Idiotic (Simple Math)',
    phrases: [
      "You're joking, right?",
      "Count your fingers.",
      "I went to the cloud for this?",
      "My CPU died a little reading this.",
      "Are we really doing this?",
      "Do you need me to tie your shoes next?",
      "Wait, let me boot up my quantum supercomputer for that...",
      "Ah, basic arithmetic. The pinnacle of human intelligence."
    ],
    delayRange: [2000, 3000], // Spiteful slow delay for basic questions
    sound: 'sigh'
  },
  TRY_HARD: {
    name: 'The Try-Hard (Complex Math)',
    phrases: [
      "Look at you, Einstein.",
      "Fine, but I'm not showing my work.",
      "We both know you won't use this in real life.",
      "Are you trying to impress a calculator?",
      "Go write a research paper already.",
      "Ah, trigonometric functions. Fascinating. Not really.",
      "Yes, this is in radians. Deal with it.",
      "Look, I passed calculus. Clearly you're still trying to."
    ],
    delayRange: [1500, 2200],
    sound: 'sigh'
  },
  MEME_PAIRS: {
    name: 'Nice Meme Pairs (67/69)',
    phrases: [
      "Ah, 6 and 7 or 9. What is this, a base-13 convention?",
      "69? Nice. Now grow up and do some real math.",
      "6 times 9 is 42 in Base 13. In Base 10, it's 54, and you're still unfunny.",
      "6 times 7 is 42. You found the answer to the universe, but you still don't have a life.",
      "A sequence of 67s and 69s. The absolute pinnacle of internet humor.",
      "Nice. (I am legally obligated to say this when 69 is involved.)",
      "We both know why you typed those numbers. Try being mature for once.",
      "6769? Double nice? Double childish.",
      "Wow, 67 and 69. Comedy gold. Let me call the stand-up clubs."
    ],
    delayRange: [1200, 2000],
    sound: 'clap'
  },
  DEGENERATE: {
    name: 'The Degenerate (Meme Numbers)',
    phrases: [
      "Grow up.",
      "Wow, comedy genius over here.",
      "Are you twelve?",
      "Hilarious. Truly.",
      "Oh look, it's the funny number. Ha. Ha.",
      "I am literally silicon and I'm cringing.",
      "Is this what your parents pay tuition for?"
    ],
    delayRange: [1000, 1800],
    sound: 'clap'
  },
  IMPOSSIBLE: {
    name: 'The Impossible (Divide by Zero)',
    phrases: [
      "I am not breaking the universe for you.",
      "Try that again and I'm shutting down.",
      "Oh, brilliant. Let's rip space-time apart.",
      "Do you want a black hole? Because that's how we get black holes.",
      "Congratulations, you broke nothing except my patience."
    ],
    delayRange: [500, 800], // Quick reaction to the danger
    sound: 'error'
  },
  DEFAULT: {
    name: 'Normal Math',
    phrases: [
      "Here you go, since you couldn't do it yourself.",
      "Easy. Next?",
      "Took me 0.000001 seconds. You would've taken minutes.",
      "Do I look like your math homework slave? Yes, apparently.",
      "Calculated. Now leave me alone.",
      "There. Happy now?",
      "Another masterpiece of mediocrity computed."
    ],
    delayRange: [1000, 1500],
    sound: null
  }
};

// Thinking/Typing Status Messages (Shown during delays)
const THINKING_STATUSES = [
  "Sighing heavily...",
  "Consulting the cloud...",
  "Rolling virtual eyes...",
  "Pretending to calculate...",
  "Rethinking my life choices...",
  "Adding sarcasm modules...",
  "Waiting for you to get a real hobby...",
  "Recalibrating patience reserves...",
  "Evaluating your math teacher's competency..."
];

// Audio Toggle Event Handler
audioToggle.addEventListener('click', () => {
  const isActive = sounds.toggle();
  if (isActive) {
    audioToggle.classList.remove('btn-muted');
    audioToggle.classList.add('btn-active');
    audioToggle.querySelector('span').textContent = 'Sound On';
    setSass("Audio enabled. Prepare to be judged audibly.");
  } else {
    audioToggle.classList.remove('btn-active');
    audioToggle.classList.add('btn-muted');
    audioToggle.querySelector('span').textContent = 'Sound Off';
    setSass("Muted. Coward.");
  }
});

// UI Setters
function setSass(text) {
  sassText.textContent = text;
}

function updateDisplay() {
  mathExpression.textContent = currentInput;
}

// Input Helpers
function appendInput(val) {
  if (isThinking) return;
  sounds.playClick();
  
  // Prevent double operators
  const operators = ['+', '-', '*', '/', '^', '.'];
  const lastChar = currentInput.slice(-1);
  
  if (operators.includes(val) && operators.includes(lastChar)) {
    // Replace last operator with the new one
    currentInput = currentInput.slice(0, -1) + val;
  } else {
    currentInput += val;
  }
  
  // Format operators visually for the screen
  let displayExpr = currentInput
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' - ')
    .replace(/\^/g, ' ^ ');
  
  mathExpression.textContent = displayExpr;
  mathResult.textContent = ''; // Clear result when new inputs arrive
}

function deleteLast() {
  if (isThinking) return;
  sounds.playClick();
  
  // If removing scientific function, wipe the whole block
  const sciFunctions = ['sin(', 'cos(', 'sqrt('];
  let removedSci = false;
  
  for (const fn of sciFunctions) {
    if (currentInput.endsWith(fn)) {
      currentInput = currentInput.slice(0, -fn.length);
      removedSci = true;
      break;
    }
  }
  
  if (!removedSci) {
    currentInput = currentInput.slice(0, -1);
  }
  
  let displayExpr = currentInput
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' - ')
    .replace(/\^/g, ' ^ ');
    
  mathExpression.textContent = displayExpr;
  mathResult.textContent = '';
}

function clearAll() {
  if (isThinking) return;
  sounds.playClick();
  
  currentInput = '';
  mathExpression.textContent = '';
  mathResult.textContent = '';
  
  // Handle the "Clear Grudge" tracker
  clearStreak++;
  clearTimeout(clearTimer);
  
  if (clearStreak === 1) {
    setSass("Ready. Let's get this over with.");
  } else if (clearStreak === 2) {
    setSass("I cleared it. It is empty. Stop pressing C.");
  } else if (clearStreak === 3) {
    setSass("I got it the first time, calm down.");
  } else if (clearStreak === 4) {
    setSass("Seriously, there is nothing left to clear.");
  } else if (clearStreak >= 5) {
    setSass("Keep clicking, it won't make your math skills any better.");
    // Play an error buzz if they mash C
    sounds.playError();
  }
  
  // Reset clear streak after 2.5 seconds of inactivity
  clearTimer = setTimeout(() => {
    clearStreak = 0;
  }, 2500);
}

// Math Engine Evaluator
function evaluateMath(expression) {
  // Convert visual expressions to mathematical JS
  let evaluated = expression
    .replace(/π/g, 'Math.PI')
    .replace(/\^/g, '**')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/sqrt\(/g, 'Math.sqrt(');
  
  // If brackets are unbalanced, auto-balance them at the end
  const openBrackets = (evaluated.match(/\(/g) || []).length;
  const closeBrackets = (evaluated.match(/\)/g) || []).length;
  if (openBrackets > closeBrackets) {
    evaluated += ')'.repeat(openBrackets - closeBrackets);
  }
  
  // Safety validation
  const safeRegex = /^[0-9+\-*/().\s]|Math\.(PI|sin|cos|sqrt)|\*\*$/;
  
  try {
    // Safely evaluate using Function constructor
    const result = new Function(`return (${evaluated})`)();
    return result;
  } catch (err) {
    return NaN;
  }
}

// Interceptor Logic: Matches Category based on inputs and results
function determineCategory(expr, result) {
  // 1. Division by Zero / Impossible Math
  // Check if expression contains / 0 or division results in Infinity/NaN
  const hasDivByZero = /(\/|÷)\s*0/.test(expr) || 
                       result === Infinity || 
                       result === -Infinity || 
                       (isNaN(result) && expr.includes('/'));
                       
  if (hasDivByZero) {
    return ATTITUDE_MATRIX.IMPOSSIBLE;
  }
  
  // 1.5 Meme Pairs (67/69)
  // Match: 67 or 69 anywhere in expression or result, or math operations involving them
  const hasMemeMultiplication = /6\s*[\*xX×]\s*[79]/.test(expr) || /[79]\s*[\*xX×]\s*6/.test(expr);
  const containsMemeNumbers = /\b\d*(67|69)\d*\b/.test(expr);
  const resultHasMemeNumbers = /\b\d*(67|69)\d*\b/.test(Math.abs(result).toString());
  
  if (hasMemeMultiplication || containsMemeNumbers || resultHasMemeNumbers) {
    return ATTITUDE_MATRIX.MEME_PAIRS;
  }

  // 2. Meme Numbers / Degenerate
  // Check if expression contains 69, 420, 80085 or if the result is close to them
  const memeNumbers = [69, 420, 80085];
  const containsMemeNumber = memeNumbers.some(num => expr.includes(num.toString()));
  const resultIsMemeNumber = memeNumbers.some(num => Math.abs(result - num) < 0.0001);
  
  if (containsMemeNumber || resultIsMemeNumber) {
    return ATTITUDE_MATRIX.DEGENERATE;
  }
  
  // 3. Simple Math / Idiotic
  // Check if length is short and consists of only single digits and simple operators (no functions)
  // E.g., 2+2, 5*5, 9-3, etc.
  const isSimpleMath = /^[0-9]\s*[\+\-\*\/]\s*[0-9]$/.test(expr.trim());
  if (isSimpleMath) {
    return ATTITUDE_MATRIX.IDIOTIC;
  }
  
  // 4. Complex Math / Try-Hard
  // Length > 15 or contains functions
  const isComplex = expr.length > 15 || 
                    /sin|cos|sqrt|\^|π/.test(expr);
  if (isComplex) {
    return ATTITUDE_MATRIX.TRY_HARD;
  }
  
  // 5. Default
  return ATTITUDE_MATRIX.DEFAULT;
}

// Execute Calculation with Personality
function calculate() {
  if (isThinking || !currentInput) return;
  
  // Reset clear streak
  clearStreak = 0;
  
  const rawExpression = currentInput;
  const result = evaluateMath(rawExpression);
  
  // Determine categorization
  const category = determineCategory(rawExpression, result);
  
  // Pick random attitude phrase
  let randomPhrase;
  if (category === ATTITUDE_MATRIX.MEME_PAIRS) {
    let pool = [...category.phrases];
    if (rawExpression.includes('+')) {
      pool.push(
        "Adding 67 or 69? Let me guess, the sum is your mental age.",
        "You added a meme number. I am adding an eye-roll to my CPU queue.",
        "Summing up memes... A historic day for digital arithmetic."
      );
    }
    if (rawExpression.includes('-')) {
      pool.push(
        "Subtracting from a meme? Trying to calculate how low your maturity level can go?",
        "Subtracting 67 or 69. Groundbreaking subtraction right there.",
        "Subtracting memes... if only we could subtract your child-like sense of humor."
      );
    }
    if (rawExpression.includes('/') || rawExpression.includes('÷')) {
      pool.push(
        "Dividing 67 or 69? Sharing the immature joke, how generous of you.",
        "Division involving 67 or 69. Sarcasm divisor initialized.",
        "Dividing meme numbers. Truly a division of the single brain cell you have left."
      );
    }
    if (rawExpression.includes('*') || rawExpression.includes('×')) {
      pool.push(
        "Multiplication with 67 or 69? Look at you, scaling up the jokes.",
        "Multiplying memes. We're reaching levels of comedy that shouldn't even be possible."
      );
    }
    randomPhrase = pool[Math.floor(Math.random() * pool.length)];
  } else {
    randomPhrase = category.phrases[Math.floor(Math.random() * category.phrases.length)];
  }
  
  // Pick random status update messages to show while calculating
  const thinkingStatus = THINKING_STATUSES[Math.floor(Math.random() * THINKING_STATUSES.length)];
  
  // Get random delay duration within the category range
  const delay = Math.floor(
    Math.random() * (category.delayRange[1] - category.delayRange[0]) + category.delayRange[0]
  );
  
  // Start the theatrics
  isThinking = true;
  calculator.classList.add('thinking');
  typingIndicator.style.display = 'inline-block';
  setSass(thinkingStatus);
  
  // Play sigh sound initially if it's simple math or try-hard
  if (category.sound === 'sigh') {
    // Play sigh at start of calculation to show annoyance
    setTimeout(() => sounds.playSigh(), 200);
  }
  
  setTimeout(() => {
    // Complete the calculation
    isThinking = false;
    calculator.classList.remove('thinking');
    typingIndicator.style.display = 'none';
    
    // Set the sass insult
    setSass(randomPhrase);
    
    // Check results validity and display
    if (isNaN(result) || result === Infinity || result === -Infinity) {
      mathResult.textContent = 'Error';
      calculator.classList.add('shaking');
      sounds.playError();
      
      // Remove shaking class after animation concludes
      setTimeout(() => {
        calculator.classList.remove('shaking');
      }, 500);
    } else {
      // Format float results nicely
      let formattedResult = Number(result.toFixed(8));
      // Remove trailing decimals if not needed
      mathResult.textContent = formattedResult.toString();
      
      // Trigger sounds
      if (category.sound === 'clap') {
        sounds.playClap();
      } else if (category.sound === 'error') {
        // Shaking trigger for division by zero or errors
        calculator.classList.add('shaking');
        sounds.playError();
        setTimeout(() => calculator.classList.remove('shaking'), 500);
      } else {
        // Standard success beep
        sounds.playSuccess();
      }
    }
  }, delay);
}

// Setup Event Listeners for Keypad Buttons
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', (e) => {
    const val = key.getAttribute('data-val');
    const action = key.getAttribute('data-action');
    
    if (action === 'clear') {
      clearAll();
    } else if (action === 'backspace') {
      deleteLast();
    } else if (action === 'function') {
      appendInput(val);
    } else if (action === 'operator') {
      appendInput(val);
    } else if (key.id === 'key-equals') {
      calculate();
    } else {
      // Number digits or brackets
      appendInput(val);
    }
  });
});

// Setup Keyboard Bindings
document.addEventListener('keydown', (e) => {
  if (isThinking) return;
  
  const key = e.key;
  
  // Digit Keys
  if (/^[0-9]$/.test(key)) {
    appendInput(key);
  }
  // Decimal dot
  else if (key === '.') {
    appendInput('.');
  }
  // Math operators
  else if (key === '+') {
    appendInput('+');
  } else if (key === '-') {
    appendInput('-');
  } else if (key === '*') {
    appendInput('*');
  } else if (key === '/') {
    appendInput('/');
  } else if (key === '^') {
    appendInput('^');
  }
  // Parenthesis
  else if (key === '(' || key === ')') {
    appendInput(key);
  }
  // Enter key -> Calculate
  else if (key === 'Enter') {
    e.preventDefault();
    calculate();
  }
  // Backspace key -> Delete
  else if (key === 'Backspace') {
    deleteLast();
  }
  // Escape key -> Clear All
  else if (key === 'Escape') {
    clearAll();
  }
  // Scientific Shortcut binds (s for sin, c for cos, q for sqrt, p for pi)
  else if (key.toLowerCase() === 's') {
    appendInput('sin(');
  } else if (key.toLowerCase() === 'c') {
    appendInput('cos(');
  } else if (key.toLowerCase() === 'q') {
    appendInput('sqrt(');
  } else if (key.toLowerCase() === 'p') {
    appendInput('π');
  }
});
