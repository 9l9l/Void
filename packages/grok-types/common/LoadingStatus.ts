/** Generic async loading status used across multiple Zustand stores. */
export type LoadingStatus = "initial" | "loading" | "ready" | "error" | (string & {});
