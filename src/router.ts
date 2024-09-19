import { FC } from "react";
import { Layout, Route } from "./route";

/**
 * A collection of routes that make up an application
 */
export class Router {
  private routes: Route[] = [];

  /**
   * Create a route and add it to the router
   * @param path The path to the route
   * @param ViewComponent The component to render on the route
   * @param layouts Any layout components to wrap the view component
   * @returns The created route instance
   */
  createRoute<Path extends string>(
    path: Path,
    ViewComponent: FC,
    ...layouts: Layout[]
  ) {
    const route = new Route(this, path, ViewComponent, layouts);
    this.routes.push(route);
    return route;
  }

  /**
   * Calls a callback on every element, and returns an array of transformed routes.
   * Useful in getStaticParams/getStaticRoutes function to pre-render routes
   * @param callback
   * @returns Tranformed array of routes
   */
  map(callback: (route: Route, index: number) => unknown) {
    return this.routes.map(callback);
  }
}
