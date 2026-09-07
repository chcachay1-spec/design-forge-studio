import type { CustomSynthParams } from './types';

export interface SoundPromptResult {
  name: string;
  category: 'button' | 'notification' | 'success' | 'error' | 'transition';
  params: CustomSynthParams;
  variations: CustomSynthParams[];
}

export const SOUND_UI_PRESETS: Array<{
  id: string;
  category: 'Botones' | 'Notificaciones' | 'Éxito' | 'Error' | 'Transición';
  name: string;
  description: string;
  prompt: string;
  params: CustomSynthParams;
}> = [
  {
    id: 'pr-subtle-click',
    category: 'Botones',
    name: 'Clic Sutil (Subtle Tap)',
    description: 'Pulsación corta para botones secundarios y switches',
    prompt: 'clic sutil',
    params: { waveform: 'triangle', startFreq: 850, endFreq: 140, duration: 0.04, ramp: 'exponential', gain: 0.7, name: 'Clic Sutil' }
  },
  {
    id: 'pr-pop-bubble',
    category: 'Botones',
    name: 'Pop Burbuja (Mobile Pop)',
    description: 'Tap moderno redondo estilo iOS / Instagram',
    prompt: 'pop burbuja',
    params: { waveform: 'sine', startFreq: 320, endFreq: 760, duration: 0.07, ramp: 'exponential', gain: 0.8, name: 'Pop Burbuja' }
  },
  {
    id: 'pr-toggle-switch',
    category: 'Botones',
    name: 'Interruptor Switch',
    description: 'Clic de palanca mecánica limpia',
    prompt: 'interruptor switch',
    params: { waveform: 'square', startFreq: 1300, endFreq: 450, duration: 0.035, ramp: 'exponential', gain: 0.35, name: 'Interruptor Switch' }
  },
  {
    id: 'pr-bell-notify',
    category: 'Notificaciones',
    name: 'Campana Suave (Soft Ping)',
    description: 'Alerta agradable para mensajes y recordatorios',
    prompt: 'notificacion campana',
    params: { waveform: 'sine', startFreq: 880, endFreq: 880, duration: 0.35, ramp: 'exponential', gain: 0.75, name: 'Campana Suave' }
  },
  {
    id: 'pr-subtle-ping',
    category: 'Notificaciones',
    name: 'Ping de Mensaje',
    description: 'Notificación de chat entrante',
    prompt: 'ping mensaje',
    params: { waveform: 'triangle', startFreq: 1046, endFreq: 523, duration: 0.18, ramp: 'exponential', gain: 0.65, name: 'Ping de Mensaje' }
  },
  {
    id: 'pr-chime-success',
    category: 'Éxito',
    name: 'Arpegio de Éxito (Success Chime)',
    description: 'Acorde C-Mayor de tarea completada o pago recibido',
    prompt: 'alerta de exito',
    params: { waveform: 'sine', startFreq: 523, endFreq: 1046, duration: 0.45, ramp: 'exponential', gain: 0.8, name: 'Arpegio de Éxito', notes: [523.25, 659.25, 783.99, 1046.5] }
  },
  {
    id: 'pr-coin-success',
    category: 'Éxito',
    name: 'Moneda / Recompensa (Coin Gem)',
    description: 'Subida de saldo o recompensa gamificada',
    prompt: 'moneda exito',
    params: { waveform: 'sine', startFreq: 987, endFreq: 1318, duration: 0.18, ramp: 'linear', gain: 0.75, name: 'Moneda Éxito' }
  },
  {
    id: 'pr-gentle-alert',
    category: 'Error',
    name: 'Alerta Suave (Gentle Warning)',
    description: 'Error no invasivo de validación de formulario',
    prompt: 'error suave',
    params: { waveform: 'sawtooth', startFreq: 340, endFreq: 220, duration: 0.16, ramp: 'exponential', gain: 0.55, name: 'Alerta Suave' }
  },
  {
    id: 'pr-buzzer-error',
    category: 'Error',
    name: 'Rechazo / Bloqueo',
    description: 'Indicador de acción rechazada o falta de permisos',
    prompt: 'error rechazo',
    params: { waveform: 'square', startFreq: 180, endFreq: 110, duration: 0.22, ramp: 'exponential', gain: 0.45, name: 'Rechazo Bloqueo' }
  },
  {
    id: 'pr-whoosh-slide',
    category: 'Transición',
    name: 'Deslizar Menú (Swipe Whoosh)',
    description: 'Apertura de modal, swipe o cambio de pantalla',
    prompt: 'deslizar menu',
    params: { waveform: 'triangle', startFreq: 400, endFreq: 120, duration: 0.12, ramp: 'exponential', gain: 0.6, name: 'Deslizar Menú' }
  },
  {
    id: 'pr-drawer-open',
    category: 'Transición',
    name: 'Expansión Drawer',
    description: 'Apertura fluida de panel lateral',
    prompt: 'transicion drawer',
    params: { waveform: 'sine', startFreq: 220, endFreq: 440, duration: 0.15, ramp: 'linear', gain: 0.6, name: 'Expansión Drawer' }
  },
];

