import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main/Main";
import AddTask from "../Pages/AddTask/AddTask";
import CompletedTask from "../Pages/CompletedTask/CompletedTask";
import Home from "../Pages/Home/Home";
import MyTask from "../Pages/MyTask/MyTask";
import SignIn from "../Pages/SignIn/SignIn";
import SignUp from "../Pages/SignUp/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/addtask", element: <AddTask /> },
      { path: "/mytask", element: <MyTask /> },
      { path: "/completedtask", element: <CompletedTask /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
    ],
  },
]);
