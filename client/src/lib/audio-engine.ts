import type { CustomSynthParams, CustomSoundDefinition } from './types';

// Procedural Web Audio Engine (100% offline, zero external sound files required)
class AudioEngine {
  private ctx: AudioContext | null = null;
  private customAudioCache: Map<string, AudioBuffer> = new Map();
  private customSounds: Map<string, CustomSoundDefinition> = new Map();

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playProceduralSound(type: string, volume = 0.6) {
    try {
      this.init();
      if (!this.ctx) return;

      // Check if it's a registered custom sound first
      if (this.customSounds.has(type)) {
        this.playCustomSound(type, volume);
        return;
      }

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume, now);
      masterGain.connect(this.ctx.destination);

      switch (type) {
        case 'click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
          gain.gain.setValueAtTime(0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'pop': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(740, now + 0.06);
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'switch': {
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc1.type = 'square';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(1400, now);
          osc2.frequency.setValueAtTime(700, now);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(masterGain);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.04);
          osc2.stop(now + 0.04);
          break;
        }

        case 'chime': {
          const freqs = [523.25, 659.25, 783.99, 1046.5]; // C Major
          freqs.forEach((f, i) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.04);
            gain.gain.setValueAtTime(0, now + i * 0.04);
            gain.gain.linearRampToValueAtTime(0.25, now + i * 0.04 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.45);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + i * 0.04);
            osc.stop(now + i * 0.04 + 0.5);
          });
          break;
        }

        case 'alert': {
          const pulse = (startTime: number, freq: number) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.4, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(startTime);
            osc.stop(startTime + 0.12);
          };
          pulse(now, 380);
          pulse(now + 0.11, 310);
          break;
        }

        case 'whoosh': {
          const bufferSize = this.ctx.sampleRate * 0.15;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(400, now);
          filter.frequency.exponentialRampToValueAtTime(1800, now + 0.15);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          noise.start(now);
          break;
        }

        case 'bell': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.65);
          break;
        }
      }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Play a custom synthesized sound directly from parameters
  playCustomSynth(params: CustomSynthParams, volume = 0.6) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume * (params.gain || 0.8), now);
      masterGain.connect(this.ctx.destination);

      if (params.notes && params.notes.length > 0) {
        // Multi-note arpeggio chord
        params.notes.forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = params.waveform;
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0, now + i * 0.05);
          gain.gain.linearRampToValueAtTime(0.3, now + i * 0.05 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + params.duration);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + params.duration + 0.05);
        });
      } else {
        // Single frequency sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = params.waveform;
        osc.frequency.setValueAtTime(params.startFreq, now);

        if (params.ramp === 'exponential') {
          osc.frequency.exponentialRampToValueAtTime(Math.max(20, params.endFreq), now + params.duration);
        } else {
          osc.frequency.linearRampToValueAtTime(params.endFreq, now + params.duration);
        }

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + params.duration);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + params.duration + 0.02);
      }
    } catch (e) {
      console.warn("Synth play error:", e);
    }
  }

  // Register a custom sound definition into memory
  registerCustomSound(def: CustomSoundDefinition) {
    this.customSounds.set(def.id, def);
    if (def.type === 'audio_file' && def.audioDataUrl) {
      this.decodeDataUrl(def.id, def.audioDataUrl);
    }
  }

  private async decodeDataUrl(id: string, dataUrl: string) {
    try {
      this.init();
      if (!this.ctx) return;
      const res = await fetch(dataUrl);
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.customAudioCache.set(id, audioBuffer);
    } catch (err) {
      console.warn(`Failed to decode audio for ${id}:`, err);
    }
  }

  playCustomSound(id: string, volume = 0.7) {
    const def = this.customSounds.get(id);
    if (def) {
      if (def.type === 'synth' && def.synthParams) {
        this.playCustomSynth(def.synthParams, volume);
        return;
      }
      if (def.type === 'audio_file') {
        const cached = this.customAudioCache.get(id);
        if (cached && this.ctx) {
          const source = this.ctx.createBufferSource();
          source.buffer = cached;
          const gain = this.ctx.createGain();
          gain.gain.value = volume;
          source.connect(gain);
          gain.connect(this.ctx.destination);
          source.start();
          return;
        }
      }
    }
    // Fallback to custom audio cache
    this.playCustomAudio(id, volume);
  }

  async loadCustomAudio(id: string, file: File) {
    this.init();
    if (!this.ctx) return;
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.customAudioCache.set(id, audioBuffer);
  }

  playCustomAudio(id: string, volume = 0.7) {
    this.init();
    if (!this.ctx) return;
    const buffer = this.customAudioCache.get(id);
    if (!buffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }
}

export const soundEngine = new AudioEngine();
