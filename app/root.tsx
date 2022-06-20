import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./styles/app.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "The world after IE left",
  viewport: "width=device-width,initial-scale=1",
  "og:title": "The world after IE left",
  "og:url": "https://the-world-after-ie-left.vercel.app/",
  "og:image": "https://the-world-after-ie-left.vercel.app/images/icon.png",
  "og:type": "website",
  "twitter:card": "summary",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
