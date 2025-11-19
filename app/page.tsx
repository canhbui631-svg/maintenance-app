// app/page.tsx
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - 6); // 7 ngày gần nhất

  // ---- Các số tổng quan ----
  const [
    ticketsToday,
    ticketsTodayOpen,
    ticketsWeek,
    openTicketsDistinctPolesRows,
    staffOnsite,
  ] = await Promise.all([
    prisma.ticket.count({
      where: { createdAt: { gte: startOfToday } },
    }),
    prisma.ticket.count({
      where: {
        createdAt: { gte: startOfToday },
        status: { notIn: ["done", "approved"] },
      },
    }),
    prisma.ticket.count({
      where: { createdAt: { gte: startOfWeek } },
    }),
    prisma.ticket.findMany({
      where: {
        status: { notIn: ["done", "approved"] },
      },
      distinct: ["poleId"],
      select: { poleId: true },
    }),
    prisma.ticket.count({
      where: { status: { notIn: ["done", "approved"] } },
    }),
  ]);

  const openTicketsDistinctPoles = openTicketsDistinctPolesRows.length;

  // ---- Thống kê theo khu vực ----
  const areas = await prisma.area.findMany({
    include: {
      routes: {
        include: {
          poles: {
            select: { id: true },
          },
        },
      },
    },
    orderBy: { id: "asc" },
  });

  const areaStats = await Promise.all(
    areas.map(async (area) => {
      const poleIds = area.routes.flatMap((r) => r.poles.map((p) => p.id));

      if (poleIds.length === 0) {
        return {
          id: area.id,
          name: area.name,
          today: 0,
          open: 0,
        };
      }

      const [todayCount, openCount] = await Promise.all([
        prisma.ticket.count({
          where: {
            poleId: { in: poleIds },
            createdAt: { gte: startOfToday },
          },
        }),
        prisma.ticket.count({
          where: {
            poleId: { in: poleIds },
            status: { notIn: ["done", "approved"] },
          },
        }),
      ]);

      return {
        id: area.id,
        name: area.name,
        today: todayCount,
        open: openCount,
      };
    })
  );

  return (
    <div className="card">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-desc">
        Tổng quan nhanh về tình hình bảo trì, thống kê theo khu vực, tuyến
        đường và phân công nhân viên. Dữ liệu lấy trực tiếp từ hệ thống.
      </p>

      {/* Stats tổng quan */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Sự cố hôm nay</div>
          <div className="stat-value">{ticketsToday}</div>
          <div className="stat-sub">{ticketsTodayOpen} chưa xử lý</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Sự cố 7 ngày gần nhất</div>
          <div className="stat-value">{ticketsWeek}</div>
          <div className="stat-sub">Tất cả khu vực</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Tuyến/trụ đang có sự cố</div>
          <div className="stat-value">{openTicketsDistinctPoles}</div>
          <div className="stat-sub">Đang mở ticket</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Nhân viên đang on-site*</div>
          <div className="stat-value">{staffOnsite}</div>
          <div className="stat-sub">
            *tạm tính theo số ticket đang xử lý
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Cột trái: menu chức năng */}
        <div>
          <h2 className="section-title">Chức năng chính</h2>
          <div className="grid-menu">
            <a href="/maintenance" className="menu-btn">
              <div className="menu-btn-title">Nhập sự cố bảo trì</div>
              <div className="menu-btn-desc">
                Nhân viên hiện trường tạo ticket: xã, tuyến đường, trụ, vật tư...
              </div>
            </a>

            <a href="/admin/areas" className="menu-btn">
              <div className="menu-btn-title">Khu vực (xã, ấp, tuyến)</div>
              <div className="menu-btn-desc">
                Quản lý danh sách khu vực, tuyến đường, áp/móc lưới chiếu sáng.
              </div>
            </a>

            <a href="/admin/materials" className="menu-btn">
              <div className="menu-btn-title">Danh mục vật tư</div>
              <div className="menu-btn-desc">
                Danh sách bóng, kích, dây, kẹp... để chọn nhanh khi tạo phiếu.
              </div>
            </a>

            <a href="/admin/accounts" className="menu-btn">
              <div className="menu-btn-title">Quản lý tài khoản đăng nhập</div>
              <div className="menu-btn-desc">
                Admin/đội trưởng tạo user, phân khu vực, khóa/mở tài khoản.
              </div>
            </a>
          </div>
        </div>

        {/* Cột phải: sự cố theo khu vực */}
        <div>
          <h2 className="section-title">Sự cố theo khu vực</h2>
          {areaStats.length === 0 ? (
            <p className="page-desc">
              Chưa có khu vực nào trong hệ thống. Hãy vào mục{" "}
              <strong>Khu vực</strong> để tạo trước.
            </p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Khu vực</th>
                    <th>Sự cố hôm nay</th>
                    <th>Đang xử lý</th>
                  </tr>
                </thead>
                <tbody>
                  {areaStats.map((a) => (
                    <tr key={a.id}>
                      <td>{a.name}</td>
                      <td>{a.today}</td>
                      <td>{a.open}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="page-desc" style={{ marginTop: 8 }}>
            Nhấp vào mục <strong>Khu vực</strong> để quản lý chi tiết từng
            tuyến đường, trụ đèn và kiểm tra ticket liên quan.
          </p>
        </div>
      </div>
    </div>
  );
}
