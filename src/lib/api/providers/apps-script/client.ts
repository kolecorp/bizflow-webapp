export function callAppsScript<T>(
  functionName: string,
  ...args: unknown[]
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (typeof google === "undefined" || !google.script || !google.script.run) {
      reject(new Error("Apps Script environment is not available."));
      return;
    }

    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [functionName](...args);
  });
}
