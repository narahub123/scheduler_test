import { createBrowserRouter } from "react-router-dom";
import { LandingPage, LifelogPage, NotePage, TodoPage } from "../pages";
import { RapidLogging } from "../pages/RapidLogging/RapidLogging";

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
  {
    path: "/notes",
    element: <NotePage />,
  },
  {
    path: "/rapid-logging",
    element: <RapidLogging />,
  },
]);
