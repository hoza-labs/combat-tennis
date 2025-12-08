// fxplayer.js: uses the Web Audio API to play sound effects
// supports panning the sound left or right and preloading sounds

class FxPlayer {

  constructor(basePath = "") {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.buffers = {};
    this.basePath = basePath;
  }

  // preload a sound from a URL
  async preload(url) {
    logmsg(`Preloading sound: ${this.basePath + url}`);
    const response = await fetch(this.basePath + url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.buffers[url] = audioBuffer;
  }

  // preload an array of sound URLs
  async preloadAll(urls) {
    const promises = urls.map(url => this.preload(url));
    await Promise.all(promises);
  }

  // play a sound with optional panning (-100 left to 100 right)
  play(url, pan = 0) {
    const buffer = this.buffers[url];
    if (!buffer) {
      console.warn(`Sound not preloaded: ${url}`);
      return;
    }
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    const panner = this.audioContext.createStereoPanner();
    panner.pan.value = pan / 100;

    source.connect(panner);
    panner.connect(this.audioContext.destination);

    source.start(0);
  }

  // play a sound and return a promise that resolves when the sound ends.
  // Caller can use `await playAsync(...)` to logically block until the
  // sound finishes; or caller can use `playAsync(...).then(...) to
  // register a callback function that executes asynchronously after the
  // sound finishes.
  async playAsync(url, pan = 0) {
    return new Promise((resolve) => {
      const buffer = this.buffers[url];
      if (!buffer) {
        console.warn(`Sound not preloaded: ${url}`);
        resolve();
        return;
      }
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      const panner = this.audioContext.createStereoPanner();
      panner.pan.value = pan / 100;
      source.connect(panner);
      panner.connect(this.audioContext.destination);
      source.onended = resolve;
      source.start(0);
    });
  }
}
