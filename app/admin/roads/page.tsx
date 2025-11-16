// app/admin/roads/page.tsx

export default function AdminRoadsPage() {
  return (
    <div className="card">
      <h1 className="page-title">Quản lý tuyến đường</h1>
      <p className="page-desc">
        Admin thêm tuyến đường theo từng xã/phường để nhân viên chọn đúng.
      </p>

      <form className="space-y-2" style={{ marginBottom: 16 }}>
        <label className="label">Chọn huyện / thị xã</label>
        <select className="select">
          <option>Thị xã Hòa Thành</option>
          <option>Thành phố Tây Ninh</option>
        </select>

        <label className="label">Chọn xã / phường</label>
        <select className="select">
          <option>Long Hoa</option>
          <option>Hiệp Tân</option>
        </select>

        <label className="label">Tên tuyến đường</label>
        <input className="input" placeholder="Ví dụ: ĐT785, QL22, 30/4..." />

        <button type="button" className="btn-primary w-full">
          Thêm tuyến
        </button>
      </form>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Huyện / Thị xã</th>
              <th>Xã / Phường</th>
              <th>Tuyến đường</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Thị xã Hòa Thành</td>
              <td>Long Hoa</td>
              <td>ĐT785</td>
              <td>
                <button className="btn-secondary">Xóa</button>
              </td>
            </tr>
            <tr>
              <td>Thành phố Tây Ninh</td>
              <td>Phường 3</td>
              <td>30/4</td>
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
