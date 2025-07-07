# ⚛️ Medicare - Frontend (React + Vite)

Đây là **frontend** của dự án Medicare, được xây dựng bằng **React 18**, sử dụng **Vite** để tối ưu tốc độ phát triển.  
Hệ thống hỗ trợ quản lý trạng thái với **Redux Toolkit**, truy vấn dữ liệu bằng **React Query**, xác thực bằng **Google OAuth**, tích hợp **CKEditor**, **Ant Design UI**, và xuất dữ liệu bằng **xlsx**, **file-saver**, v.v...

---

## 🚀 Tech Stack

- ⚛️ React 18 + Vite
- 🎨 Ant Design 5
- 📦 Redux Toolkit + Redux Persist
- 📊 Recharts, Ant Design Charts
- 📡 React Query + Devtools
- ✍️ CKEditor 5
- 🔐 Google OAuth 2.0 + jwt-decode
- 🧱 Styled-components
- 📅 Day.js
- 📁 File export: xlsx, file-saver, html2canvas
- 📦 Axios (gọi API), Dompurify (sanitize HTML)

---

## 📁 Project Structure

.
├── public/ # Static files

├── src/

│ ├── assets/ # Hình ảnh, biểu tượng

│ ├── components/ # Reusable UI components

│ ├── config/ # Cấu hình (axios, token...)

│ ├── data/ # Dữ liệu mẫu / constants

│ ├── hooks/ # Custom React hooks

│ ├── pages/ # Các trang chính (Home, Login...)

│ ├── redux/ # Global state (store, slices)

│ ├── routes/ # Định nghĩa tuyến đường

│ ├── services/ # API service (axios instance)

│ ├── utils/ # Hàm tiện ích chung

│ ├── App.jsx # Root component

│ └── main.jsx # Entry point (ReactDOM)

├── .env # Biến môi trường

├── index.html

├── package.json

└── README.md

---

## ⚙️ Environment Variables
Tạo file `.env` ở thư mục gốc và thêm các biến sau:

VITE_APP_BACKEND_URL=http://localhost:5000

VITE_APP_FRONTEND_URL=http://localhost:5173

VITE_GOOGLE_CLIENT_ID=your_google_client_id

> Sử dụng trong code thông qua `import.meta.env.VITE_APP_BACKEND_URL`...

---

## ▶️ Cài đặt & Chạy ứng dụng

### 1. Cài đặt dependencies

```bash
npm install
```
 ### 2. Chạy development server

 ```bash
npm run dev
```
 
