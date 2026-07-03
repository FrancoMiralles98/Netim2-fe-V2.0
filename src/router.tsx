import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./pages/landing/LandingPage";

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);