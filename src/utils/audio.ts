import { sfx } from './soundFX';

class SoundEngine {
  public enabled: boolean = true;

  // Crisp, tactile mechanical cyber click
  public playClick() {
    if (!this.enabled) return;
    try {
      sfx.playClick();
    } catch {
      // Ignore audio failure
    }
  }

  // Ultra-subtle high-frequency tick for hover
  public playHover() {
    if (!this.enabled) return;
    try {
      sfx.playHover();
    } catch {
      // Ignore audio failure
    }
  }

  // Tactical Switch chirp
  public playSwitch() {
    if (!this.enabled) return;
    try {
      sfx.playTabSwitch();
    } catch {
      // Ignore audio failure
    }
  }

  // Sci-fi laser sweep
  public playLaserSweep() {
    if (!this.enabled) return;
    try {
      sfx.playLaserSweep();
    } catch {
      // Ignore audio failure
    }
  }

  // Clean dual-tone neon chime
  public playSuccess() {
    if (!this.enabled) return;
    try {
      sfx.playSuccess();
    } catch {
      // Ignore audio failure
    }
  }

  // Cyber Alert: Harsh warning
  public playAlert() {
    if (!this.enabled) return;
    try {
      sfx.playLaserSweep();
    } catch {
      // Ignore audio failure
    }
  }
}

export const sound = new SoundEngine();
export { sfx };

