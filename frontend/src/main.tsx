import { StrictMode } from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";

import Layout from "./layouts/Layout";
import NoLayout from "./layouts/NoLayout";

// Routes without layout like "Login", "Register", "404"
const NO_LAYOUT_ROUTES = ["Login"];

createInertiaApp({
  resolve: async (name) => {
    const page = await import(`./pages/${name}.tsx`);
    page.default.layout = NO_LAYOUT_ROUTES.includes(name)
      ? (page) => <NoLayout children={page} />
      : (page) => <Layout children={page} />;
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <StrictMode>
        <MantineProvider>
          <App {...props} />
        </MantineProvider>
      </StrictMode>,
    );
  },
});
