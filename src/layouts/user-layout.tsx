import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

export default function UserLayout() {
  return (
    <>
      <Outlet /> {/* Render child routes */}
      <ToastContainer />
    </>
  )
}