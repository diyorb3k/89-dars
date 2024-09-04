import { RouterProvider } from "react-router-dom";
import { routes } from "..";

const Root = () => {
  return <RouterProvider router={routes} />;
};

export default Root;
