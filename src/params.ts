import { useMemo } from "react";
import { useRouter } from "./context";
import { Route } from "./route";
import { RouteParams } from "regexparam";

/**
 * Parses params for a given route from the current path.
 * Please only use with SSR, as it assumes the correct path from the start
 * @param route The route to use to parse params
 * @returns The params from the path
 */
export function useSSRParams<Path extends string>(route: Route<Path>) {
  const { path } = useRouter();
  return useMemo(() => route.params(path), [path, route]);
}

/**
 * Parses params for a given route once the client is loaded and hydrated.
 * Safe to use with SPA and SSG apps
 * @param route The route to use to parse params
 * @returns The params from the path after hydration, else an empty object
 */
export function useParams<Path extends string>(
  route: Route<Path>
): Partial<RouteParams<Path>> {
  const params = useSSRParams(route);
  const { path } = useRouter();
  return typeof window !== "undefined" && location.pathname === path
    ? params
    : {};
}
