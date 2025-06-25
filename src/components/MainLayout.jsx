import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

export default function MainLayout() {
  return (
    <div id="app-container" className="bg-gray-100 min-h-screen flex w-full">
      <Sidebar />
      <div id="main-content" className="flex-1 flex flex-col ml-64">
        {/* <Header /> --> Dihapus */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="p-6 bg-white rounded-xl shadow-sm min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
