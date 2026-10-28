// Lógica pura dos efeitos: sem Tone.js, testável com Vitest.
export type EffectName = 'filter' | 'echo'
export type EffectMode = 'manter' | 'segurar'
export type EffectAction = 'press' | 'release'

const DEFAULT_BPM = 120
// Colcheia pontuada = 3/4 de um tempo.
const ECHO_BEATS = 0.75
// Teto para BPMs absurdos (loop mal cortado); o delay é criado com folga acima disso.
export const MAX_ECHO_SECONDS = 1.5

// manter: apertar inverte, soltar não muda. segurar: apertar liga, soltar desliga.
export function effectAfter(on: boolean, mode: EffectMode, action: EffectAction): boolean {
  if (mode === 'segurar') return action === 'press'
  return action === 'press' ? !on : on
}

export function echoDelaySeconds(bpm: number | null): number {
  return Math.min(MAX_ECHO_SECONDS, (60 / (bpm ?? DEFAULT_BPM)) * ECHO_BEATS)
}
