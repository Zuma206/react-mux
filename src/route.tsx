import { FC, PropsWithChildren, ReactNode } from "react";
import { parse, RouteParams } from "regexparam";
import { Router } from "./router";

export type Layout = FC<PropsWithChildren<{}>>;

/**
 * A component and the path it should be rendered on
 */
export class Route<Path extends string = string> {
  /**
   * A react node that should be rendered on the route
   */
  public readonly children: ReactNode;
  private readonly pattern: RegExp;
  private readonly keys: string[];

  /**
   * @param router The router the route is assigned to
   * @param path The path to the route
   * @param ViewComponent The component to render on the route
   * @param layouts Any layout components to wrap the view component
   */
  constructor(
    private readonly router: Router,
    public readonly path: Path,
    ViewComponent: FC,
    private readonly layouts: Layout[]
  ) {
    const { pattern, keys } = parse(path);
    this.pattern = pattern;
    this.keys = keys;
    this.children = layouts.reduce(
      (view, Layout) => <Layout>{view}</Layout>,
      <ViewComponent />
    );
  }

  /**
   * Create a route that inherits this route's path and layouts
   * @param pathExtension The extension to the inherited path
   * @param ViewComponent The component to render on the route
   * @param additionalLayouts Any layout components to wrap the view component
   * @returns The created route instance
   */
  extendRoute<PathExtension extends string>(
    pathExtension: PathExtension,
    ViewComponent: FC,
    ...additionalLayouts: Layout[]
  ) {
    return this.router.createRoute(
      `${this.path}${pathExtension}`,
      ViewComponent,
      ...[...this.layouts, ...additionalLayouts]
    );
  }

  /**
   * Test if a given path matches this route
   * @param path The path to test
   * @returns True if the path matches, else false
   */
  test(path: string) {
    return this.pattern.test(path);
  }

  params(path: string): RouteParams<Path> {
    const result = this.pattern.exec(path);
    if (result === null)
      throw new Error("Cannot get params from a path that does not match");
    if (this.keys.length != result.length - 1)
      throw new Error("Not enough params in path");
    const params: any = {};
    for (let i = 0; i < this.keys.length; i++) {
      params[this.keys[i]] = result[i + 1];
    }
    return params;
  }
}
