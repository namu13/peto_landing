import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="w-screen h-full box-border py-10 lg:p-10">
      <Outlet />
    </main>
  );
};

export default Layout;
