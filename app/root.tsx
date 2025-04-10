import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";

import "./tailwind.css";

export const meta: MetaFunction = () => {
  return [
    { title: "QuickFind | Discover Products Instantly" },
    { name: "description", content: "Search and discover amazing products from across the web. Fast, intuitive and beautiful product search engine." },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
  { rel: "manifest", href: "/site.webmanifest" },
];

// Add page transitions with Barba.js
function PageTransitions() {
  const location = useLocation();

  useEffect(() => {
    // Dynamic import to avoid server-side execution issues
    const initTransitions = async () => {
      if (typeof window !== "undefined") {
        const { initBarba } = await import("./utils/barbaTransitions");
        try {
          initBarba();
        } catch (e) {
          console.error("Error initializing Barba.js:", e);
        }
      }
    };

    initTransitions();
  }, []);

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full bg-background-light dark:bg-background-dark text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <ThemeProvider>
          <PageTransitions />
          <div data-barba="wrapper">
            <main data-barba="container" data-barba-namespace={useLocation().pathname}>
              {children}
            </main>
          </div>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
