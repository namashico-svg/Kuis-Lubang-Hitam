/**
 * Web Audio API synthesizer for the futuristic cosmic educational app.
 * Synthesizes UI sounds and spatial soundscapes dynamically.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOscillators: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;
  private isAmbientPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      // Handle cross-browser AudioContext
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    // Resume context if suspended (browser security policies)
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio Click Play error:", e);
    }
  }

  playCorrect() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5 (arpeggio)
      const duration = 0.12;

      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        // High frequency sparkly filter for space effect
        const filter = this.ctx!.createBiquadFilter();
        filter.type = "peaking";
        filter.frequency.value = 1000;
        filter.Q.value = 3;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = "triangle";
        osc.frequency.value = freq;

        const startTime = now + index * 0.06;
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      });
    } catch (e) {
      console.warn("Audio Correct Play error:", e);
    }
  }

  playWrong() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, now);

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(95, now);
      osc1.frequency.linearRampToValueAtTime(45, now + 0.45);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(92, now);
      osc2.frequency.linearRampToValueAtTime(42, now + 0.45);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.start();
      osc2.start();

      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn("Audio Wrong Play error:", e);
    }
  }

  startAmbientSpace() {
    try {
      this.initCtx();
      if (!this.ctx || this.isAmbientPlaying) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(65.41, now); // C2
      // LFO frequency mod for deep breathing nebula effect
      osc1.frequency.linearRampToValueAtTime(64.8, now + 10);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(98.0, now); // G2
      osc2.frequency.linearRampToValueAtTime(98.8, now + 10);

      filter.type = "lowpass";
      filter.frequency.value = 120;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Deep celestial breathing fade-in
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 3);

      osc1.start();
      osc2.start();

      this.ambientOscillators = { osc1, osc2, gain };
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn("Ambient space audio start error:", e);
    }
  }

  stopAmbientSpace() {
    try {
      if (!this.ctx || !this.ambientOscillators || !this.isAmbientPlaying) return;

      const now = this.ctx.currentTime;
      const { osc1, osc2, gain } = this.ambientOscillators;

      // Soft cellular fade-out
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.5);

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
        } catch (err) {}
      }, 1500);

      this.ambientOscillators = null;
      this.isAmbientPlaying = false;
    } catch (e) {
      console.warn("Ambient space audio stop error:", e);
    }
  }

  toggleAmbient(force?: boolean) {
    const nextState = force !== undefined ? force : !this.isAmbientPlaying;
    if (nextState) {
      this.startAmbientSpace();
    } else {
      this.stopAmbientSpace();
    }
    return this.isAmbientPlaying;
  }

  isAmbientActive() {
    return this.isAmbientPlaying;
  }
}

export const sound = new SoundEngine();
