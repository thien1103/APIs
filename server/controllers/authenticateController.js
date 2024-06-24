const {connection} = require('../configuration/dbConfig')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const salt = 10;




class Authentication {
  //Hàm đăng nhập Sign In
  SignIn(req, res, next) {
    const sql = "SELECT userId, phoneNumber, password, name FROM user WHERE phoneNumber = ?";
    connection.query(sql, [req.body.phoneNumber], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
      }

      if (data.length === 0) {
        return res.status(404).json({status_code: 404, type:"error", message:"Người dùng không tồn tại"});
      }

      bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
        if (err) {
          return res.status(500).json({status_code: 500, type:"error", message:"Có lỗi trong quá trình xử lí"});
        }

        if (!response) {
          return res.status(401).json({status_code: 401, type:"error", message:"Sai mật khẩu"});
        }

        const payload = { userId: data[0].userId };

        // Ensure to use the same secret key
        const token = jwt.sign(payload, "jwt-secret-key", { algorithm: 'HS256', expiresIn: '10m' });
        return res.status(200).json({ statuts_code: 200, type: "success", message: 'Đăng nhập thành công', data:{userId: data[0].userId, token}});
      });
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

  //Hàm đăng kí Sign Up
  SignUp(req, res) {
    const sql = `INSERT INTO user (phoneNumber, password, name, email, sex, address, parent_name, parent_phone, parent_email, mother_name, mother_phone, mother_email) VALUES (?)`;
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) {
            return res.status(500).json({status_code: 500, type:"error", message:"Lỗi trong quá trình xử lí"});
        }
        const values = [
            req.body.phoneNumber,
            hash,
            req.body.name,
            req.body.email,
            req.body.sex,
            req.body.address,
            req.body.parent_name,
            req.body.parent_phone,
            req.body.parent_email,
            req.body.mother_name,
            req.body.mother_phone,
            req.body.mother_email
        ]
        connection.query(sql, [values], (err, result) => {
            console.log("Phone Number: ", req.body.phoneNumber);
            console.log('Password: ', req.body.password);
            console.log("Hashed Password: ", hash);
            console.log("Name: ", req.body.name);
            console.log("Email: ", req.body.email);
            console.log("Sex: ", req.body.sex);
            console.log("Address: ", req.body.address);
            console.log("Father Name: ", req.body.parent_name);
            console.log("Father Phone: ", req.body.parent_phone);
            console.log("Father Email: ", req.body.parent_email);
            console.log("Mother Name: ", req.body.mother_name);
            console.log("Mother Phone: ", req.body.mother_phone);
            console.log("Mother Email: ", req.body.mother_email);

            if (err) {
                console.log(err);
                return res.status(400).json({status_code: 400, type:"error", message:"Đăng kí không thành công"});
            } else {
                const userId = result.insertId;
                return res.status(201).json({status_code: 201, type:"success", message:"Đăng kí thành công"});
            }
        })
    })
}

  //Hàm đăng xuất
  async logoutExecute(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
  
      // Extract the token from the Authorization header
      const token = authorizationHeader.split(' ')[1];
        // Clear cookie
        res.clearCookie('token');
        console.log("Cookie is cleared");
        // Trả về thành công
        return res.json({ status_code: 200, type: "success", message: "Đăng xuất thành công" });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.json({ status_code: 500, type: "error", message: "Lỗi server" });
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
  const checkUserSql = 'SELECT * FROM user WHERE userId = ?';
  connection.query(checkUserSql, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({status_code: 500, type:"error", message:"Lỗi không thể thay đổi mật khẩu. Vui lòng thử lại sao"});
    }

    if (result.length === 0) {
      return res.status(404).json({status_code: 404, type:"error", message:"Lỗi người dùng không tồn tại"});
    }

    const user = result[0];

    // Kiểm tra mật khẩu cũ
    bcrypt.compare(oldPassword, user.password, (err, match) => {
      if (err) {
        console.log(err);
        return res.status(500).json({status_code: 500, type:"error", message:"Lỗi trong quá trình xử lí"});
      }

      if (!match) {
        return res.status(401).json({status_code: 401, type:"error", message:"Mật khẩu cũ không đúng"});
      }

      // Mã hóa mật khẩu mới
      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).json({status_code: 500, type:"error", message:"Lỗi trong quá trình xử lí"});
        }

        // Cập nhật mật khẩu mới trong database
        const updatePasswordSql = 'UPDATE user SET password = ? WHERE userId = ?';
        connection.query(updatePasswordSql, [hash, userId], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({status_code: 500, type:"error", message:"Lỗi trong quá trình xử lí [Database]"});
          }

          return res.json({status_code: 200, type:"success", message:"Đổi mật khẩu thành công"});
        });
      });
    });
  });
}

}
module.exports = new Authentication;