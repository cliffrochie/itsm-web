import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../auth-guard";
import { useAuthStore } from "@/stores/authStore";

describe("ProtectedRoute Guard", () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: true,
    });
  });

  it("redirects unauthenticated users to /auth/login", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/auth/login" element={<div>Login Page</div>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <div>Admin Secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Secret")).not.toBeInTheDocument();
  });

  it("redirects authenticated users without required role to /unauthorized", () => {
    useAuthStore.setState({
      token: "valid-token",
      user: {
        id: 1,
        username: "clientuser",
        email: "client@test.com",
        firstName: "Client",
        lastName: "User",
        role: "user",
      },
      isAuthenticated: true,
      hasHydrated: true,
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/unauthorized" element={<div>Access Denied</div>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <div>Admin Secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.queryByText("Admin Secret")).not.toBeInTheDocument();
  });

  it("renders protected content when user has the allowed role", () => {
    useAuthStore.setState({
      token: "valid-token",
      user: {
        id: 2,
        username: "adminuser",
        email: "admin@test.com",
        firstName: "Admin",
        lastName: "System",
        role: "admin",
      },
      isAuthenticated: true,
      hasHydrated: true,
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <div>Admin Secret Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Secret Dashboard")).toBeInTheDocument();
  });

  it("renders loading state when auth store has not hydrated", () => {
    useAuthStore.setState({
      hasHydrated: false,
    });

    const { container } = render(
      <MemoryRouter initialEntries={["/admin"]}>
        <ProtectedRoute allowedRoles={["admin"]}>
          <div>Admin Secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Admin Secret")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
