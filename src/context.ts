import { createContext, useContext } from "react";
import { Router } from "./router";

type Context = {
  /**
   * True if a navigation is currently or has previously been made
   */
  hasNavigated: boolean;
  /**
   * True if a navigation transition is currently pending
   */
  isPending: boolean;
  /**
   * The router currently being used for rendering
   */
  router: Router;
  /**
   * The path currently being rendered
   */
  path: string;
};

export const Context = createContext<Context | null>(null);

/**
 * Get access to the current router and it's context
 * @returns - {@link Context}
 */
export function useRouter() {
  const context = useContext(Context);
  if (!context)
    throw new Error("Cannot access router context as it was not provided");
  return context;
}
