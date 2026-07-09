import { createBrowserRouter } from "react-router";
import { LandingPage } from "../../pages/landing/LandingPage";
import { AppLayout } from "../layouts/AppLayout";
import { CharacterSelection } from "../../pages/characterSelection/CharacterSelection";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthUserSessionLayout } from "../layouts/AuthUserSessionLayout";
import { RouterPaths } from "./router-paths.types";

export const router = createBrowserRouter([
  {
    path: RouterPaths.LANDING_PAG,
    element: <AppLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <LandingPage />
          }
        ]
      },
      {
        element: <AuthUserSessionLayout />,
        children: [
          {
            path: RouterPaths.CHARACTER_SELECTION,
            element: <CharacterSelection />
          }
        ]
      }
    ]
  },
]);