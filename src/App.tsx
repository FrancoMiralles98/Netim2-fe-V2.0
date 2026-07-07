import { RouterProvider } from "react-router";
import { router } from "./app/router/router";

export const App = () => {
  return <RouterProvider router={router} />
};
