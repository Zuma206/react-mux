# React Mux

React Mux is the first transition based, suspense-compatible, typesafe router for react.

## Get Started

- `npm install react-mux`

- Setup your router

```ts
import { Router } from "react-mux";
import { Root } from "./Root";
import { lazy } from "react";

// Fully compatible with lazy-loading
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));
const Profile = lazy(() => import("./routes/Profile"));

export const router = new Router();

// Export routes so you can link to them in a typesafe manner
// Also allows for easily changing at which path a route lives
// Root wraps the home component as a layout
export const home = router.createRoute("/", Home, Root);
// These routes inherit the path and layout of home
export const about = home.extendRoute("about", About);
// Supports route params
export const profile = home.extendRoute("profile/:id", Profile);
```

- Render your application

```tsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-mux";
import { StrictMode } from "react";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider path={location.pathname} router={router} />
  </StrictMode>
);
```

- Use typesafe links

```tsx
import { profile } from "../router";
import { Link } from "react-mux";

export default function Home() {
  return (
    // Compile-time error if id is not specified
    <Link to={profile} params={{ id: "zuma" }}>
      Zuma's Profile
    </Link>
  );
}
```

- Access typesafe params

```tsx
import { useParams, useClientSideParams } from "react-mux";
import { profile } from "../router";

export default function Profile() {
  // Use this for SSR or SPA apps
  // Immediatly parses the URL, id is typesafe and always a string
  const { id } = useParams(profile);

  // Use this for SSG apps
  // Parses the URL once the app is on the client and hydrated, id is typesafe but is string | undefined
  // This allows you to pre-render dynamic routes, by initially setting all params to undefined
  // Then the params become available once the page has loaded and is hydrated
  const { id } = useClientSideParams(profile);

  return <h1>{id}'s Profile</h1>;
}
```

## Optional SSG

React mux was designed to allow for the pre-rendering of entire static routes, and the shells of dynamic routes. The static pages can then be served by your API server, such as a Go app. It's recommended the SSG is left to a meta framework such as NextJS or Astro.

```tsx
// Here is a generic psuedo-code example that can be applied to any framework
// [...path].tsx
import { RouterProvider } from "react-mux";
import { router } from "./router";

// Meta framework params sometimes come in as props
type Props = {
  params: Record<string, string>;
};

export default function page(props: Props) {
  return <RouterProvider router={router} path={props.params.path} />;
}

// Use the router to generate one of each page
export function getStaticParams() {
  // For dynamic routes, default any params to the value `$paramName`
  // `useClientSideParams` can then be used to grab the actual param value later
  return router.map((route) => route.path.replace(":", "$"));
}
```
