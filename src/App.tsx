import { RouterProvider } from "react-router";
import { router } from "./router";
import { ModalProvider } from "./shared/modal/ModalProvider";

export const App = () => {
  return <main className="bg-black">
    <ModalProvider >
      <RouterProvider router={router} />;
    </ModalProvider>

  </main>
};
