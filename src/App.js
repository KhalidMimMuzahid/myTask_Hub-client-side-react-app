import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { useContext } from "react";
import { MyContext } from "./MyProvider/MyProvider";
import Loader from "./Components/Loader/Loader";

function App() {
  const { isLoading } = useContext(MyContext);
  console.log("isLoading ,", isLoading);
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader type=""></Loader>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-screen-2xl">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
