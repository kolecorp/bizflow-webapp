import { createApi } from "./factory";

export const api = createApi();
export type Api = ReturnType<typeof createApi>;
