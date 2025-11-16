// app/admin/materials/page.tsx

export default function AdminMaterialsPage() {
  return (
    <div className="card">
      <h1 className="page-title">Danh mục vật tư</h1>
      <p className="page-desc">
        Admin thêm vật tư chuẩn để nhân viên chọn, tránh ghi sai tên.
      </p>

      <form className="space-y-2" style={{ marginBottom: 16 }}>
        <label className="label">Mã vật tư (tuỳ chọn)</label>
        <input
          className="input"
          placeholder="VD: VT001, BONG150, CB10A..."
        />

        <label className="label">Tên vật tư</label>
        <input
          className="input"
          placeholder="VD: Bóng cao áp 150W, CB 1P 10A..."
        />

        <label className="label">Đơn vị</label>
        <input className="input" placeholder="Cái, bộ, mét..." />

        <button type="button" className="btn-primary w-full">
          Thêm vật tư
        </button>
      </form>

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
            <tr>
              <td>BONG150</td>
              <td>Bóng cao áp 150W</td>
              <td>Cái</td>
              <td>
                <button className="btn-secondary">Xóa</button>
              </td>
            </tr>
            <tr>
              <td>CB10A</td>
              <td>CB 1P 10A</td>
              <td>Cái</td>
              <td>
                <button className="btn-secondary">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
