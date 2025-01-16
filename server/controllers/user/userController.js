const { pool } = require("../../configuration/dbConfig");
const fs = require("fs");
const path = require("path");

class User {
  //Controller cho API lấy, hiển thị thông tin người dùng
  GetUserInfo(req, res) {
    const userId = req.params.userId;
    const getUserSql = `SELECT 
  u.name, 
  u.email, 
  u.username, 
  u.phone_number, 
  u.email, 
  e.gender, 
  e.address, 
  e.id_class,
  e.image, 
  e.parent_name, 
  e.parent_email, 
  e.parent_phone, 
  e.mother_name, 
  e.mother_phone, 
  e.mother_email
FROM users u
INNER JOIN Role_PHHS r ON u.id = r.id_ph
INNER JOIN enrollment_records e ON r.id_hs = e.id
WHERE u.id = ?`;

    pool.query(getUserSql, [userId], (err, userResult) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      if (userResult.length === 0) {
        console.log(err);
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Người dùng không tồn tại",
        });
      }

      const user = userResult[0];
      // Query student type information
      const getClasssql = "SELECT name FROM class WHERE id = ?";
      pool.query(getClasssql, [user.id_class], (err, classResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server",
          });
        }

        const class_ = classResult.length > 0 ? classResult[0].name : null;

        let userInfo = {
          name: user.name,
          phoneNumber: user.phone_number,
          email: user.email,
          sex: user.gender === 1 ? "Nam" : "Nữ",
          address: user.address,
          avatar: user.image,
          sex: user.sex,
          classStudy: class_,
          mother: {
            name: user.mother_name,
            phoneNumber: user.mother_phone,
            email: user.email,
          },
          father: {
            name: user.parent_name,
            phoneNumber: user.parent_phone,
            email: user.email,
          },
        };

        return res.status(200).json({
          status_code: 200,
          type: "success",
          message: "Thông tin người dùng",
          data: userInfo,
        });
      });
    });
  }

  UpdateUserInfo(req, res) {
    const userId = req.params.userId;
    const { name, sex, phoneNumber, email, address, classStudy } = req.body;

    // Build the SQL query dynamically based on the fields provided in the request body
    let updateUserSql = "UPDATE users u ";
    updateUserSql += "INNER JOIN Role_PHHS r ON u.id = r.id_ph ";
    updateUserSql += "INNER JOIN enrollment_records e ON r.id_hs = e.id ";
    updateUserSql += "SET ";
    const updateParams = [];

    // Add the fields to be updated and their corresponding values to the query
    if (name !== undefined) {
      updateUserSql += "u.name = ?, ";
      updateParams.push(name);
    }
        if (name !== undefined) {
          updateUserSql += "e.name = ?, ";
          updateParams.push(name);
        }
    if (phoneNumber !== undefined) {
      updateUserSql += "u.phone_number = ?, ";
      updateParams.push(phoneNumber);
    }
    if (email !== undefined) {
      updateUserSql += "u.email = ?, ";
      updateParams.push(email);
    }
    if (address !== undefined) {
      updateUserSql += "e.address = ?, ";
      updateParams.push(address);
    }
    if (sex !== undefined) {
      updateUserSql += "e.gender = ?, ";
      updateParams.push(sex === "Nam" ? 1 : 0);
    }
     if (classStudy !== undefined) {
       updateUserSql += "id_class = ?, ";
       updateParams.push(classStudy);
     }

    // Update the field updated_at in database
    const updated_at = new Date();
    updateUserSql += "u.updated_at = ?, ";
    updateUserSql += "e.updated_at = ? ";
    updateParams.push(updated_at, updated_at);

    // Add the WHERE clause for the user update
    updateUserSql += "WHERE u.id = ?";
    updateParams.push(userId);

    // Execute the update query
    pool.query(updateUserSql, updateParams, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Người dùng không tồn tại",
        });
      }

      // Update was successful
      return res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Cập nhật thông tin người dùng thành công",
      });
    });
  }

  //Hàm xử lí thay đổi avatar cá nhân
  ChangeAvatar(req, res) {
    const userId = req.params.userId;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Vui lòng chọn ảnh đại diện",
      });
    }

    try {
      // Decode ảnh (base64)
      const imageData = Buffer.from(avatar, "base64");

      // Tạo filename (unique) cho avatar
      const filename = `user-${userId}-avatar.jpg`;
      const filePath = path.join("public", "image", filename);

      // Lưu ảnh với filePath vào file system
      fs.writeFileSync(filePath, imageData);

      // Query update lại trường avatar trong database sử dụng biến publicPath
      const updateAvatarSql = "UPDATE users as u INNER JOIN Role_PHHS as r ON u.id = r.id_ph INNER JOIN enrollment_records as e ON r.id_hs = e.id SET image = ? WHERE u.id = ?";
      pool.query(updateAvatarSql, [filename, userId], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status_code: 404,
            type: "error",
            message: "Người dùng không tồn tại",
          });
        }

        return res.status(200).json({
          status_code: 200,
          type: "success",
          message: "Ảnh đại diện đã được cập nhật thành công",
          avatar: filename,
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status_code: 500,
        type: "error",
        message: "Lỗi server",
      });
    }
  }

  //Hàm GetUserAvatar để gửi lên client
  GetUserAvatar(req, res) {
    const { filename } = req.params;
    const imagePath = path.resolve(
      __dirname,
      "..",
      "public",
      "image",
      filename
    );

    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Ảnh không tồn tại",
        });
      }
    });
  }
}

module.exports = new User();

// NỀU LỠ QUÊN MẬT KHẨU THÌ THAY BẰNG HÀM NÀY ĐỂ ĐỔI LẠI MẬT KHẨU

// //Hàm đổi mật khẩu không hash
//   ChangePassword(req, res) {
//     const { userId } = req.params;
//     const { oldPassword, newPassword } = req.body;

//     // Kiểm tra xem userId có tồn tại trong database không
//     const checkUserSql = "SELECT * FROM user WHERE userId = ?";
//     pool.query(checkUserSql, [userId], (err, result) => {
//       if (err) {
//         console.log(err);
//         return res
//           .status(500)
//           .json({
//             status_code: 500,
//             type: "error",
//             message: "Lỗi không thể thay đổi mật khẩu. Vui lòng thử lại sao",
//           });
//       }

//       if (result.length === 0) {
//         return res
//           .status(404)
//           .json({
//             status_code: 404,
//             type: "error",
//             message: "Lỗi người dùng không tồn tại",
//           });
//       }

//       const user = result[0];

//         // Mã hóa mật khẩu mới
//         bcrypt.hash(newPassword, 10, (err, hash) => {
//           if (err) {
//             console.log(err);
//             return res
//               .status(500)
//               .json({
//                 status_code: 500,
//                 type: "error",
//                 message: "Lỗi trong quá trình xử lí",
//               });
//           }

//           // Cập nhật mật khẩu mới trong database
//           const updatePasswordSql =
//             "UPDATE user SET password = ? WHERE userId = ?";
//           pool.query(updatePasswordSql, [hash, userId], (err, result) => {
//             if (err) {
//               console.log(err);
//               return res
//                 .status(500)
//                 .json({
//                   status_code: 500,
//                   type: "error",
//                   message: "Lỗi trong quá trình xử lí [Database]",
//                 });
//             }

//             return res.json({
//               status_code: 200,
//               type: "success",
//               message: "Đổi mật khẩu thành công",
//             });
//           });
//         });
//       });
//     };
//   }
