"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }

      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem("maintenance-user", JSON.stringify(data.user));

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ maxWidth: 420, marginTop: 40 }}>
      <div className="card">
        <h1 className="page-title text-center">Đăng nhập</h1>
        <p className="page-desc text-center">
          Hệ thống quản lý bảo trì chiếu sáng LQV
        </p>

        <form className="form-grid" onSubmit={handleLogin}>
          <div>
            <div className="label">Tài khoản</div>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
            />
          </div>

          <div>
            <div className="label">Mật khẩu</div>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />
          </div>

          <label
            style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember((v) => !v)}
            />
            Ghi nhớ đăng nhập
          </label>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
