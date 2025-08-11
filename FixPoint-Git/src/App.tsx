import HomePage from "./pages/home";
import UsersPage from "./pages/users";
import PruebasPage from "./pages/pruebas";
import LoginPage from "./pages/login/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/home",
          element: <HomePage />,
        },
        {
          path: "/users",
          element: <UsersPage />,
        },
        {
          path: "/pruebas",
          element: <PruebasPage />,
        },
        {
          path: "/",
          element: <LoginPage />,
        },
      ])}
    />
  );
}

export default App;
