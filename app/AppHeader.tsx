// app/AppHeader.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, hasPermission } from "./auth/permissions";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Đọc user đã login từ storage (do trang /login lưu vào)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ưu tiên sessionStorage (login không ghi nhớ), sau đó localStorage (ghi nhớ)
    const rawSession = window.sessionStorage.getItem("maintenance-user");
    const rawLocal = window.localStorage.getItem("maintenance-user");
    const raw = rawSession ?? rawLocal;

    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        window.sessionStorage.removeItem("maintenance-user");
        window.localStorage.removeItem("maintenance-user");
      }
    }
  }, []);

  const isLoginPage = pathname?.startsWith("/login");
  if (isLoginPage) return null;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("maintenance-user");
      window.sessionStorage.removeItem("maintenance-user");
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
            Quản lý bảo trì chiếu sáng &amp; nhân viên hiện trường
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
