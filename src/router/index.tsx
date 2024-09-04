import React, { Suspense } from "react";
import { Spin } from "antd";

// Lazy yuklangan komponentlar
const Layout = React.lazy(() => import("../layout/layout"));
const Dashboard = React.lazy(() => import("../pages/dashboard/Dashboard"));
const Products = React.lazy(() => import("../pages/products/Products"));
const Users = React.lazy(() => import("../pages/users/Users"));
const Profile = React.lazy(() => import("../pages/profile/Profile"));
const NotFound = React.lazy(() => import("../pages/not-found"));

// Router konfiguratsiyasi
import { createBrowserRouter } from "react-router-dom";
import { paths } from "./paths";

export const routes = createBrowserRouter([
  {
    path: paths.HOME,
    element: (
      <Suspense fallback={<Spin fullscreen />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Spin fullscreen />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: paths.PRODUCTS,
        element: (
          <Suspense fallback={<Spin fullscreen />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: paths.USERS,
        element: (
          <Suspense fallback={<Spin fullscreen />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: paths.PROFILE,
        element: (
          <Suspense fallback={<Spin fullscreen />}>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: paths.NOT_FOUND,
    element: (
      <Suspense fallback={<Spin fullscreen />}>
        <NotFound />
      </Suspense>
    ),
  },
]);
