import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <Outlet />
    </div>
  );
};
export default AuthLayout;
