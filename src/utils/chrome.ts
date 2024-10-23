/* eslint-disable @typescript-eslint/no-explicit-any */
export class ChromeRuntimeProxy {
  sendMessage<M = any, R = any>(message: M): Promise<R> {
    if (!chrome?.runtime) {
      return Promise.resolve() as Promise<R>;
    }
    return chrome?.runtime?.sendMessage(message);
  }
  onMessage = chrome?.runtime?.onMessage;
}

export const isExtensionPopup = () => {
  try {
    return window?.location?.origin?.includes("chrome-extension");
  } catch {
    return false;
  }
};
export const ChromeRuntime = new ChromeRuntimeProxy();
