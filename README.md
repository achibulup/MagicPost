# Magic Post

## Tổng quan
Đây là dự án nhằm tạo ra ứng dụng web đầy đủ tính năng cho một công ty chuyển phát như xác thực người dùng, phân quyền dựa trên tài khoản, thống kê và quản lý đơn hàng và nhân viên. Ứng dụng có giao diện thích ứng với kích thước màn hình khác nhau như điện thoại và máy tính. 

## Các thành viên
- **Trần Minh Sáng - 21020026**
- **Phạm Minh Nguyên - 21020084**
- **Phạm Khánh Linh - 21020080**


## Các công nghệ được sử dụng
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Bcrypt](https://www.npmjs.com/package/bcryptjs)


## Hướng dẫn chạy
1. Cài các gói thư viện: sử dụng lệnh `npm install`
2. Thiết lập database
 - Tạo một project mới bất kỳ trên vercel 
 - Tạo một [database mới](https://vercel.com/docs/storage/vercel-postgres/quickstart) trên Vercel (lưu ý là phải tạo một project trước).
 - Khởi tạo dữ liệu cho database: Lấy url của database vừa được tạo, dùng lệnh `psql <url> -f <dump_file>` với dump_file là file backup đã được cho trong repo.
3. Thiết lập môi trường (mẫu từ file .env.example)
 - Sao chép file môi trường `.env.local` từ database mới tạo vào file .env.local trong folder repo.
 - Tạo một chuỗi ngẫu nhiên làm khóa cho JSON Web Token, lưu vào biến `JWT_SECRET` trong file `.env.local`.
 - (Tùy chọn) Nếu baseurl của ứng dụng sẽ chạy được cấu hình khác thì sửa biến NEXT_PUBLIC_API_BASE_URL thành giá trị tương ứng. Nếu không để giá trị như ở file `.env.example`. 
4. Chạy ứng dụng: chạy lệnh `npm run build && npm run start` hoặc `npm run dev`

## Tính Năng

1. **Xác thực và Phân quyền:**
   - Người dùng có thể đăng ký hoặc đăng nhập với tài khoản dựa trên vai trò (khách hàng, nhân viên văn phòng, quản lý văn phòng, nhân viên kho, quản lý kho).
   - Kiểm soát truy cập dựa trên vai trò đảm bảo tính bảo mật cho việc truy cập và thao tác với hệ thống cũng như cá nhân hóa theo vai trò của người dùng.

2. **Thao tác CRUD:**
   - Triển khai thao tác CRUD cho các đối tượng như đơn đặt hàng và nhân viên.


3. **Tích hợp AJAX:**
   - Sử dụng AJAX để cải thiện giao diện và trải nghiệm người dùng.

4. **Tách biệt xử lý nghiệp vụ và giao diện:**
   - Tách biệt giữa mã nguồn xử lý logic nghiệp vụ và giao diện để tăng tính bảo trì và mở rộng.

5. **Thiết kế đáp ứng:**
   - Ứng dụng được thiết kế để đáp ứng nhiều kích thước màn hình, mang lại trải nghiệm người dùng mượt mà.

6. **Kiểm tra hợp thức:**
   - Mẫu bao gồm các cơ chế kiểm tra hợp thức để đảm bảo tính toàn vẹn của dữ liệu.

7. **Quản lý Phiên:**
   - Triển khai quản lý phiên dựa vào cookie để đảm bảo an ninh và theo dõi người dùng.

8. **Mã Hóa:**
   - Mật được mã hóa bằng thư viện bcrypt để đảm bảo an toàn thông tin người dùng.

9. **Chuyển Hướng URL:**
    - Sử dụng chuyển hướng URL để cải thiện trải nghiệm điều hướng người dùng.