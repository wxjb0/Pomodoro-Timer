let intervalId: ReturnType<typeof setInterval> | null = null;
let startTime: number = 0;
let duration: number = 0;
let remaining: number = 0;

self.onmessage = (e: MessageEvent) => {
  const { type, timeLeft } = e.data;

  if (type === 'start') {
    if (intervalId) clearInterval(intervalId);

    remaining = timeLeft;
    startTime = Date.now();
    duration = timeLeft * 1000;

    intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const left = Math.max(0, Math.ceil((duration - elapsed) / 1000));

      self.postMessage({ type: 'tick', timeLeft: left });

      if (left <= 0) {
        clearInterval(intervalId!);
        intervalId = null;
        self.postMessage({ type: 'complete' });
      }
    }, 250);
  } else if (type === 'pause') {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    self.postMessage({ type: 'tick', timeLeft: remaining });
  } else if (type === 'stop') {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};
