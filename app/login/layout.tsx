// app/login/layout.tsx

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // wrapper riêng cho trang login (không header vì AppHeader đã ẩn khi pathname bắt đầu bằng /login)
  return (
    <div className="min-h-[calc(100vh-32px)] flex items-center justify-center px-4">
      {children}
    </div>
  );
}
