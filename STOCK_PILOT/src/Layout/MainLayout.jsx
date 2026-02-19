import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0 bg-dark">
            <Sidebar />
          </div>
          <div className="col-md-10 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
