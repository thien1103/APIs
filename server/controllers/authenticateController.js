const { connection } = require("../configuration/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const salt = 10;
const crypto = require("crypto");
require("dotenv/config");
const nodemailer = require("nodemailer");

class Authentication {
  // Hàm đăng nhập Sign In
  SignIn(req, res, next) {
    const { phoneNumber, password } = req.body;
    const sql =
      "SELECT id, password, phone_number FROM users WHERE phone_number = ?";

    connection.query(sql, [phoneNumber], async (err, data) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      if (data.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Người dùng không tồn tại",
        });
      }

      const user = data[0];

      try {
        // Kiểm tra mật khẩu cũ
        bcrypt.compare(password, user.password, (err, match) => {
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
              message: "Mật khẩu không đúng",
            });
          }

          const userId = user.id;

          // Query roles and permissions
          const roleSql = `
          SELECT 
            r.id AS role_id, 
            r.name AS role_name,
            GROUP_CONCAT(DISTINCT p.id) AS id_permissions,
            GROUP_CONCAT(DISTINCT p.name) AS permission_names
          FROM roles r
          JOIN role_permission rp ON r.id = rp.id_role
          JOIN permissions p ON rp.id_permission = p.id
          WHERE r.id IN (SELECT role_id FROM user_role WHERE user_id = ?)
          GROUP BY r.id, r.name;
        `;

          connection.query(roleSql, [userId], (err, roleData) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                status_code: 500,
                type: "error",
                message: "Lỗi server khi truy vấn vai trò và quyền",
              });
            }

            const payload = { id: userId };
            const token = jwt.sign(payload, "jwt-secret-key", {
              algorithm: "HS256",
            });

            return res.status(200).json({
              status_code: 200,
              type: "success",
              message: "Đăng nhập thành công",
              data: { id: userId, token },
            });
          });
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Có lỗi trong quá trình xử lí",
        });
      }
    });
  }

  // checkPhoneExist(req, res) {
  //     console.log("Phone Number: ", req.body.phoneNumber);
  //     const userSql = `SELECT COUNT(*) AS count FROM user WHERE phoneNumber = ?`;

  //     connection.query(userSql, req.body.phoneNumber, (err, data) => {
  //         if (err) {
  //             console.log(err);
  //             return res.json(({ Error: "Lỗi xác thực kiểm tra số điện thoại" }))
  //         }
  //         if (data.some(row => row.count > 0)) {
  //             res.json({ phoneError: "Số điện thoại đã tồn tại" });
  //         } else return res.json({ Status: "Success" });
  //     })
  // };
  SignUp(req, res) {
    const checkPhoneQuery =
      "SELECT COUNT(*) AS count FROM users WHERE phone_number = ?";
    connection.query(
      checkPhoneQuery,
      [req.body.phoneNumber],
      (err, phoneResult) => {
        if (err) {
          console.error("Error checking phone number:", err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi trong quá trình xử lí",
          });
        }

        if (phoneResult[0].count > 0) {
          return res.status(400).json({
            status_code: 400,
            type: "error",
            message:
              "Số điện thoại đã được đăng kí. Vui lòng sử dụng số điện thoại khác",
          });
        }

        // Kiểm tra số điện thoại người dùng có khớp với số điện thoại bố hoặc mẹ không
        if (
          req.body.phoneNumber !== req.body.parent_phone && req.body.phoneNumber !== req.body.mother_phone
        ) {
          return res.status(400).json({
            status_code: 400,
            type: "error",
            message:
              "Số điện thoại người dùng không khớp với số điện thoại của bố hoặc mẹ. Vui lòng thử lại",
          });
        }

        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              status_code: 500,
              type: "error",
              message: "Lỗi trong quá trình xử lí",
            });
          }

          const userValues = [
            req.body.phoneNumber,
            req.body.phoneNumber,
            hash,
            req.body.name,
            req.body.email,
            null,
            1,
            null,
            new Date(),
            null,
          ];
          let sex = req.body.sex;
          if (sex === "Nam") {
            sex = 1;
          } else if (req.body.sex === "Nữ") {
            sex = 0;
          }
          
          const created_at = new Date();
          const studentValues = [
            req.body.name,
            sex,
            req.body.address,
            req.body.classStudy,
            0,
            req.body.parent_name,
            req.body.parent_phone,
            req.body.parent_email,
            req.body.mother_name,
            req.body.mother_phone,
            req.body.mother_email,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            created_at,
            null,
          ];

         connection.query(
           "INSERT INTO users (username, phone_number, password, name, email, email_verified_at, isActived, isDeleted, created_at, updated_at) VALUES (?)",
           [userValues],
           (err, result) => {
             if (err) {
               console.error("Error inserting into users:", err);
               return res.status(400).json({
                 status_code: 400,
                 type: "error",
                 message: "Đăng kí không thành công",
               });
             }

             const userId = result.insertId;
             const token = crypto.randomBytes(16).toString("hex");

             connection.query(
               "INSERT INTO enrollment_records (name, gender, address, id_class, status, parent_name, parent_phone, parent_email, mother_name, mother_phone, mother_email, image, biet_danh, birth_date, doi_tuong_uu_tien, dc_thuongtru, ethnicity, height, weigth, medical_history, id_enrollment, `character` , parent_age, parent_job, mother_age, mother_job, parents_note, type_relate, psychological_record, health_record, family_register, birth_certificate, note, method_payment, period_payment, extra_services, isDeleted, trangthai_hoc, ngay_vao_hoc, ngay_nghi_hoc, ngay_bao_luu, ngay_chohoc, khoi_hoc, nhom_hoc, so_dinh_danh, nguoi_dai_dien, ma_dinddanh, created_at, updated_at) VALUES (?)",
               [studentValues],
               (err, result) => {
                 if (err) {
                   console.error(
                     "Error inserting into enrollment_records:",
                     err
                   );
                   return res.status(400).json({
                     status_code: 400,
                     type: "error",
                     message: "Đăng kí không thành công",
                   });
                 }

                 const enrollmentId = result.insertId;

                 // Insert into Role_PHHS table
                 connection.query(
                   "INSERT INTO Role_PHHS (id_ph, id_hs) VALUES (?, ?)",
                   [userId, enrollmentId],
                   (err, result) => {
                     if (err) {
                       console.error("Error inserting into Role_PHHS:", err);
                       return res.status(400).json({
                         status_code: 400,
                         type: "error",
                         message: "Đăng kí không thành công",
                       });
                     }

                     const verificationUrl = `http://${req.get(
                       "host"
                     )}/api/verify-email?token=${token}&id=${userId}`;
                     const transporter = nodemailer.createTransport({
                       service: "gmail",
                       auth: {
                         user: "tuhaothien51@gmail.com",
                         pass: "ifwi iblf eazr drax",
                       },
                       logger: true,
                       debug: true,
                     });

                     const mailOptions = {
                       from: "tuhaothien51@gmail.com",
                       to: req.body.email,
                       subject: "Email Verification For Star Kid",
                       text: `To verify your email. Follow this link: ${verificationUrl}`,
                     };

                     transporter.sendMail(mailOptions, (error, info) => {
                       if (error) {
                         console.error("Error sending email:", error);
                         return res.status(500).json({
                           status_code: 500,
                           type: "error",
                           message:
                             "Lỗi trong quá trình xử lí. Vui lòng thử lại sau",
                         });
                       }

                       // Save the token to the database
                       connection.query(
                         `UPDATE users SET remember_token = ? WHERE id = ?`,
                         [token, userId],
                         (err, result) => {
                           if (err) {
                             console.error("Error updating user token:", err);
                             return res.status(500).json({
                               status_code: 500,
                               type: "error",
                               message:
                                 "Lỗi trong quá trình xử lí. Vui lòng thử lại sau",
                             });
                           }

                           return res.status(201).json({
                             status_code: 201,
                             type: "success",
                             message:
                               "Đăng kí thành công. Vui lòng kiểm tra email của bạn.",
                           });
                         }
                       );
                     });
                   }
                 );
               }
             );
           }
         );
        });
      }
    );
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
    const checkUserSql = "SELECT * FROM users WHERE id = ?";
    connection.query(checkUserSql, [userId], (err, result) => {
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

      const user = result[0];

      // Kiểm tra mật khẩu cũ
      bcrypt.compare(oldPassword, user.password, (err, match) => {
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
            "UPDATE users SET password = ? WHERE id = ?";
          connection.query(updatePasswordSql, [hash, userId], (err, result) => {
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

  VerifyEmail(req, res) {
    const { token, id } = req.query;

    if (!token || !id) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Yêu cầu không hợp lệ, vui lòng bổ sung token hoặc id",
      });
    }

    connection.query(
      `SELECT * FROM users WHERE id = ? AND remember_token = ?`,
      [id, token],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server",
          });
        }

        if (results.length === 0) {
          return res.status(400).json({
            status_code: 400,
            type: "error",
            message: "Token hoặc người dùng không hợp lệ",
          });
        }

        connection.query(
          `UPDATE users SET email_verified_at = ?, remember_token = null WHERE id = ?`,
          [new Date(), id],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                status_code: 500,
                type: "error",
                message: "Không thể xác thực email",
              });
            }
            const responseData = {
              status_code: 200,
              type: "success",
              message: "Email đã được xác thực thành công",
            };
            return res
              .status(200)
              .send(
                `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Email Verification Successful</title>
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
              <style>
                body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f5f5f5;
                }
                .card {
                  max-width: 500px;
                  width: 100%;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="card-body">
                  <div class="text-center">
                    <i class="fas fa-check-circle fa-5x text-success mb-4"></i>
                    <h2 class="card-title">Xác Thực Email Thành Công</h2>
                    <p class="card-text">Chúc mừng bạn đã kích hoạt thành công email cá nhân. Chào mừng bạn đến với ngôi nhà chung Star Kid.</p>
                  </div>
                </div>
              </div>

              <script src="https://kit.fontawesome.com/your-font-awesome-kit.js"></script>
            </body>
            </html>
          `
              )
              .json(responseData);
          }
        );
      }
    );
  }
}
module.exports = new Authentication();
