import { createBrowserRouter } from "react-router-dom";
import {
  FutureLogPage,
  LandingPage,
  LifelogPage,
  MonthlyLogPage,
  NotePage,
  RapidLoggingPage,
  TodoPage,
} from "../pages";
import { MonthlyCalendar, MonthlyTodos } from "../ui";

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
  {
    path: "/monthly-log",
    element: <MonthlyLogPage />,
    children: [
      {
        index: true,
        element: <MonthlyCalendar />,
      },
      {
        path: "to-dos",
        element: <MonthlyTodos />,
      },
    ],
  },
  {
    path: "future-log",
    element: <FutureLogPage />,
  },
]);
