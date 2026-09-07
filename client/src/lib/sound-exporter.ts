import type { CustomSynthParams } from './types';

// Converts an AudioBuffer or procedural synth parameters to a high-quality 16-bit PCM WAV Blob
export function bufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * blockAlign;
  const bufferLength = 44 + length;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  // Write audio samples
  let offset = 44;
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channels[channel][i];
      // Clamp between -1 and 1
      sample = Math.max(-1, Math.min(1, sample));
      // Scale to 16-bit signed integer
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Render custom synth parameters to AudioBuffer using OfflineAudioContext (Ultra-fast & 100% offline)
export async function renderSynthToBuffer(params: CustomSynthParams): Promise<AudioBuffer> {
  const dur = Math.min(2.0, Math.max(0.02, params.duration));
  const sampleRate = 44100;
  const offlineCtx = new OfflineAudioContext(1, Math.ceil(dur * sampleRate) + 1000, sampleRate);
  const now = 0;

  const gain = offlineCtx.createGain();
  const attack = Math.min(0.04, dur * 0.2);
  const decay = dur - attack;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(params.gain || 0.8, now + attack);
  if (params.ramp === 'exponential') {
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  } else {
    gain.gain.linearRampToValueAtTime(0.0001, now + attack + decay);
  }

  if (params.notes && params.notes.length > 0) {
    const step = dur / params.notes.length;
    params.notes.forEach((freq, i) => {
      const osc = offlineCtx.createOscillator();
      osc.type = params.waveform || 'sine';
      osc.frequency.setValueAtTime(freq, now + i * step);
      osc.connect(gain);
      osc.start(now + i * step);
      osc.stop(now + (i + 1) * step + 0.05);
    });
  } else {
    const osc = offlineCtx.createOscillator();
    osc.type = params.waveform || 'triangle';
    osc.frequency.setValueAtTime(params.startFreq, now);
    if (params.ramp === 'exponential') {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, params.endFreq), now + dur);
    } else {
      osc.frequency.linearRampToValueAtTime(params.endFreq, now + dur);
    }
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  gain.connect(offlineCtx.destination);
  return await offlineCtx.startRendering();
}

// Generate code snippet in Web JS, Swift (iOS) or Kotlin (Android)
export function generateSoundCodeSnippet(soundName: string, _soundType: string, lang: 'js' | 'swift' | 'kotlin'): string {
  const safeName = soundName.toLowerCase().replace(/[^a-z0-9]/g, '_');

  if (lang === 'js') {
    return `// Reproducir sonido de UI en Web / React
const audio = new Audio('/sounds/${safeName}.wav');
audio.volume = 0.6;
audio.play().catch(e => console.warn('Audio play prevented:', e));`;
  }

  if (lang === 'swift') {
    return `// Reproducir en iOS / SwiftUI con AVFoundation
import AVFoundation

class SoundManager {
    static var player: AVAudioPlayer?
    static func play_${safeName}() {
        guard let url = Bundle.main.url(forResource: "${safeName}", withExtension: "wav") else { return }
        do {
            player = try AVAudioPlayer(contentsOf: url)
            player?.prepareToPlay()
            player?.play()
        } catch {
            print("Error playing sound: \\(error)")
        }
    }
}`;
  }

  // Kotlin (Android)
  return `// Reproducir en Android / Jetpack Compose con SoundPool
import android.content.Context
import android.media.SoundPool

class SoundManager(context: Context) {
    private val soundPool = SoundPool.Builder().setMaxStreams(4).build()
    private val soundId = soundPool.load(context, R.raw.${safeName}, 1)

    fun play${safeName.toUpperCase()}() {
        soundPool.play(soundId, 0.7f, 0.7f, 1, 0, 1.0f)
    }
}`;
}
