import { createBrowserRouter } from "react-router";
import Home from "./Home";
import Code from "./Code";
import Page from "./Page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      {
        path: "page",
        Component: Page,
      },
      {
        path: "code",
        Component: Code,
      }
    ]
  }
], {
  basename: "/fire-doc/" // 需与vite.config.ts中的base保持一致
});

export default  router;