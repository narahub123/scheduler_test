import { createBrowserRouter } from "react-router-dom";
import { LandingPage, TodoPage } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/todos",
    element: <TodoPage />,
  },
]);
