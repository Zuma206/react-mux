import { HTMLProps, useCallback, useMemo } from "react";
import { injectParams, Navigation } from "./navigation";
import { useRouter } from "./context";

type Props<Path extends string> = Omit<HTMLProps<HTMLAnchorElement>, "href"> &
  Navigation<Path>;

/**
 * A custom anchor tag that uses the router for client side navigation
 * @param props - Takes normal anchor tag props, with the addition of the props on {@link Navigation}
 * @returns An anchor tag with a onclick handler and a correct href
 */
export function Link<Path extends string>(props: Props<Path>) {
  const { onClick, to, params, ...rest } = props;
  const { navigate } = useRouter();

  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(event);
      if (event.isDefaultPrevented()) return;
      navigate({ to, params: params! });
    },
    [onClick, navigate, to, params]
  );

  const href = useMemo(() => {
    return injectParams({ to, params });
  }, [to, params]);

  return <a href={href} onClick={onClickHandler} {...rest} />;
}
