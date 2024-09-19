import { FC, PropsWithChildren, ReactNode } from "react";
import { Router } from "./router";

export type Layout = FC<PropsWithChildren<{}>>;

export class Route<Path extends string = string> {
  public readonly children: ReactNode;

  constructor(
    private readonly router: Router,
    public readonly path: Path,
    ViewComponent: FC,
    private readonly layouts: Layout[]
  ) {
    this.children = layouts.reduce(
      (view, Layout) => <Layout>{view}</Layout>,
      <ViewComponent />
    );
  }

  extendRoute<PathExtension extends string>(
    pathExtension: PathExtension,
    ViewComponent: FC,
    ...layouts: Layout[]
  ) {
    return this.router.createRoute(
      `${this.path}${pathExtension}`,
      ViewComponent,
      ...layouts
    );
  }
}
