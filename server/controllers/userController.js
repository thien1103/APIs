const {connection} = require('../configuration/dbConfig')


class User {
  //Controller cho API lấy, hiển thị thông tin người dùng
  GetUserInfo(req, res) {
    const userId = req.params.userId;

    // Truy vấn thông tin người dùng từ database
    const getUserSql =
      "SELECT phoneNumber, email, name, classStudy, sex, address, parent_name, parent_phone, parent_email, mother_name, mother_phone, mother_email FROM user WHERE userId = ?";
    connection.query(getUserSql, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({
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

      return res
        .status(200)
        .json({
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
    const getAllUserSql =
      "SELECT * FROM user";
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

  //Controller cho API cập nhật thông tin người dùng
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

    // function/querry Cập nhật thông tin người dùng
    const updateUserSql = `
          UPDATE user SET phoneNumber = ?, email = ?, name = ?, classStudy = ?, sex = ?, address = ?, mother_name = ?, mother_phone = ?, mother_email = ?, parent_name = ?, parent_phone = ?, parent_email = ? WHERE userId = ? `;
    const updateParams = [
      phoneNumber,
      email,
      name,
      classStudy,
      sex,
      address,
      mother.name,
      mother.phoneNumber,
      mother.email,
      father.name,
      father.phoneNumber,
      father.email,
      userId,
    ];

    connection.query(updateUserSql, updateParams, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({
            status_code: 404,
            type: "error",
            message: "Người dùng không tồn tại",
          });
      }

      return res
        .status(200)
        .json({
          status_code: 200,
          type: "success",
          message: "Thông tin người dùng đã được cập nhật thành công",
        });
    });
  }
}

module.exports = new User;