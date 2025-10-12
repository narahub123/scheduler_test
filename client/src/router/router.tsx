import { createBrowserRouter } from "react-router-dom";
import { LandingPage, LifelogPage, TodoPage } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/todos",
    element: <TodoPage />,
  },
  {
    path: "/lifelogs",
    element: <LifelogPage />,
  },
]);
