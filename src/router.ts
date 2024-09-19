import { FC } from "react";
import { Layout, Route } from "./route";

export class Router {
  private routes: Route[] = [];

  createRoute<Path extends string>(
    path: Path,
    ViewComponent: FC,
    ...layouts: Layout[]
  ) {
    const route = new Route(this, path, ViewComponent, layouts);
    this.routes.push(route);
    return route;
  }
}
