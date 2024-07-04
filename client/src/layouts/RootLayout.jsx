import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import RightPanel from "../components/common/RightPanel";

const RootLayout = () => {
  return (
    <div className="flex items-start justify-between w-full">
      <Sidebar />
      <Outlet />
      <RightPanel/>
    </div>
  );
};
export default RootLayout;
