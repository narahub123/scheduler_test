import { createBrowserRouter } from "react-router-dom";
import { TodoPage } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <TodoPage />,
  },
]);
