import { createBrowserRouter } from "react-router";
import Home from "./Home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
], {
  basename: "/fire-doc/" // 需与vite.config.ts中的base保持一致
});

export default  router;