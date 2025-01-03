import { Outlet } from 'react-router-dom';
import SidebarLayout from "@/layouts/sidebar-layout"
import { ToastContainer, Slide } from 'react-toastify';



export default function AdminLayout() {
  return (
    <>
      <SidebarLayout>
        <Outlet /> {/* Render child routes */}
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
      </SidebarLayout>
    </>
  )
}
