# CHIN STORE - Digital Game & Cyber Store Platform 🎮⚡

Nền tảng thương mại điện tử chuyên cung cấp tài khoản game bản quyền, phần mềm, key số và gear gaming phong cách Cyberpunk hiện đại.

---

## ✨ Tính năng nổi bật

- ⚡ **Next.js 14 App Router** kết hợp kiến trúc tối ưu hiệu năng và SEO.
- 🎨 **Giao diện Cyber / Dark mode** hiện đại, animations mượt mà với Tailwind CSS & Framer Motion.
- 💳 **Cổng thanh toán tự động**:
  - **VietQR SePay**: Quét mã QR ngân hàng khớp lệnh tự động tức thì.
  - **Litecoin (LTC)**: Thanh toán tiền mã hoá On-Chain an toàn.
- 🔐 **Bảo mật dữ liệu**: Hệ thống mã hoá kho key / thông tin tài khoản bằng chuẩn **AES-256-GCM**.
- 🎫 **Hệ thống Ticket & Hỗ trợ**: Quản lý khiếu nại, hỗ trợ khách hàng theo phân quyền.
- 🌐 **Đa ngôn ngữ (i18n)**: Hỗ trợ tiếng Việt và tiếng Anh với `next-intl`.
- 🛡️ **Quản trị Admin Panel**: Quản lý danh mục, sản phẩm, đơn hàng, kho tài khoản và giao dịch người dùng.

---

## 🛠️ Công nghệ sử dụng

- **Frontend / Framework**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React
- **Backend / Database**: Next.js API Routes, Prisma ORM (SQLite / PostgreSQL)
- **Authentication**: NextAuth.js
- **Quốc tế hoá**: next-intl
- **Thông báo & UI**: Sonner, Canvas Confetti, QR Code Generator

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Cài đặt Dependencies

```bash
npm install
```

### 2. Thiết lập biến môi trường

Tạo file `.env` từ file mẫu `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các giá trị cấu hình tương ứng trong file `.env`.

### 3. Đồng bộ Database & Sinh Prisma Client

```bash
npx prisma generate
npx prisma db push
```

*(Tùy chọn) Chạy seed dữ liệu mẫu:*
```bash
npm run prisma:seed
```

### 4. Khởi chạy Server phát triển

```bash
npm run dev
```

Truy cập trang web tại: **http://localhost:3000**

---

## 📜 Giấy phép
Dự án được phân phối dưới giấy phép **MIT License**.
