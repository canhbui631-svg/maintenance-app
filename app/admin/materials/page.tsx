// app/admin/materials/page.tsx
"use client";

import {
  useEffect,
  useState,
  useRef,
  FormEvent,
  ChangeEvent,
} from "react";

type Material = {
  id: number;
  code: string | null;
  name: string;
  unit: string;
};

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadMaterials = async () => {
    const res = await fetch("/api/materials");
    const data = await res.json();
    if (data.ok) {
      setMaterials(data.materials);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !unit.trim()) {
      alert("Tên vật tư và đơn vị là bắt buộc.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name, unit }),
    });

    const data = await res.json().catch(() => null);
    setLoading(false);

    if (!res.ok || !data?.ok) {
      // Nếu server báo trùng
      if (res.status === 409 && data?.code === "DUPLICATE_MATERIAL") {
        alert("Không thêm được vì trùng: " + data.message);
      } else {
        alert(
          "Thêm vật tư thất bại: " + (data?.message ?? "Lỗi không xác định")
        );
      }
      return;
    }

    setCode("");
    setName("");
    setUnit("");
    loadMaterials();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xoá vật tư này?")) return;

    const res = await fetch(`/api/materials/${id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      alert("Xoá thất bại: " + (data?.message ?? "Lỗi không xác định"));
      return;
    }

    loadMaterials();
  };

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/materials/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      alert("Import thất bại: " + (data?.message ?? "Lỗi không xác định"));
      e.target.value = "";
      return;
    }

    alert(data.message ?? "Import thành công");
    e.target.value = "";
    loadMaterials();
  };

  const handleExport = () => {
    window.location.href = "/api/materials/export";
  };

  return (
    <div className="card">
      <h1 className="page-title">Danh mục vật tư</h1>
      <p className="page-desc">
        Admin thêm vật tư chuẩn để nhân viên chọn, tránh ghi sai tên.
      </p>

      {/* IMPORT / EXPORT */}
      <div
        className="flex flex-wrap gap-2 items-center"
        style={{ marginBottom: 16 }}
      >
        <button
          type="button"
          className="btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Import từ Excel
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleExport}
        >
          Export ra Excel
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          style={{ display: "none" }}
          onChange={handleImportFile}
        />
      </div>

      {/* Form thêm vật tư */}
      <form
        className="space-y-2"
        style={{ marginBottom: 16 }}
        onSubmit={handleAdd}
      >
        <label className="label">Mã vật tư (tuỳ chọn)</label>
        <input
          className="input"
          placeholder="VD: VT001, BONG150, CB10A..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <label className="label">Tên vật tư</label>
        <input
          className="input"
          placeholder="VD: Bóng cao áp 150W, CB 1P 10A..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="label">Đơn vị</label>
        <input
          className="input"
          placeholder="Cái, bộ, mét..."
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "Thêm vật tư"}
        </button>
      </form>

      {/* Bảng danh sách vật tư */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên vật tư</th>
              <th>Đơn vị</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {materials.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>
                  Chưa có vật tư nào. Hãy thêm hoặc import vật tư phía trên.
                </td>
              </tr>
            )}

            {materials.map((m) => (
              <tr key={m.id}>
                <td>{m.code || "-"}</td>
                <td>{m.name}</td>
                <td>{m.unit}</td>
                <td>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleDelete(m.id)}
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
