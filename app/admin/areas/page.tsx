// app/admin/areas/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";   // ⭐ THÊM CHỖ NÀY

type Area = {
  id: number;
  name: string; 
  routes: string; 
  hamlets: string; 
};

const initialAreas: Area[] = [
  {
    id: 1,
    name: "Xã Long Hoa",
    routes: "DT785, Đường ven sông",
    hamlets: "Ấp Long Chí, Ấp Long Khánh",
  },
  {
    id: 2,
    name: "Thị xã Hoà Thành",
    routes: "QL22B, Đường CMT8",
    hamlets: "Khu phố 1, Khu phố 2",
  },
];

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Area, "id">>({
    name: "",
    routes: "",
    hamlets: "",
  });

  const isEditing = editingId !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (isEditing) {
      setAreas((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form } : a))
      );
      setEditingId(null);
    } else {
      const newArea: Area = {
        id: areas.length ? Math.max(...areas.map((a) => a.id)) + 1 : 1,
        ...form,
      };
      setAreas((prev) => [...prev, newArea]);
    }

    setForm({ name: "", routes: "", hamlets: "" });
  };

  const handleEdit = (area: Area) => {
    setEditingId(area.id);
    setForm({
      name: area.name,
      routes: area.routes,
      hamlets: area.hamlets,
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Xoá địa bàn này?")) return;
    setAreas((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: "", routes: "", hamlets: "" });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", routes: "", hamlets: "" });
  };

  return (
    <div className="card">
      <h1 className="page-title">Quản lý địa bàn</h1>
      <p className="page-desc">
        Địa bàn gồm: xã / phường, các tuyến đường chính và các ấp / khu phố.
        Sau này khi nhân viên tạo ticket bảo trì sẽ chọn từ danh sách này.
      </p>

      <form onSubmit={handleSubmit} className="form-grid form-grid-2">
        <div>
          <label className="label">Tên địa bàn (xã/phường)</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="VD: Xã Long Hoa"
          />
        </div>

        <div>
          <label className="label">Tuyến đường</label>
          <input
            className="input"
            value={form.routes}
            onChange={(e) => setForm((f) => ({ ...f, routes: e.target.value }))}
            placeholder="VD: DT785, QL22B,…"
          />
        </div>

        <div>
          <label className="label">Ấp / khu phố</label>
          <input
            className="input"
            value={form.hamlets}
            onChange={(e) => setForm((f) => ({ ...f, hamlets: e.target.value }))}
            placeholder="VD: Ấp Long Chí, Ấp Long Khánh,…"
          />
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <button type="submit" className="btn-primary">
            {isEditing ? "Lưu chỉnh sửa" : "Thêm địa bàn"}
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
              <th>Địa bàn</th>
              <th>Tuyến đường</th>
              <th>Ấp / khu phố</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                {/* ⭐ ĐÃ CHỈNH SỬA CHỖ NÀY */}
                <td>
                  <Link href={`/admin/areas/${area.id}`} className="table-link">
                    {area.name}
                  </Link>
                </td>

                <td>{area.routes}</td>
                <td>{area.hamlets}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-xs"
                      onClick={() => handleEdit(area)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn-xs"
                      onClick={() => handleDelete(area.id)}
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {areas.length === 0 && (
              <tr>
                <td colSpan={4}>Chưa có địa bàn nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="page-desc" style={{ marginTop: 8 }}>
        Nhấp vào tên địa bàn để xem thống kê chi tiết của khu vực.
      </p>
    </div>
  );
}
