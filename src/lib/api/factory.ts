import { AppsScriptProvider } from "./providers/apps-script/AppsScriptProvider";
import { FirebaseProvider } from "./providers/firebase/FirebaseProvider";
import { MockProvider } from "./providers/mock/MockProvider";
import { RestApiProvider } from "./providers/rest/RestApiProvider";

const provider = import.meta.env.VITE_API_PROVIDER ?? "mock";

export function createApi() {
  switch (provider) {
    case "apps-script":
      return new AppsScriptProvider();

    case "firebase":
      return new FirebaseProvider();

    case "rest":
      return new RestApiProvider();

    case "mock":
      return new MockProvider();

    default:
      throw new Error(`Unknown API provider: ${provider}`);
  }
}
