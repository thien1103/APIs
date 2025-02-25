const { pool } = require("../../configuration/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const salt = 10;
const crypto = require("crypto");
require("dotenv/config");
const nodemailer = require("nodemailer");
const {unserialize} = require("php-serialize");

class EmployeeAuthentication {

SignIn(req, res, next) {
    const { phoneNumber, password } = req.body;

    const sql = `
      SELECT ma_nv, password, dien_thoai 
      FROM nhan_vien 
      WHERE dien_thoai = ?
    `;

    pool.query(sql, [phoneNumber], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ status_code: 500, type: "error", message: "Server error" });
        }

        if (data.length === 0) {
            return res.status(404).json({ status_code: 404, type: "error", message: "User not found" });
        }

        const nhanVien = data[0];

        bcrypt.compare(password, nhanVien.password, (err, match) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status_code: 500, type: "error", message: "Error during password comparison" });
            }

            if (!match) {
                return res.status(400).json({ status_code: 400, type: "error", message: "Incorrect password" });
            }

            const maNv = nhanVien.ma_nv;

            const classTeacherSql = `
              SELECT id_class, id_giaovien 
              FROM class_teacher
            `;

            pool.query(classTeacherSql, (err, classTeacherData) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ status_code: 500, type: "error", message: "Error retrieving class teacher data" });
                }

                let teacherClasses = [];

                classTeacherData.forEach(row => {
                  try {
                      // console.log("Raw id_giaovien:", row.id_giaovien);
                      const deserializedGiaovien = unserialize(row.id_giaovien); // Unserialize to get the array
                      // console.log("Deserialized id_giaovien:", deserializedGiaovien);
                      if (deserializedGiaovien.map((id) => id.trim()).includes(maNv.trim())) {
                        teacherClasses.push(row.id_class);
                          // console.log(`Match found for class ID: ${row.id_class}`);

                      }
                      // console.log("Comparing:", deserializedGiaovien.map((id) => id.trim()), "with:", maNv.trim());

                  } catch (err) {
                      console.error("Failed to deserialize id_giaovien:", err);
                  }
              });
              

                if (teacherClasses.length === 0) {
                    return res.status(404).json({ status_code: 404, type: "error", message: "Enrollment record not found" });
                }

                const payload = { userId: maNv, role: "Giáo viên", teacherClasses };
                const token = jwt.sign(payload, process.env.JWT_SECRET || "jwt-secret-key", {
                    algorithm: "HS256",
                    // expiresIn: "1h",
                });

                return res.status(200).json({
                    status_code: 200,
                    type: "success",
                    message: "Login successful",
                    data: { userId: maNv, role: "Giáo viên", token, teacherClasses },
                });
            });
        });
    });
}


  //Hàm đăng xuất
  async logoutExecute(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;

      // Extract the token from the Authorization header
      const token = authorizationHeader.split(" ")[1];
      // Clear cookie
      res.clearCookie("token");
      console.log("Cookie is cleared");
      // Trả về thành công
      return res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      return res
        .status(500)
        .json({ status_code: 500, type: "error", message: "Lỗi server" });
    }
  }
  //   //Hàm chỉ định verify cho token
  //   showVerifyUser(req, res) {
  //     return res.json({ Status: "Success", name: req.name, phoneNumber: req.phoneNumber, userId: req.userId });
  // }

  //Hàm đổi mật khẩu
  ChangePassword(req, res) {
    const { userId, oldPassword, newPassword } = req.body;

    // Kiểm tra xem userId có tồn tại trong database không
    const checkUserSql = "SELECT * FROM nhan_vien WHERE ma_nv = ?";
    pool.query(checkUserSql, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Lỗi không thể thay đổi mật khẩu. Vui lòng thử lại sao",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Lỗi người dùng không tồn tại",
        });
      }

      const nhan_vien = result[0];

      // Kiểm tra mật khẩu cũ
      bcrypt.compare(oldPassword, nhan_vien.password, (err, match) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi trong quá trình xử lí",
          });
        }

        if (!match) {
          return res.status(400).json({
            status_code: 400,
            type: "error",
            message: "Mật khẩu cũ không đúng",
          });
        }

        // Mã hóa mật khẩu mới
        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              status_code: 500,
              type: "error",
              message: "Lỗi trong quá trình xử lí",
            });
          }

          // Cập nhật mật khẩu mới trong database
          const updatePasswordSql =
            "UPDATE nhan_vien SET password = ? WHERE ma_nv = ?";
          pool.query(updatePasswordSql, [hash, userId], (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                status_code: 500,
                type: "error",
                message: "Lỗi trong quá trình xử lí [Database]",
              });
            }

            return res.json({
              status_code: 200,
              type: "success",
              message: "Đổi mật khẩu thành công",
            });
          });
        });
      });
    });
  }

  // VerifyEmail(req, res) {
  //   const { token, id } = req.query;

  //   if (!token || !id) {
  //     return res.status(400).json({
  //       status_code: 400,
  //       type: "error",
  //       message: "Yêu cầu không hợp lệ, vui lòng bổ sung token hoặc id",
  //     });
  //   }

  //   pool.query(
  //     `SELECT * FROM users WHERE id = ? AND remember_token = ?`,
  //     [id, token],
  //     (err, results) => {
  //       if (err) {
  //         console.log(err);
  //         return res.status(500).json({
  //           status_code: 500,
  //           type: "error",
  //           message: "Lỗi server",
  //         });
  //       }

  //       if (results.length === 0) {
  //         return res.status(400).json({
  //           status_code: 400,
  //           type: "error",
  //           message: "Token hoặc người dùng không hợp lệ",
  //         });
  //       }

  //       pool.query(
  //         `UPDATE users SET email_verified_at = ?, remember_token = null WHERE id = ?`,
  //         [new Date(), id],
  //         (err, result) => {
  //           if (err) {
  //             console.log(err);
  //             return res.status(500).json({
  //               status_code: 500,
  //               type: "error",
  //               message: "Không thể xác thực email",
  //             });
  //           }
  //           const responseData = {
  //             status_code: 200,
  //             type: "success",
  //             message: "Email đã được xác thực thành công",
  //           };
  //           return res
  //             .status(200)
  //             .send(
  //               `
  //           <!DOCTYPE html>
  //           <html>
  //           <head>
  //             <title>Email Verification Successful</title>
  //             <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  //             <style>
  //               body {
  //                 display: flex;
  //                 justify-content: center;
  //                 align-items: center;
  //                 height: 100vh;
  //                 margin: 0;
  //                 background-color: #f5f5f5;
  //               }
  //               .card {
  //                 max-width: 500px;
  //                 width: 100%;
  //               }
  //             </style>
  //           </head>
  //           <body>
  //             <div class="card">
  //               <div class="card-body">
  //                 <div class="text-center">
  //                   <i class="fas fa-check-circle fa-5x text-success mb-4"></i>
  //                   <h2 class="card-title">Xác Thực Email Thành Công</h2>
  //                   <p class="card-text">Chúc mừng bạn đã kích hoạt thành công email cá nhân. Chào mừng bạn đến với ngôi nhà chung Star Kid.</p>
  //                 </div>
  //               </div>
  //             </div>

  //             <script src="https://kit.fontawesome.com/your-font-awesome-kit.js"></script>
  //           </body>
  //           </html>
  //         `
  //             )
  //             .json(responseData);
  //         }
  //       );
  //     }
  //   );
  // }
}
module.exports = new EmployeeAuthentication();
