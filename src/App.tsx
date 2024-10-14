import { RouterProvider, createMemoryRouter } from "react-router-dom";
import "./App.css";
import AppProvider from "./AppProvider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Settings from "./pages/Settings";
import CommonWordPage from "./pages/CommonWordPage";
import PhrasePage from "./pages/PhrasePage";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <HomePage />,
//   },
//   {
//     path: "login",
//     element: <LoginPage />,
//   },
// ]);

const router = createMemoryRouter([
  {
    path: "/",
    element: <AppProvider />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/popular",
        element: <CommonWordPage />,
      },
      {
        path: "/phrase",
        element: <PhrasePage />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
]);
// function App() { // start bilding your popup app here
//   return (
//     <div className="app-container">
//       <h1 className="text-3xl text-center font-bold underline">
//         Hello world!
//       </h1>
//     </div>
//   )
// }

const App = () => {
  const isWeb = import.meta.env.VITE_MODE === "development";
  console.log({ isWeb });
  return (
    <div className={`app-container bg-white ${isWeb ? "web-container" : ""}`}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
