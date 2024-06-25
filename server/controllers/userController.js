const {connection} = require('../configuration/dbConfig')


class User{
    //Controller cho API lấy, hiển thị thông tin người dùng
    GetUserInfo(req, res) {
        const userId = req.params.userId;
      
        // Truy vấn thông tin người dùng từ database
        const getUserSql = 'SELECT phoneNumber, email, name, sex, address, parent_name, parent_phone, parent_email, mother_name, mother_phone, mother_email FROM user WHERE userId = ?';
        connection.query(getUserSql, [userId], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
          }
      
          if (result.length === 0) {
            return res.status(404).json({status_code: 404, type:"error", message:"Lỗi người dùng không tồn tại"});
          }
      
          const user = result[0];
      
          // Truy vấn thông tin cha mẹ của người dùng
            const userInfo = {
              phoneNumber: user.phoneNumber,
              email: user.email,
              name: user.name,
              sex: user.sex,
              address: user.address,
              mother: {
                name: user.mother_name,
                phoneNumber: user.mother_phone,
                email: user.mother_email
              },
              father: {
                name: user.parent_name,
                phoneNumber: user.parent_phone,
                email: user.parent_email
              }
            };
      
            return res.status(200).json({status_code: 200, type:"success", message:"Thông tin người dùng", data: userInfo});
          });
      }

      //Controller cho API cập nhật thông tin người dùng
      UpdateUserInfo(req, res) {
        const userId = req.params.userId;
        const {
          phoneNumber,
          email,
          name,
          sex,
          address,
          mother,
          father
        } = req.body;
      
        // function/querry Cập nhật thông tin người dùng
        const updateUserSql = `
          UPDATE user SET phoneNumber = ?, email = ?, name = ?, sex = ?, address = ?, mother_name = ?, mother_phone = ?, mother_email = ?, parent_name = ?, parent_phone = ?, parent_email = ? WHERE userId = ? `;
        const updateParams = [
          phoneNumber,
          email,
          name,
          sex,
          address,
          mother.name,
          mother.phone,
          mother.email,
          father.name,
          father.phone,
          father.email,
          userId
        ];
      
        connection.query(updateUserSql, updateParams, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
          }
      
          if (result.affectedRows === 0) {
            return res.status(404).json({status_code: 404, type:"error", message:"Người dùng không tồn tại"});
          }
      
          return res.status(200).json({status_code: 200, type:"success", message:"Thông tin người dùng đã được cập nhật thành công"});
        });
      }

    }

module.exports = new User;