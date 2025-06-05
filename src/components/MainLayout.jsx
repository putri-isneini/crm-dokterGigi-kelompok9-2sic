import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar.jsx";
import Header from "./header.jsx";


export default function MainLayout() {
  return (
    <div id="app-container" className="bg-gray-100 min-h-screen flex w-full overflow-hidden">
      <Sidebar />
      <div id="main-content" className="flex-1 flex flex-col">
        <Header />
       <main className="ml-35 flex-1 min-h-screen overflow-y-auto p-6 bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

