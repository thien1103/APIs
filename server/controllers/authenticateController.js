const {connection} = require('../configuration/dbConfig')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const salt = 10;



class Authentication {
  //Hàm đăng nhập Sign In
  SignIn(req, res, next) {
      const sql = (
          "(SELECT userId, phoneNumber, password, name FROM user WHERE phoneNumber = ?) " 
        //Trong trường hợp cần hợp data của 2 table
      //    "UNION " +
      //   "(SELECT idEmployee as id, fullname, email, password, NULL as role FROM employee WHERE email = ?)"
      
      );
      connection.query(sql, req.body.phoneNumber, (err, data) => {
          if (err) {
              console.log(err);
              return res.json({ Error: "Tài khoản không tồn tại" });
          }
          if (data.length > 0) {
              bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                  if (err) return res.json({ Error: "Có lỗi trong quá trình xử lí" });
                  if (response) {
                      const name = data[0].name;
                      const phoneNumber = data[0].phoneNumber;
                      const userId = data[0].userId;
                      console.log(name);
                      const token = jwt.sign({ name, phoneNumber, userId }, "jwt-secret-key", { expiresIn: '1d' });
                      return res.json({userId:data[0].userId, token, message: 'Đăng nhập thành công' })
                  } else {
                      return res.json({ passwordError: "Sai mật khẩu" });
                  }
              });
          }
      })
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
      const sql = `INSERT INTO user (phoneNumber, password, name) VALUES (?)`;
      bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
          if (err) return res.json({ Error: "Error for hashing password" });
          const values = [
              req.body.phoneNumber,
              hash,
              req.body.name,
          ]
          connection.query(sql, [values], (err, result) => {
              console.log("Phone Number: ", req.body.phoneNumber);
              console.log('Password: ', req.body.password);
              console.log("Hashed Password: ", hash);
              console.log("Name: ", req.body.name);

              if (err) {
                  console.log(err);
                  return res.json({ Error: "Đăng kí không thành công" });
              }
              
              else {
                const userId = result.insertId;
                return res.json({ userId, Status: "Đăng kí thành công" });
              }
          })
      })
  }

  //Hàm đăng xuất
  logoutExecute(req, res, next) {
      try { 
          res.clearCookie('token');
          console.log("Cookie is cleared");

          return res.json({ Status: "Success" });
      } catch (error) {
          console.error("Error during logout:", error);
          return res.json({ Error: "Error Logout" });
      }
  }
  
  //Hàm chỉ định verify cho token
  showVerifyUser(req, res) {
    return res.json({ Status: "Success", name: req.name, phoneNumber: req.phoneNumber, userId: req.userId });
}

//Hàm đổi mật khẩu
ChangePassword(req, res) {
  const { userId, oldPassword, newPassword } = req.body;

  // Kiểm tra xem userId có tồn tại trong database không
  const checkUserSql = 'SELECT * FROM user WHERE userId = ?';
  connection.query(checkUserSql, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Lỗi: Không thể thay đổi mật khẩu, vui lòng thử lại sau' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Lỗi: Người dùng không tồn tại' });
    }

    const user = result[0];

    // Kiểm tra mật khẩu cũ
    bcrypt.compare(oldPassword, user.password, (err, match) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Lỗi [Unfound Password]: Không thể thay đổi mật khẩu, vui lòng thử lại sau' });
      }

      if (!match) {
        return res.status(401).json({ error: 'Lỗi: Mật khẩu cũ không đúng' });
      }

      // Mã hóa mật khẩu mới
      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Lỗi [Encrypt]: Không thể thay đổi mật khẩu, vui lòng thử lại sau' });
        }

        // Cập nhật mật khẩu mới trong database
        const updatePasswordSql = 'UPDATE user SET password = ? WHERE userId = ?';
        connection.query(updatePasswordSql, [hash, userId], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Lỗi [Database]: Không thể thay đổi mật khẩu trong, vui lòng thử lại sau' });
          }

          return res.json({ message: 'Đổi mật khẩu thành công' });
        });
      });
    });
  });
}

}
module.exports = new Authentication;