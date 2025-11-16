// app/admin/areas/[id]/page.tsx

type AreaDetailPageProps = {
  params: { id: string };
};

// Demo dữ liệu địa bàn
const areaMap: Record<
  string,
  { name: string; today: number; week: number; processing: number }
> = {
  "1": { name: "Long Hoa", today: 5, week: 20, processing: 2 },
  "2": { name: "Hoà Thành", today: 3, week: 15, processing: 1 },
  "3": { name: "Gò Dầu", today: 2, week: 10, processing: 1 },
};

export default function AreaDetailPage({ params }: AreaDetailPageProps) {
  const area = areaMap[params.id];

  if (!area) {
    return (
      <div className="card">
        <h1 className="page-title">Địa bàn không tồn tại</h1>
        <p className="page-desc">
          Không tìm thấy thông tin địa bàn với mã: {params.id}
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="page-title">Thống kê địa bàn: {area.name}</h1>
      <p className="page-desc">
        Số liệu demo. Sau này sẽ lấy dữ liệu thật từ ticket bảo trì.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Sự cố hôm nay</div>
          <div className="stat-value">{area.today}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sự cố trong tuần</div>
          <div className="stat-value">{area.week}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đang xử lý</div>
          <div className="stat-value">{area.processing}</div>
        </div>
      </div>

      <p className="page-desc" style={{ marginTop: 16 }}>
        Bạn có thể bổ sung thêm:
        <br />- Danh sách tuyến đường của địa bàn này
        <br />- Danh sách sự cố chi tiết tại đây
        <br />- Tổng vật tư đã sử dụng trong tuần/tháng
      </p>
    </div>
  );
}
