// Original synthesized sounds (Web Audio) - no audio files needed.
let ctx: AudioContext | null = null
function ac() { const C = window.AudioContext || (window as any).webkitAudioContext; if (!C) return null; ctx ??= new C(); if (ctx.state === 'suspended') void ctx.resume(); return ctx }
function beep(f: number, t0: number, d: number, type: OscillatorType = 'sine', v = .15) {
  const c = ac(); if (!c) return; const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f
  g.gain.setValueAtTime(v, c.currentTime + t0); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + t0 + d)
  o.connect(g).connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + d)
}
let timer = 0
export const sfx = {
  unlock: ac,
  startSpin() { sfx.stopSpin(); let f = 0; timer = window.setInterval(() => beep(300 + (f++ % 4) * 40, 0, .05, 'square', .06), 110) },
  stopSpin() { clearInterval(timer) },
  stop() { beep(120, 0, .25, 'triangle', .3); beep(80, .05, .3, 'sine', .3) },
  reveal() { [523, 659, 784, 1047].forEach((f, i) => beep(f, i * .1, .25, 'triangle')) },
  category() { beep(440, 0, .15); beep(660, .12, .25) },
  done() { [659, 880].forEach((f, i) => beep(f, i * .12, .2)) },
  passed() { beep(330, 0, .2, 'sawtooth', .08); beep(220, .15, .3, 'sawtooth', .08) },
}
