import { ShutterSoundType } from '../types/camera';

class CameraAudioEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playShutterSound(type: ShutterSoundType) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'leica_cloth':
          this.playLeicaCloth(ctx, now);
          break;
        case 'hasselblad_slap':
          this.playHasselbladSlap(ctx, now);
          break;
        case 'rolleiflex_leaf':
          this.playRolleiflexLeaf(ctx, now);
          break;
        case 'pentax67_cannon':
          this.playPentax67Cannon(ctx, now);
          break;
        case 'contax_motor':
          this.playContaxMotor(ctx, now);
          break;
        case 'trip35_click':
          this.playTrip35Click(ctx, now);
          break;
        case 'electronic_beep':
          this.playDcs100Beep(ctx, now);
          break;
        case 'slr_mechanical':
        case 'modern_pro':
        default:
          this.playSlrMechanical(ctx, now);
          break;
      }
    } catch {
      // Audio autoplay policy fallback (silent)
    }
  }

  // Leica cloth horizontal focal plane shutter: whisper-quiet
  private playLeicaCloth(ctx: AudioContext, t: number) {
    const noise = this.createNoiseBuffer(ctx, 0.08);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(3.0, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);

    // Subtle second curtain snip
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, t + 0.035);
    oscGain.gain.setValueAtTime(0.12, t + 0.035);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t + 0.035);
    osc.stop(t + 0.07);
  }

  // Hasselblad 500C/M: Thunderous mirror flap + leaf shutter + film advance crank ratchet
  private playHasselbladSlap(ctx: AudioContext, t: number) {
    // Stage 1: Mirror slap up (heavy mechanical thud)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.frequency.setValueAtTime(110, t);
    osc1.frequency.exponentialRampToValueAtTime(45, t + 0.08);
    gain1.gain.setValueAtTime(0.65, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.09);

    // Stage 2: Central leaf shutter snap
    const noise = this.createNoiseBuffer(ctx, 0.06);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t + 0.05);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.4, t + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.11);
    noise.connect(filter);
    filter.connect(gain2);
    gain2.connect(ctx.destination);
    noise.start(t + 0.05);

    // Stage 3: Rear barn door flaps snap shut
    const flapOsc = ctx.createOscillator();
    const flapGain = ctx.createGain();
    flapOsc.frequency.setValueAtTime(160, t + 0.12);
    flapGain.gain.setValueAtTime(0.35, t + 0.12);
    flapGain.gain.exponentialRampToValueAtTime(0.005, t + 0.19);
    flapOsc.connect(flapGain);
    flapGain.connect(ctx.destination);
    flapOsc.start(t + 0.12);
    flapOsc.stop(t + 0.2);

    // Stage 4: Winding crank ratchet (ch-ch-chk)
    for (let i = 0; i < 3; i++) {
      const clickTime = t + 0.22 + i * 0.06;
      const rNoise = this.createNoiseBuffer(ctx, 0.02);
      const rGain = ctx.createGain();
      rGain.gain.setValueAtTime(0.18, clickTime);
      rGain.gain.exponentialRampToValueAtTime(0.01, clickTime + 0.025);
      rNoise.connect(rGain);
      rGain.connect(ctx.destination);
      rNoise.start(clickTime);
    }
  }

  // Rolleiflex: Ultra-gentle Synchro-Compur leaf shutter snip
  private playRolleiflexLeaf(ctx: AudioContext, t: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.04);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Pentax 6x7: Heavy cannon mirror slap
  private playPentax67Cannon(ctx: AudioContext, t: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.15);
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);

    const noise = this.createNoiseBuffer(ctx, 0.12);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.4, t + 0.02);
    nGain.gain.exponentialRampToValueAtTime(0.01, t + 0.13);
    noise.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t + 0.02);
  }

  // Contax T2: Crisp shutter click followed by motorized advance whir
  private playContaxMotor(ctx: AudioContext, t: number) {
    // Click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(2200, t);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);

    // Motor whir
    const motorOsc = ctx.createOscillator();
    const motorGain = ctx.createGain();
    motorOsc.type = 'sawtooth';
    motorOsc.frequency.setValueAtTime(380, t + 0.06);
    motorOsc.frequency.linearRampToValueAtTime(440, t + 0.18);
    motorGain.gain.setValueAtTime(0.12, t + 0.06);
    motorGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    motorOsc.connect(motorGain);
    motorGain.connect(ctx.destination);
    motorOsc.start(t + 0.06);
    motorOsc.stop(t + 0.23);
  }

  // Olympus Trip 35 mechanical click
  private playTrip35Click(ctx: AudioContext, t: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(1600, t);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // Kodak DCS 100 early digital beep + CCD buffer read
  private playDcs100Beep(ctx: AudioContext, t: number) {
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(880, t);
    gain1.gain.setValueAtTime(0.15, t);
    gain1.gain.setValueAtTime(0.15, t + 0.05);
    gain1.gain.setValueAtTime(0.0, t + 0.06);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.07);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1760, t + 0.08);
    gain2.gain.setValueAtTime(0.15, t + 0.08);
    gain2.gain.setValueAtTime(0.0, t + 0.15);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.16);
  }

  // Classic 35mm SLR (FM2, K1000, AE-1, F3, etc.)
  private playSlrMechanical(ctx: AudioContext, t: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.07);
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);

    const noise = this.createNoiseBuffer(ctx, 0.05);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.25, t + 0.02);
    nGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    noise.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t + 0.02);
  }

  private createNoiseBuffer(ctx: AudioContext, duration: number): AudioBufferSourceNode {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    return whiteNoise;
  }
}

export const cameraAudio = new CameraAudioEngine();
