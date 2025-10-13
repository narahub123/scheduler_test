import { createBrowserRouter } from "react-router-dom";
import {
  LandingPage,
  LifelogPage,
  NotePage,
  RapidLoggingPage,
  TodoPage,
} from "../pages";

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
    element: <RapidLoggingPage />,
  },
]);
