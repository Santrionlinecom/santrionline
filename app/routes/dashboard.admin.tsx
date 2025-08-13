import { Outlet } from "@remix-run/react";

export default function AdminLayout() {
  return (
    <div>
      <h2>Admin Panel Layout</h2>
      <Outlet />
    </div>
  );
}