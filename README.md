# My Postman Clone

[English Version Below]

## 🇻🇳 Tiếng Việt

**My Postman Clone** là một công cụ kiểm thử API đơn giản, mạnh mẽ được xây dựng bằng Next.js. Ứng dụng này giúp bạn gửi các HTTP request (GET, POST, PUT, DELETE) trực tiếp từ trình duyệt mà không bị chặn bởi CORS hay Proxy của mạng công ty nhờ cơ chế Reverse Proxy tích hợp sẵn.

### Tính năng chính
* **Vượt tường lửa (Bypass Proxy/CORS):** Sử dụng Next.js API Routes để làm trung gian gọi request.
* **Hỗ trợ đầy đủ Method:** GET, POST, PUT, DELETE, PATCH.
* **Trình soạn thảo Headers:** Tùy chỉnh Headers (Add, Edit, Enable/Disable).
* **Trình soạn thảo JSON Body:** Gửi dữ liệu JSON cho các method POST/PUT.
* **Lịch sử (History):** Tự động lưu và xem lại các request gần nhất.
* **Giao diện Sáng/Tối (Light/Dark Mode):** Tùy chỉnh theo sở thích.
* **Syntax Highlighting:** Hiển thị kết quả JSON đẹp mắt, dễ đọc.

### Cài đặt và Chạy

1.  Clone dự án về máy:
    ```bash
    git clone [https://github.com/your-username/my-postman-clone.git](https://github.com/your-username/my-postman-clone.git)
    cd my-postman-clone
    ```

2.  Cài đặt dependencies:
    ```bash
    npm install
    ```

3.  Chạy server phát triển:
    ```bash
    npm run dev
    ```

4.  Mở trình duyệt tại: `http://localhost:3000`

---

## 🇺🇸 English

**My Postman Clone** is a lightweight yet powerful API testing tool built with Next.js. It allows you to send HTTP requests (GET, POST, PUT, DELETE) directly from your browser, bypassing CORS issues and corporate Proxy restrictions via a built-in Reverse Proxy mechanism.

### Key Features
* **Proxy/CORS Bypass:** Uses Next.js API Routes as a middleware to handle requests.
* **Full Method Support:** GET, POST, PUT, DELETE, PATCH.
* **Headers Editor:** Customize Headers easily (Add, Edit, Enable/Disable).
* **JSON Body Editor:** Send JSON payloads for POST/PUT methods.
* **Request History:** Automatically saves and allows quick reloading of recent requests.
* **Light/Dark Mode:** Toggle UI themes instantly.
* **Syntax Highlighting:** Beautifully formatted JSON response viewer.

### Installation & Usage

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/my-postman-clone.git](https://github.com/your-username/my-postman-clone.git)
    cd my-postman-clone
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser at: `http://localhost:3000`