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

export default function AccountsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "technician" as Role,
    areaIds: "",
  });

  // Lấy danh sách user
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.ok) {
        setUsers(data.users);
      } else {
        setMessage(data.message || "Không tải được danh sách người dùng");
      }
    } catch (err: any) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Submit tạo user
  const handleCreate = async (e: any) => {
    e.preventDefault();
    setMessage("");

    try {
      const areaIds =
        form.areaIds.trim().length > 0
          ? form.areaIds
              .split(",")
              .map((v) => parseInt(v.trim(), 10))
              .filter((n) => !isNaN(n))
          : [];

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          password: form.password,
          role: form.role,
          areaIds,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        setMessage(data.message || "Tạo người dùng thất bại");
        return;
      }

      setMessage("Tạo tài khoản thành công!");
      setForm({
        name: "",
        username: "",
        password: "",
        role: "technician",
        areaIds: "",
      });

      loadUsers();
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">Quản lý tài khoản</h1>
      <p className="page-desc">Tạo tài khoản nhân viên, đội trưởng, admin và phân địa bàn.</p>

      {/* Form tạo user */}
      <form onSubmit={handleCreate} className="form-grid" style={{ marginBottom: 24 }}>
        <div>
          <div className="label">Tên hiển thị</div>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <div className="label">Tên đăng nhập</div>
          <input
            className="input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>

        <div>
          <div className="label">Mật khẩu</div>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div>
          <div className="label">Vai trò</div>
          <select
            className="select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
          >
            <option value="admin">Admin</option>
            <option value="team_lead">Đội trưởng</option>
            <option value="technician">Nhân viên</option>
            <option value="guest">Khách</option>
          </select>
        </div>

        <div>
          <div className="label">ID địa bàn (vd: 1,2)</div>
          <input
            className="input"
            value={form.areaIds}
            onChange={(e) => setForm({ ...form, areaIds: e.target.value })}
          />
        </div>

        <button className="btn-primary" type="submit">
          Tạo tài khoản
        </button>
      </form>

      {message && <p>{message}</p>}

      {/* Bảng user */}
      <h2 className="section-title">Danh sách tài khoản</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
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
                  <td>
                    <span className="badge">{u.role}</span>
                  </td>
                  <td>{u.areas.map((a) => a.name).join(", ")}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
