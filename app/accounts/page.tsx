// app/accounts/page.tsx
"use client";

import { useState } from "react";

type AccountRole = "admin" | "staff";

type Account = {
  id: number;
  username: string;
  fullName: string;
  role: AccountRole;
  active: boolean;
};

const initialAccounts: Account[] = [
  { id: 1, username: "admin", fullName: "Quản trị hệ thống", role: "admin", active: true },
  { id: 2, username: "nv.longhoa", fullName: "Nhân viên Long Hoa", role: "staff", active: true },
  { id: 3, username: "nv.hoathanh", fullName: "Nhân viên Hoà Thành", role: "staff", active: false },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Account, "id" | "active">>({
    username: "",
    fullName: "",
    role: "staff",
  });

  const isEditing = editingId !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) return;

    if (isEditing) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingId ? { ...acc, ...form } : acc
        )
      );
      setEditingId(null);
    } else {
      const newAccount: Account = {
        id: accounts.length ? Math.max(...accounts.map((a) => a.id)) + 1 : 1,
        username: form.username,
        fullName: form.fullName,
        role: form.role,
        active: true,
      };
      setAccounts((prev) => [...prev, newAccount]);
    }

    setForm({ username: "", fullName: "", role: "staff" });
  };

  const handleEdit = (acc: Account) => {
    setEditingId(acc.id);
    setForm({
      username: acc.username,
      fullName: acc.fullName,
      role: acc.role,
    });
  };

  const handleToggleActive = (id: number) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, active: !acc.active } : acc
      )
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ username: "", fullName: "", role: "staff" });
  };

  return (
    <div className="card">
      <h1 className="page-title">Quản lý tài khoản đăng nhập</h1>
      <p className="page-desc">
        Chỉ admin mới được tạo tài khoản, phân quyền nhân viên bảo trì. Sau này
        kết nối với API đăng nhập thực tế.
      </p>

      <form onSubmit={handleSubmit} className="form-grid form-grid-2">
        <div>
          <label className="label">Tên đăng nhập</label>
          <input
            className="input"
            value={form.username}
            onChange={(e) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
            placeholder="VD: nv.longhoa"
          />
        </div>
        <div>
          <label className="label">Họ tên</label>
          <input
            className="input"
            value={form.fullName}
            onChange={(e) =>
              setForm((f) => ({ ...f, fullName: e.target.value }))
            }
            placeholder="VD: Nguyễn Văn A"
          />
        </div>
        <div>
          <label className="label">Vai trò</label>
          <select
            className="select"
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as AccountRole }))
            }
          >
            <option value="staff">Nhân viên bảo trì</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ alignSelf: "flex-end" }}>
          <button type="submit" className="btn-primary">
            {isEditing ? "Lưu chỉnh sửa" : "Tạo tài khoản"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn-secondary"
              style={{ marginLeft: 8 }}
              onClick={handleCancelEdit}
            >
              Huỷ
            </button>
          )}
        </div>
      </form>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Tên đăng nhập</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th style={{ width: 140 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.username}</td>
                <td>{acc.fullName}</td>
                <td>
                  <span className="badge">
                    {acc.role === "admin" ? "Admin" : "Nhân viên"}
                  </span>
                </td>
                <td>
                  <span className="badge">
                    {acc.active ? "Đang hoạt động" : "Đã khoá"}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-xs"
                      onClick={() => handleEdit(acc)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn-xs"
                      onClick={() => handleToggleActive(acc.id)}
                    >
                      {acc.active ? "Khoá" : "Mở khoá"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={5}>Chưa có tài khoản nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="page-desc" style={{ marginTop: 8 }}>
        Khi làm backend thật, chỉ cần map các thao tác này sang API tạo user /
        update / khoá user.
      </p>
    </div>
  );
}
