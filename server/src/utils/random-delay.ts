export function randomDelay(maxDelay = 1000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 4 * maxDelay);
  });
}
