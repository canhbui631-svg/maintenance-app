"use client";

import { useEffect, useState } from "react";

type Role = "admin" | "team_lead" | "technician" | "guest";

interface User {
  id: number;
  name: string;
  username: string;
  role: Role;
  createdAt: string;
  areas: { id: number; name: string }[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "technician" as Role,
    areaIds: "" // nhập dạng "1,2"
  });
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.ok) {
        setUsers(data.users);
      } else {
        setMessage(data.message || "Lỗi load users");
      }
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const areaIds =
        form.areaIds.trim().length > 0
          ? form.areaIds
              .split(",")
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => !Number.isNaN(n))
          : [];

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          password: form.password,
          role: form.role,
          areaIds
        })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setMessage(data.message || "Tạo user thất bại");
        return;
      }

      setMessage("Tạo user thành công");
      setForm({
        name: "",
        username: "",
        password: "",
        role: "technician",
        areaIds: ""
      });
      fetchUsers();
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý tài khoản</h1>

      {/* Form tạo user */}
      <h2 style={{ marginTop: 24 }}>Tạo tài khoản mới</h2>
      <form onSubmit={handleCreate} style={{ display: "grid", gap: 8, maxWidth: 400 }}>
        <input
          placeholder="Tên hiển thị"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Username đăng nhập"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
        >
          <option value="admin">Admin</option>
          <option value="team_lead">Đội trưởng</option>
          <option value="technician">Nhân viên</option>
          <option value="guest">Guest</option>
        </select>
        <input
          placeholder="Area IDs (vd: 1,2)"
          value={form.areaIds}
          onChange={(e) => setForm({ ...form, areaIds: e.target.value })}
        />
        <button type="submit">Tạo tài khoản</button>
      </form>

      {message && <p style={{ marginTop: 8 }}>{message}</p>}

      {/* Danh sách user */}
      <h2 style={{ marginTop: 32 }}>Danh sách tài khoản</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : users.length === 0 ? (
        <p>Chưa có user nào.</p>
      ) : (
        <table border={1} cellPadding={6} style={{ marginTop: 8 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Username</th>
              <th>Vai trò</th>
              <th>Địa bàn</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.areas.map((a) => a.name).join(", ")}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
