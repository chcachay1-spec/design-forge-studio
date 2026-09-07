import type { CustomAnimationDefinition } from './types';

export const INITIAL_CUSTOM_ANIMATIONS: CustomAnimationDefinition[] = [
  {
    id: 'anim-neon-pulse',
    name: 'Neon Glow Pulse',
    description: 'Resplandor cíclico con sombras color violeta y magenta.',
    animationClass: 'anim-custom-neon',
    defaultDuration: '2s',
    defaultTiming: 'ease-in-out',
    category: 'glow',
    keyframesCss: `
@keyframes anim-custom-neon {
  0%, 100% {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.4), 0 0 20px rgba(236, 72, 153, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 25px rgba(99, 102, 241, 0.8), 0 0 45px rgba(236, 72, 153, 0.6);
    transform: scale(1.02);
  }
}
.anim-custom-neon {
  animation: anim-custom-neon 2s infinite ease-in-out;
}
`,
  },
  {
    id: 'anim-levitate-float',
    name: 'Smooth Levitation',
    description: 'Flotación vertical fluida con inclinación dinámica sutil.',
    animationClass: 'anim-custom-levitate',
    defaultDuration: '3.5s',
    defaultTiming: 'ease-in-out',
    category: 'motion',
    keyframesCss: `
@keyframes anim-custom-levitate {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(0.8deg);
  }
}
.anim-custom-levitate {
  animation: anim-custom-levitate 3.5s infinite ease-in-out;
}
`,
  },
  {
    id: 'anim-3d-tilt-shake',
    name: 'Tactile Attention Wobble',
    description: 'Bamboleo háptico tridimensional para botones destacados o tarjetas.',
    animationClass: 'anim-custom-wobble',
    defaultDuration: '1.2s',
    defaultTiming: 'cubic-bezier(0.25, 1, 0.5, 1)',
    category: 'attention',
    keyframesCss: `
@keyframes anim-custom-wobble {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.03) rotate(-2deg); }
  50% { transform: scale(1.04) rotate(2deg); }
  75% { transform: scale(1.02) rotate(-1deg); }
}
.anim-custom-wobble {
  animation: anim-custom-wobble 1.2s infinite ease-in-out;
}
`,
  },
  {
    id: 'anim-shimmer-border',
    name: 'Cyber Shimmer Border',
    description: 'Destello de borde metálico cromado que viaja por la superficie.',
    animationClass: 'anim-custom-shimmer',
    defaultDuration: '2.5s',
    defaultTiming: 'linear',
    category: 'glow',
    keyframesCss: `
@keyframes anim-custom-shimmer {
  0% {
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: inset 0 0 10px rgba(99, 102, 241, 0.2);
  }
  50% {
    border-color: rgba(56, 189, 248, 0.9);
    box-shadow: inset 0 0 20px rgba(56, 189, 248, 0.4), 0 0 15px rgba(56, 189, 248, 0.5);
  }
  100% {
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: inset 0 0 10px rgba(99, 102, 241, 0.2);
  }
}
.anim-custom-shimmer {
  animation: anim-custom-shimmer 2.5s infinite linear;
}
`,
  },
  {
    id: 'anim-breathe-scale',
    name: 'Subtle Breathe',
    description: 'Efecto de respiración suave de escala y opacidad.',
    animationClass: 'anim-custom-breathe',
    defaultDuration: '4s',
    defaultTiming: 'ease-in-out',
    category: 'motion',
    keyframesCss: `
@keyframes anim-custom-breathe {
  0%, 100% { transform: scale(1); opacity: 0.92; }
  50% { transform: scale(1.035); opacity: 1; }
}
.anim-custom-breathe {
  animation: anim-custom-breathe 4s infinite ease-in-out;
}
`,
  },
];

// Inject custom keyframe styles into document head dynamically
export function injectCustomAnimationStyles(animations: CustomAnimationDefinition[]) {
  if (typeof document === 'undefined') return;
  let styleEl = document.getElementById('design-forge-custom-animations') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'design-forge-custom-animations';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = animations.map(a => a.keyframesCss).join('\n\n');
}
