import { Platform, Vibration } from 'react-native';

/**
 * Plays a pleasant, soft two-tone chime for QR scan success.
 * Uses Web Audio API on web for generated pleasant tones.
 * Uses expo-audio on mobile for sound playback.
 * Also triggers a subtle haptic vibration on devices.
 */
export function playQrScanSuccessSound() {
  // 1. Tactile haptic feedback on supported mobile devices
  if (Platform.OS !== 'web') {
    try {
      Vibration.vibrate(50);
    } catch {
      // Haptic is optional
    }
  }

  // 2. Web playback via Web Audio API — ascending C major arpeggio with bell harmonics
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();

        // C5 → E5 → G5 → C6, each with bell partials (fundamental + 2nd + 3rd + slight inharmonic 4th)
        const notes = [
          { freq: 523.25, start: 0.00, dur: 0.45, gain: 0.60 },
          { freq: 659.25, start: 0.11, dur: 0.45, gain: 0.60 },
          { freq: 783.99, start: 0.22, dur: 0.50, gain: 0.58 },
          { freq: 1046.5, start: 0.33, dur: 0.70, gain: 0.70 },
        ];
        const partials = [
          { ratio: 1.0,  gain: 1.00 },
          { ratio: 2.0,  gain: 0.35 },
          { ratio: 3.0,  gain: 0.14 },
          { ratio: 4.01, gain: 0.07 },
        ];

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.28, ctx.currentTime);
        masterGain.connect(ctx.destination);

        for (const note of notes) {
          const noteStart = ctx.currentTime + note.start;
          const noteEnd   = noteStart + note.dur;

          for (const partial of partials) {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq * partial.ratio, noteStart);

            // Bell envelope: instant attack, exponential decay
            gain.gain.setValueAtTime(0, noteStart);
            gain.gain.linearRampToValueAtTime(note.gain * partial.gain, noteStart + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(noteStart);
            osc.stop(noteEnd);
          }
        }
        return;
      }
    } catch {
      // Autoplay or browser restriction — silent fallback
    }
    return;
  }

  // 3. Native playback via expo-audio (v58+ API — createAudioPlayer, no class instantiation)
  try {
    const { createAudioPlayer } = require('expo-audio');

    // Module-level singleton player so we don't recreate on every scan
    if (!playQrScanSuccessSound._player) {
      playQrScanSuccessSound._player = createAudioPlayer(
        require('../../assets/pleasant-chime.wav')
      );
    }
    const player = playQrScanSuccessSound._player;

    // Rewind to start in case it was already played once, then play
    try { player.seekTo(0); } catch { /* seekTo may throw if not yet buffered */ }
    player.play();
  } catch (error) {
    // If expo-audio is unavailable or sound file is missing, fail gracefully
    // Haptic feedback is already provided above
    if (__DEV__) {
      console.log('[soundEffects] Native audio skipped, using haptic only:', error?.message);
    }
  }
}

/**
 * Plays a distinct warning/error sound for duplicate or already-received QR scans.
 * Uses Web Audio API on web for dual-tone descending buzzer.
 * Uses expo-audio on mobile for audio playback.
 * Triggers a double-pulse tactile vibration on mobile.
 */
export function playQrScanErrorSound() {
  // 1. Tactile double-pulse vibration on mobile
  if (Platform.OS !== 'web') {
    try {
      Vibration.vibrate([0, 90, 70, 130]);
    } catch {
      // Haptic is optional
    }
  }

  // 2. Web playback via Web Audio API (descending negative alert buzzer)
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();

        const tones = [
          { freq: 370.0, start: 0.00, dur: 0.14, gain: 0.35 },
          { freq: 277.18, start: 0.18, dur: 0.28, gain: 0.40 },
        ];

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
        masterGain.connect(ctx.destination);

        for (const tone of tones) {
          const noteStart = ctx.currentTime + tone.start;
          const noteEnd = noteStart + tone.dur;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(tone.freq, noteStart);

          gain.gain.setValueAtTime(0, noteStart);
          gain.gain.linearRampToValueAtTime(tone.gain, noteStart + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(noteStart);
          osc.stop(noteEnd);
        }
        return;
      }
    } catch {
      // Autoplay or browser restriction — silent fallback
    }
    return;
  }

  // 3. Native playback via expo-audio
  try {
    const { createAudioPlayer } = require('expo-audio');

    if (!playQrScanErrorSound._player) {
      playQrScanErrorSound._player = createAudioPlayer(
        require('../../assets/scan-error.wav')
      );
    }
    const player = playQrScanErrorSound._player;

    try { player.seekTo(0); } catch { /* seekTo may throw if not yet buffered */ }
    player.play();
  } catch (error) {
    if (__DEV__) {
      console.log('[soundEffects] Native error audio skipped, using haptic only:', error?.message);
    }
  }
}
