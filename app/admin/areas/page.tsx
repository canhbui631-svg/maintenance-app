// app/admin/areas/page.tsx
"use client";

import { useEffect, useState } from "react";

type Area = {
  id: number;
  name: string;
  roads: string;
  hamlets: string;
};

export default function AdminAreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [name, setName] = useState("");
  const [roads, setRoads] = useState("");
  const [hamlets, setHamlets] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAreas = async () => {
    const res = await fetch("/api/areas");
    const data = await res.json();
    if (data.ok) {
      setAreas(data.areas);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    await fetch("/api/areas", {
      method: "POST",
      body: JSON.stringify({ name, roads, hamlets }),
    });

    setName("");
    setRoads("");
    setHamlets("");
    setLoading(false);
    loadAreas();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xoá khu vực này?")) return;

    const res = await fetch(`/api/areas/${id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      alert("Xoá thất bại: " + (data?.message ?? "Lỗi không xác định"));
      return;
    }

    // Xoá thành công -> load lại danh sách
    loadAreas();
  };

  return (
    <div className="card">
      <h1 className="page-title">Quản lý khu vực</h1>
      <p className="page-desc">
        Khu vực gồm: xã / phường, các tuyến đường chính và các ấp / khu phố.
        Sau này khi nhân viên tạo ticket bảo trì sẽ chọn từ danh sách này, tránh
        ghi sai tên.
      </p>

      {/* Form thêm khu vực */}
      <form
        className="space-y-2"
        style={{ marginBottom: 16 }}
        onSubmit={handleAdd}
      >
        <label className="label">Tên khu vực (xã / phường)</label>
        <input
          className="input"
          placeholder="VD: Xã Long Hoa, Phường 1..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="label">Tuyến đường chính</label>
        <input
          className="input"
          placeholder="VD: DT785, QL22B, Đường ven sông..."
          value={roads}
          onChange={(e) => setRoads(e.target.value)}
        />

        <label className="label">Ấp / khu phố</label>
        <input
          className="input"
          placeholder="VD: Ấp Long Chí, Ấp Long Khánh, Khu phố 1..."
          value={hamlets}
          onChange={(e) => setHamlets(e.target.value)}
        />

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "Thêm khu vực"}
        </button>
      </form>

      {/* Bảng danh sách khu vực */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Khu vực</th>
              <th>Tuyến đường</th>
              <th>Ấp / khu phố</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {areas.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>
                  Chưa có khu vực nào. Hãy thêm khu vực mới phía trên.
                </td>
              </tr>
            )}

            {areas.map((area) => (
              <tr key={area.id}>
                <td>{area.name}</td>
                <td>{area.roads}</td>
                <td>{area.hamlets}</td>
                <td>
                  {/* Nếu sau này làm chức năng sửa thì thêm nút ở đây */}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleDelete(area.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
