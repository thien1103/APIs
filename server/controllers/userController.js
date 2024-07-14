const { connection } = require("../configuration/dbConfig");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");


class User {
  //Controller cho API lấy, hiển thị thông tin người dùng
  GetUserInfo(req, res) {
    const userId = req.params.userId;

    // Truy vấn thông tin người dùng từ database
    const getUserSql =
      "SELECT phoneNumber, email, name, classStudy, sex, address, avatar, parent_name, parent_phone, parent_email, mother_name, mother_phone, mother_email FROM user WHERE userId = ?";
    connection.query(getUserSql, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      if (result.length === 0) {
        console.log(err);
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Lỗi người dùng không tồn tại",
        });
      }

      const user = result[0];

      // Truy vấn thông tin cha mẹ của người dùng
      const userInfo = {
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        classStudy: user.classStudy,
        sex: user.sex,
        address: user.address,
        avatar: user.avatar,
        mother: {
          name: user.mother_name,
          phoneNumber: user.mother_phone,
          email: user.mother_email,
        },
        father: {
          name: user.parent_name,
          phoneNumber: user.parent_phone,
          email: user.parent_email,
        },
      };

      return res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Thông tin người dùng",
        data: userInfo,
      });
    });
  }

  //Controller cho API lấy, hiển thị toàn bộ người dùng
  GetAllUserInfo(req, res) {
    // Truy vấn toàn bộ thông tin người dùng từ database
    const getAllUserSql = "SELECT * FROM user";
    connection.query(getAllUserSql, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      if (result.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Chưa có người dùng nào tồn tại",
        });
      }

      // Tạo một mảng mới để lưu trữ data
      const userInfo = result.map((item) => {
        const {
          phoneNumber,
          email,
          name,
          classStudy,
          sex,
          address,
          avatar,
          mother_name,
          mother_phone,
          mother_email,
          parent_name,
          parent_phone,
          parent_email,
        } = item;
        return {
          phoneNumber: phoneNumber,
          email: email,
          name: name,
          classStudy: classStudy,
          sex: sex,
          address: address,
          avatar: avatar,
          mother: {
            name: mother_name,
            phoneNumber: mother_phone,
            email: mother_email,
          },
          father: {
            name: parent_name,
            phoneNumber: parent_phone,
            email: parent_email,
          },
        };
      });

      return res.status(200).json({
        status_code: 200,
        type: "success",
        data: userInfo,
      });
    });
  }

  // Controller for updating user information
  UpdateUserInfo(req, res) {
    const userId = req.params.userId;
    const {
      phoneNumber,
      email,
      name,
      classStudy,
      sex,
      address,
      mother,
      father,
    } = req.body;

    // Build the SQL query dynamically based on the fields provided in the request body
    let updateUserSql = "UPDATE user SET ";
    const updateParams = [];

    // Add the fields to be updated and their corresponding values to the query
    if (phoneNumber !== undefined) {
      updateUserSql += "phoneNumber = ?, ";
      updateParams.push(phoneNumber);
    }
    if (email !== undefined) {
      updateUserSql += "email = ?, ";
      updateParams.push(email);
    }
    if (name !== undefined) {
      updateUserSql += "name = ?, ";
      updateParams.push(name);
    }
    if (classStudy !== undefined) {
      updateUserSql += "classStudy = ?, ";
      updateParams.push(classStudy);
    }
    if (sex !== undefined) {
      updateUserSql += "sex = ?, ";
      updateParams.push(sex);
    }
    if (address !== undefined) {
      updateUserSql += "address = ?, ";
      updateParams.push(address);
    }
    if (mother !== undefined) {
      updateUserSql += "mother_name = ?, mother_phone = ?, mother_email = ?, ";
      updateParams.push(mother.name, mother.phoneNumber, mother.email);
    }
    if (father !== undefined) {
      updateUserSql += "parent_name = ?, parent_phone = ?, parent_email = ?, ";
      updateParams.push(father.name, father.phoneNumber, father.email);
    }

    // Remove the last comma from the SQL query
    updateUserSql = updateUserSql.slice(0, -2);
    updateUserSql += " WHERE userId = ?";
    updateParams.push(userId);

    connection.query(updateUserSql, updateParams, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Server error" });
      }

      if (result.affectedRows === 0) {
        console.log(err);
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Người dùng không tồn tại",
        });
      }

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
      console.log(err);
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
      // const publicPath = `/public/image/${filename}`;

      //Lưu ảnh với filePath vào file system
      fs.writeFileSync(filePath, imageData);

      // Query update lại trường avatar trong database sử dụng biến publicPath
      const updateAvatarSql = "UPDATE user SET avatar = ? WHERE userId = ?";
      connection.query(updateAvatarSql, [filename, userId], (err, result) => {
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
//     connection.query(checkUserSql, [userId], (err, result) => {
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
//           connection.query(updatePasswordSql, [hash, userId], (err, result) => {
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
