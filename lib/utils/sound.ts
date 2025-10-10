// Sound utility for playing audio files
export class SoundManager {
  private static audioContext: AudioContext | null = null;
  private static audioBuffers: Map<string, AudioBuffer> = new Map();
  private static currentSpinnerSource: AudioBufferSourceNode | null = null;

  // Initialize audio context
  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Load audio file
  private static async loadAudio(url: string): Promise<AudioBuffer> {
    if (this.audioBuffers.has(url)) {
      return this.audioBuffers.get(url)!;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = this.getAudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error('Failed to load audio:', url, error);
      throw error;
    }
  }

  // Play button click sound
  static async playButtonClick(): Promise<void> {
    try {
      const audioBuffer = await this.loadAudio('/gifsAndSounds/Button.mp3');
      const audioContext = this.getAudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Failed to play button sound:', error);
    }
  }

  // Play spinner sound (once, not looping)
  static async playSpinnerSound(): Promise<void> {
    // Stop any currently playing spinner sound
    this.stopSpinnerSound();

    try {
      const audioBuffer = await this.loadAudio('/gifsAndSounds/Spinner%20work.mp3');
      const audioContext = this.getAudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = false; // Play once, no loop
      source.connect(audioContext.destination);
      source.start(0);

      // Store reference to stop it later if needed
      this.currentSpinnerSource = source;

      // Auto-cleanup when sound ends
      source.onended = () => {
        this.currentSpinnerSource = null;
      };
    } catch (error) {
      console.error('Failed to play spinner sound:', error);
    }
  }

  // Stop spinner sound
  static stopSpinnerSound(): void {
    if (this.currentSpinnerSource) {
      try {
        this.currentSpinnerSource.stop();
        this.currentSpinnerSource.disconnect();
      } catch (error) {
        // Ignore errors if already stopped
      }
      this.currentSpinnerSource = null;
    }
  }

  // Play winner sound
  static async playWinnerSound(): Promise<void> {
    try {
      const audioBuffer = await this.loadAudio('/gifsAndSounds/Winner%202.mp3');
      const audioContext = this.getAudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Failed to play winner sound:', error);
    }
  }
}

// Simple hook for button sounds
export function useButtonSound() {
  return () => {
    SoundManager.playButtonClick();
  };
}
