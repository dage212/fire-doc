import { createBrowserRouter } from "react-router";
import Home from "./Home";
// import Code from "./Code";
import Page from "./Page";
// import List from "./List";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      {
        path: "",
        Component: Page,
        index: true,
      },
      {
        path: ":id",
        Component: Page,
      },
      // {
      //   path: "code",
      //   Component: Code,
      // },
      // {
      //   path: "list",
      //   Component: List,
      // }
    ]
  }
], {
  basename: "/fire-doc/" // 需与vite.config.ts中的base保持一致
});

export default  router;