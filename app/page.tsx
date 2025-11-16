// app/page.tsx
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="card">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-desc">
        Tổng quan nhanh về tình hình bảo trì, thống kê theo địa bàn, tuyến
        đường và phân công nhân viên.
      </p>

      {/* Hàng thống kê nhanh */}
      <div className="stats-grid">
        <Link
          href="/maintenance?range=today"
          className="stat-card stat-card-link"
        >
          <div className="stat-label">Sự cố hôm nay</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">4 chưa xử lý</div>
        </Link>

        <Link
          href="/maintenance?range=week"
          className="stat-card stat-card-link"
        >
          <div className="stat-label">Sự cố trong tuần</div>
          <div className="stat-value">57</div>
          <div className="stat-sub">18 ở xã Long Hoa</div>
        </Link>

        <Link
          href="/maintenance?status=processing"
          className="stat-card stat-card-link"
        >
          <div className="stat-label">Tuyến đường có sự cố</div>
          <div className="stat-value">23</div>
          <div className="stat-sub">Ưu tiên tuyến chính</div>
        </Link>

        <Link
          href="/maintenance?assignee=onsite"
          className="stat-card stat-card-link"
        >
          <div className="stat-label">Nhân viên đang on-site</div>
          <div className="stat-value">5</div>
          <div className="stat-sub">2 ca đêm</div>
        </Link>
      </div>

      <div className="dashboard-layout">
        {/* Cột trái: menu chức năng chính */}
        <div>
          <h2 className="section-title">Chức năng chính</h2>
          <div className="grid-menu">
            <Link href="/maintenance" className="menu-btn">
              <span className="menu-btn-title">Nhập sự cố bảo trì</span>
              <span className="menu-btn-desc">
                Nhân viên hiện trường tạo ticket: xã, tuyến đường, trụ, vật tư…
              </span>
            </Link>

            <Link href="/admin/areas" className="menu-btn">
              <span className="menu-btn-title">Địa bàn (xã, ấp, tuyến)</span>
              <span className="menu-btn-desc">
                Quản lý danh sách địa bàn, tuyến đường, ấp. Tạo mới / chỉnh sửa.
              </span>
            </Link>

            <Link href="/admin/materials" className="menu-btn">
              <span className="menu-btn-title">Danh mục vật tư</span>
              <span className="menu-btn-desc">
                Danh sách bóng, kích, dây, kẹp… để chọn nhanh, tránh ghi sai.
              </span>
            </Link>

            <Link href="/admin/accounts" className="menu-btn">
              <span className="menu-btn-title">Quản lý tài khoản đăng nhập</span>
              <span className="menu-btn-desc">
                Chỉ admin/đội trưởng được tạo / khoá tài khoản nhân viên bảo trì.
              </span>
            </Link>
          </div>
        </div>

        {/* Cột phải: tóm tắt theo địa bàn */}
        <div>
          <h2 className="section-title">Sự cố theo địa bàn (demo)</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Địa bàn</th>
                  <th>Sự cố hôm nay</th>
                  <th>Đang xử lý</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Link href="/admin/areas/1" className="table-link">
                      Long Hoa
                    </Link>
                  </td>
                  <td>5</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>
                    <Link href="/admin/areas/2" className="table-link">
                      Hoà Thành
                    </Link>
                  </td>
                  <td>3</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>
                    <Link href="/admin/areas/3" className="table-link">
                      Gò Dầu
                    </Link>
                  </td>
                  <td>2</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="page-desc" style={{ marginTop: 8 }}>
            Nhấp vào tên địa bàn để xem thống kê chi tiết của khu vực đó.
          </p>
        </div>
      </div>
    </div>
  );
}
