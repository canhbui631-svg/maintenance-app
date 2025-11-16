// app/AppHeader.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Role, hasPermission } from "./auth/permissions";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem("maintenance-user");
    if (raw) {
      setUser(JSON.parse(raw));
    } else {
      // DEMO: tạm tạo 1 user đội trưởng để test
      const demoUser: User = {
        id: 1,
        name: "Đội trưởng Long Hoa",
        username: "leader.longhoa",
        role: "leader",
      };
      window.localStorage.setItem("maintenance-user", JSON.stringify(demoUser));
      setUser(demoUser);
    }
  }, []);

  const isLoginPage = pathname?.startsWith("/login");
  if (isLoginPage) return null;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("maintenance-user");
    }
    setUser(null);
    router.push("/login");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="top-bar">
      <div className="top-bar-inner">
        <div>
          <div className="app-title">PHẦN MỀM BẢO TRÌ LQV</div>
          <div className="app-subtitle">
            Quản lý bảo trì chiếu sáng & nhân viên hiện trường
          </div>
        </div>

        <nav className="nav-links">
          {hasPermission(user, "viewDashboard") && (
            <Link
              href="/"
              className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}
            >
              Dashboard
            </Link>
          )}

          {/* Nhân viên + đội trưởng + admin đều dùng /maintenance */}
          {hasPermission(user, "createTicket") && (
            <Link
              href="/maintenance"
              className={`nav-link ${
                isActive("/maintenance") ? "nav-link-active" : ""
              }`}
            >
              Sự cố
            </Link>
          )}

          {/* Địa bàn: admin + đội trưởng */}
          {hasPermission(user, "manageAreas") && (
            <Link
              href="/admin/areas"
              className={`nav-link ${
                isActive("/admin/areas") ? "nav-link-active" : ""
              }`}
            >
              Địa bàn
            </Link>
          )}

          {/* Vật tư: admin + đội trưởng */}
          {hasPermission(user, "manageMaterials") && (
            <Link
              href="/admin/materials"
              className={`nav-link ${
                isActive("/admin/materials") ? "nav-link-active" : ""
              }`}
            >
              Vật tư
            </Link>
          )}

          {/* Tài khoản: chỉ admin */}
          {hasPermission(user, "manageAccounts") && (
            <Link
              href="/admin/accounts"
              className={`nav-link ${
                isActive("/admin/accounts") ? "nav-link-active" : ""
              }`}
            >
              Tài khoản
            </Link>
          )}

          {user && (
            <button className="nav-link nav-link-ghost" onClick={handleLogout}>
              {user.name} · Thoát
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