// Interpret text prompt into synthesized sound parameters and create 4 pitch/envelope variations
export function generateSoundFromPrompt(userPrompt: string, maxDurationLimit = 1.0): SoundPromptResult {
  const p = userPrompt.toLowerCase();

  let baseParams: CustomSynthParams = {
    waveform: 'sine',
    startFreq: 600,
    endFreq: 250,
    duration: 0.08,
    ramp: 'exponential',
    gain: 0.8,
    name: userPrompt.slice(0, 24) || 'UI Sound',
  };
  let category: SoundPromptResult['category'] = 'button';

  if (p.includes('clic') || p.includes('click') || p.includes('tap') || p.includes('pulsar')) {
    category = 'button';
    baseParams = {
      waveform: p.includes('mecanico') ? 'square' : 'triangle',
      startFreq: 820,
      endFreq: 120,
      duration: 0.04,
      ramp: 'exponential',
      gain: 0.75,
      name: 'Clic Sutil UI',
    };
  } else if (p.includes('pop') || p.includes('burbuja') || p.includes('burbuj')) {
    category = 'button';
    baseParams = {
      waveform: 'sine',
      startFreq: 330,
      endFreq: 780,
      duration: 0.07,
      ramp: 'exponential',
      gain: 0.85,
      name: 'Bubble Pop',
    };
  } else if (p.includes('exito') || p.includes('success') || p.includes('acierto') || p.includes('pago') || p.includes('completado')) {
    category = 'success';
    baseParams = {
      waveform: 'sine',
      startFreq: 523,
      endFreq: 1046,
      duration: Math.min(maxDurationLimit, 0.45),
      ramp: 'exponential',
      gain: 0.8,
      notes: [523.25, 659.25, 783.99, 1046.5],
      name: 'Éxito UI',
    };
  } else if (p.includes('error') || p.includes('alerta') || p.includes('fallo') || p.includes('cancel')) {
    category = 'error';
    baseParams = {
      waveform: 'sawtooth',
      startFreq: 360,
      endFreq: 180,
      duration: Math.min(maxDurationLimit, 0.18),
      ramp: 'exponential',
      gain: 0.6,
      name: 'Alerta Error',
    };
  } else if (p.includes('deslizar') || p.includes('slide') || p.includes('swipe') || p.includes('transicion') || p.includes('menu')) {
    category = 'transition';
    baseParams = {
      waveform: 'triangle',
      startFreq: 450,
      endFreq: 150,
      duration: Math.min(maxDurationLimit, 0.12),
      ramp: 'exponential',
      gain: 0.65,
      name: 'Deslizar Menú',
    };
  } else if (p.includes('campana') || p.includes('bell') || p.includes('notificacion') || p.includes('ping')) {
    category = 'notification';
    baseParams = {
      waveform: 'sine',
      startFreq: 900,
      endFreq: 900,
      duration: Math.min(maxDurationLimit, 0.3),
      ramp: 'exponential',
      gain: 0.8,
      name: 'Notificación Campana',
    };
  } else if (p.includes('retro') || p.includes('8bit') || p.includes('8-bit') || p.includes('arcade') || p.includes('laser')) {
    category = 'button';
    baseParams = {
      waveform: 'square',
      startFreq: 1400,
      endFreq: 100,
      duration: Math.min(maxDurationLimit, 0.12),
      ramp: 'exponential',
      gain: 0.5,
      name: 'Retro 8-Bit',
    };
  }

  // Force strict UI duration (max 1.5s, typical 0.04s - 0.5s)
  baseParams.duration = Math.min(maxDurationLimit, Math.max(0.02, baseParams.duration));

  // Generate 4 micro-variations of pitch and timing so repetition doesn't sound robotic
  const pitchRatios = [0.92, 1.0, 1.08, 1.16];
  const variations: CustomSynthParams[] = pitchRatios.map((ratio, idx) => ({
    ...baseParams,
    name: baseParams.name + ' (Var ' + (idx + 1) + ')',
    startFreq: Math.round(baseParams.startFreq * ratio),
    endFreq: Math.round(baseParams.endFreq * ratio),
    duration: Number((baseParams.duration * (1 + (idx - 1.5) * 0.08)).toFixed(3)),
    notes: baseParams.notes ? baseParams.notes.map(n => Math.round(n * ratio)) : undefined,
  }));

  return {
    name: baseParams.name || 'Sonido Generado',
    category,
    params: baseParams,
    variations,
  };
}

// Retro 8-bit Algorithmic Generator (jsfxr style for chip-tune / minimalist games)
export function generateRetro8BitSound(type: 'coin' | 'laser' | 'jump' | 'hit'): CustomSynthParams {
  switch (type) {
    case 'coin':
      return {
        waveform: 'square',
        startFreq: 987,
        endFreq: 1318,
        duration: 0.14,
        ramp: 'linear',
        gain: 0.6,
        name: 'Retro Coin',
        notes: [987.77, 1318.51]
      };
    case 'laser':
      return {
        waveform: 'sawtooth',
        startFreq: 1800,
        endFreq: 80,
        duration: 0.12,
        ramp: 'exponential',
        gain: 0.55,
        name: 'Retro Laser'
      };
    case 'jump':
      return {
        waveform: 'square',
        startFreq: 150,
        endFreq: 600,
        duration: 0.16,
        ramp: 'linear',
        gain: 0.5,
        name: 'Retro Jump'
      };
    case 'hit':
      return {
        waveform: 'sawtooth',
        startFreq: 260,
        endFreq: 40,
        duration: 0.18,
        ramp: 'exponential',
        gain: 0.7,
        name: 'Retro Hit'
      };
  }
}
