import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "../../pages/landing/LandingPage";
import { AppLayout } from "../layouts/AppLayout";
import { CharacterSelection } from "../../pages/characterSelection/CharacterSelection";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        Component: LandingPage
      },
      {
        path: 'character-selection',
        element: <CharacterSelection />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ]
  },
]);