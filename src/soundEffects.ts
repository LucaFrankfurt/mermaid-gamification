// 100% Offline-First Sound Synthesizer using Native Web Audio API
// Generates nostalgic 8-bit game style sound effects.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a quick positive synth beep (Success validation)
 */
export function playSuccess(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play a dual-tone arpeggio (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle'; // Retro warm synth feel
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0.1, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.3);
    });
  } catch (err) {
    console.warn("AudioContext failed to load:", err);
  }
}

/**
 * Play a low warning buzz (Validation fail or compilation error)
 */
export function playFailure(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth'; // Retro buzz sound
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.35); // Sliders down in frequency
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (err) {
    console.warn("AudioContext failed to load:", err);
  }
}

/**
 * Play a grand level-up fanfare
 */
export function playLevelUp(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Notes: C4 -> G4 -> C5 -> E5 -> G5 -> C6
    const notes = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);
      
      // Add slight vibrato to the final note
      if (index === notes.length - 1) {
        osc.frequency.setValueAtTime(freq, now + index * 0.07);
        osc.frequency.linearRampToValueAtTime(freq + 15, now + index * 0.07 + 0.15);
        osc.frequency.linearRampToValueAtTime(freq - 15, now + index * 0.07 + 0.3);
      }
      
      const duration = index === notes.length - 1 ? 0.7 : 0.3;
      gain.gain.setValueAtTime(0.1, now + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + duration - 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + duration);
    });
  } catch (err) {
    console.warn("AudioContext failed to load:", err);
  }
}

/**
 * Subtle button click pop
 */
export function playClick(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {
    console.warn("AudioContext failed to load:", err);
  }
}
