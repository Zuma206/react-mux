import { RouteParams, inject } from "regexparam";
import { Route } from "./route";

export type Navigation<Path extends string = string> = {
  to: Route<Path>;
} & (keyof RouteParams<Path> extends never[]
  ? { params?: RouteParams<Path> }
  : { params: RouteParams<Path> });

export function injectParams(navigation: Navigation) {
  return inject(navigation.to.path, navigation.params ?? {});
}
