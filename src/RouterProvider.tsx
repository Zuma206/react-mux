import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Router } from "./router";
import { Context } from "./context";

type Props = {
  /**
   * The router to provide
   */
  router: Router;
  /**
   * The initial path to render
   */
  path: string;
};

/**
 * Provide and render a router
 * @param props - {@link Props}
 * @returns The current route view
 */
export function RouterProvider(props: Props) {
  const [path, setPath] = useState(props.path);
  useEffect(() => setPath(location.pathname), [setPath]);

  const [hasNavigated, setHasNavigated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const changePath = useCallback(
    (nextPath: string) => {
      startTransition(() => {
        setHasNavigated(true);
        setPath(nextPath);
      });
    },
    [setHasNavigated, setPath]
  );

  useEffect(() => {
    function onpopstate() {
      changePath(location.pathname);
    }
    addEventListener("popstate", onpopstate);
    return () => removeEventListener("popstate", onpopstate);
  }, [changePath]);

  const route = useMemo(() => props.router.resolve(path), [props.router, path]);
  return (
    <Context.Provider
      value={{ isPending, router: props.router, hasNavigated, path }}
    >
      {route ? route.children : <>Not found</>}
    </Context.Provider>
  );
}
