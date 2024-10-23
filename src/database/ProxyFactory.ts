import { ChromeRuntime, isExtensionPopup } from "../utils/chrome";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;

class ChromeRuntimeProvider {
  async listen() {
    // Listen for messages from the popup
    ChromeRuntime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === "model_proxy") {
        // action
        const { modelName, method, args } = message.data;
        const model = ProxyFactory.models[modelName];
        (model[method](...args) as Promise<any>).then((response) => {
          sendResponse(response);
        });
      }
      return true;
    });
  }
  send(modelName: string, method: string, args: any[]) {
    return ChromeRuntime.sendMessage({
      action: "model_proxy",
      data: {
        modelName,
        method,
        args,
      },
    });
  }
}

const provider = new ChromeRuntimeProvider();
const shouldProxy = isExtensionPopup();
export class ProxyFactory {
  static models: Record<string, any> = {};
  // proxy support, should in background, all model handler
  static setUpHandler(models: any) {
    ProxyFactory.models = models;
    provider.listen();
  }
  static get<T>(Target: Constructor<T>, modelName: string, ...args: any[]): T {
    const target = new Target(...args);
    // Create a proxy that implements all methods of T
    return new Proxy({} as T, {
      get: (_: any, prop: string | symbol) => {
        const targetValue = target[prop as keyof T];
        if (typeof targetValue === "function") {
          return (...args: any[]) => {
            if (shouldProxy) {
              return provider.send(modelName, prop as string, args);
            }
            return targetValue.apply(target, args);
          };
        } else {
          throw Error("not accept properties in Model");
        }

        return targetValue;
      },
    });
  }
}
