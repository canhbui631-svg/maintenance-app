"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Area = {
  id: number;
  name: string;
  roads: string;
  hamlets: string;
};

export default function AreaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const loadArea = async () => {
    const res = await fetch(`/api/areas/${id}`);
    const data = await res.json();
    if (data.ok) setArea(data.area);
  };

  useEffect(() => {
    if (id) loadArea();
  }, [id]);

  const handleSave = async () => {
    if (!area) return;
    setSaving(true);
    await fetch(`/api/areas/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: area.name,
        roads: area.roads,
        hamlets: area.hamlets,
      }),
    });
    setSaving(false);
    router.back();
  };

  if (!area) {
    return <div className="p-6 text-sm text-gray-400">Đang tải…</div>;
  }

  return (
    <div className="px-8 py-6">
      <h1 className="text-xl font-semibold mb-4">
        Sửa địa bàn – {area.name}
      </h1>

      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Tên địa bàn (xã / phường)</label>
          <input
            className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none border border-slate-700 focus:border-blue-500"
            value={area.name}
            onChange={(e) => setArea({ ...area, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Tuyến đường</label>
          <textarea
            className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none border border-slate-700 focus:border-blue-500 min-h-[80px]"
            value={area.roads}
            onChange={(e) => setArea({ ...area, roads: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Ấp / khu phố</label>
          <textarea
            className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none border border-slate-700 focus:border-blue-500 min-h-[80px]"
            value={area.hamlets}
            onChange={(e) => setArea({ ...area, hamlets: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-full bg-slate-700 hover:bg-slate-600"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
