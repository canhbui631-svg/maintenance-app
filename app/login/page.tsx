// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true); // ⬅ trạng thái ghi nhớ

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: sau này check username/password bằng API
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    // Nếu tick "Ghi nhớ đăng nhập" → lưu cookie 30 ngày
    // Không tick → cookie phiên (tắt trình duyệt sẽ mất)
    if (remember) {
      const maxAge = 60 * 60 * 24 * 30; // 30 ngày
      document.cookie = `auth_user=${encodeURIComponent(
        username
      )}; path=/; max-age=${maxAge}`;
    } else {
      document.cookie = `auth_user=${encodeURIComponent(
        username
      )}; path=/;`;
    }

    router.push("/");
  };

  return (
    <div className="w-full max-w-sm mx-auto card">
      <h1 className="page-title text-center">Đăng nhập</h1>
      <p className="page-desc text-center">
        Phần mềm bảo trì chiếu sáng LQV
      </p>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="label">Tài khoản</label>
          <input
            className="input"
            placeholder="Nhập tên đăng nhập hoặc email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Mật khẩu</label>
          <input
            type="password"
            className="input"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* GHI NHỚ ĐĂNG NHẬP */}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember((v) => !v)}
          />
          Ghi nhớ đăng nhập
        </label>

        <button type="submit" className="btn-primary w-full">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
