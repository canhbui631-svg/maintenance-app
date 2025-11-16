// app/auth/permissions.ts

// 3 cấp vai trò
export type Role = "admin" | "leader" | "staff";

// Các quyền chi tiết trong hệ thống
export type Permission =
  | "viewDashboard"
  | "manageAreas"      // thêm/xoá/sửa xã, tuyến đường, ấp
  | "manageMaterials"  // danh mục vật tư
  | "manageAccounts"   // tạo / khoá tài khoản
  | "createTicket"     // nhân viên tạo ticket sự cố
  | "assignTicket"     // phân công ticket cho nhân viên
  | "viewAllTickets";  // xem toàn bộ ticket (không chỉ của mình)

// Map role -> danh sách quyền
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "viewDashboard",
    "manageAreas",
    "manageMaterials",
    "manageAccounts",
    "createTicket",
    "assignTicket",
    "viewAllTickets",
  ],
  leader: [
    "viewDashboard",
    "manageAreas",     // ✅ đội trưởng được thêm tuyến đường, xã
    "manageMaterials",
    "createTicket",
    "assignTicket",
    "viewAllTickets",
  ],
  staff: [
    "viewDashboard",
    "createTicket",
    // chỉ xem ticket của mình (phần này xử lý ở backend/filter)
  ],
};

// User model
export type User = {
  id: number;
  name: string;
  username: string;
  role: Role;
};

// Hàm kiểm tra quyền
export function hasPermission(user: User | null, permission: Permission) {
  if (!user) return false;
  const perms = ROLE_PERMISSIONS[user.role] || [];
  return perms.includes(permission);
}
