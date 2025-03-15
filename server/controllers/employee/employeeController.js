const { pool } = require("../../configuration/dbConfig");
const fs = require("fs");
const path = require("path");
const { unserialize } = require("php-serialize");


class Employee {
  //Controller cho API lấy, hiển thị thông tin người dùng
  GetEmployeeInfo(req, res) {
    const employeeId = req.params.employeeId;  // Use params to get the employeeId from URL
    
    const getEmployeeSql = `SELECT 
        nv.ma_nv, 
        nv.hinh_anh, 
        nv.ho, 
        nv.ten, 
        nv.gioitinh, 
        nv.ngay_sinh, 
        nv.dien_thoai, 
        nv.email,
        nv.dia_chi, 
        nv.chuc_vu,
        nv.chuyen_mon 
    FROM nhan_vien nv
    WHERE nv.ma_nv = ?`;  // Correct parameterized query

    pool.query(getEmployeeSql, [employeeId], (err, employeeResult) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status_code: 500,
                type: "error",
                message: "Lỗi server",
            });
        }

        if (employeeResult.length === 0) {
            return res.status(404).json({
                status_code: 404,
                type: "error",
                message: "Người dùng không tồn tại",
            });
        }

        const employee = employeeResult[0];
        let employeeInfo = {
            id: employee.ma_nv,
            avatar: employee.hinh_anh,
            name: employee.ho + " " + employee.ten,
            email: employee.email,
            sex: employee.gioitinh,
            address: employee.dia_chi,
            phoneNumber: employee.dien_thoai,
            ngay_sinh: employee.ngaysinh,
            chuc_vu: employee.chuc_vu,
            chuyen_mon: employee.chuyen_mon,
        };

        return res.status(200).json({
            status_code: 200,
            type: "success",
            message: "Thông tin người dùng",
            data: employeeInfo,
        });
    });
}



GetEmployeeByEnrollmentID(req, res) {
  const { enrollmentId } = req.body;

  // Step 1: Retrieve the class from enrollment_records based on enrollmentId
  const getClassSql = 'SELECT id_class FROM enrollment_records WHERE id = ?';
  pool.query(getClassSql, [enrollmentId], (err, classResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status_code: 500,
        type: "error",
        message: "Lỗi server khi lấy thông tin lớp học",
      });
    }

    if (classResult.length === 0) {
      return res.status(404).json({
        status_code: 404,
        type: "error",
        message: "Không tìm thấy thông tin đăng ký",
      });
    }

    const classId = classResult[0].id_class;
    console.log("class id giao vien: ",classId);


    // Step 2: Retrieve the serialized teacher IDs from class_teacher
    const getClassTeacherSql = 'SELECT id_giaovien FROM class_teacher WHERE id_class = ?';
    pool.query(getClassTeacherSql, [classId], (err, ctResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Lỗi server khi lấy thông tin giáo viên lớp",
        });
      }

      if (ctResult.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Lớp học không có giáo viên được chỉ định",
        });
      }

      const idGiaovienSerialized = ctResult[0].id_giaovien;
      let idGiaovienArray;
      try {
        // Step 3: Deserialize the PHP-serialized string to get teacher IDs array
        idGiaovienArray = unserialize(idGiaovienSerialized);
        console.log("deserialized giao vien: ",idGiaovienArray);


      } catch (e) {
        console.log(e);
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Lỗi xử lý dữ liệu giáo viên",
        });
      }

      // Ensure the deserialized data is an array
      if (!Array.isArray(idGiaovienArray)) {
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Định dạng dữ liệu giáo viên không hợp lệ",
        });
      }

      if (idGiaovienArray.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Không có giáo viên nào được chỉ định cho lớp học này",
        });
      }


      // Step 4: Retrieve employee details based on deserialized teacher IDs
      const getEmployeeSql = `
        SELECT 
          ma_nv, 
          hinh_anh, 
          ho, 
          ten, 
          gioitinh, 
          ngay_sinh, 
          dien_thoai, 
          email,
          dia_chi, 
          chuc_vu,
          chuyen_mon 
        FROM nhan_vien 
        WHERE ma_nv IN (?);
      `;

      pool.query(getEmployeeSql, [idGiaovienArray], (err, employeeResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server khi lấy thông tin nhân viên",
          });
        }

        if (employeeResult.length === 0) {
          return res.status(404).json({
            status_code: 404,
            type: "error",
            message: "Không tìm thấy thông tin nhân viên",
          });
        }

        // Map the results to the desired format
        const employees = employeeResult.map(employee => ({
          id: employee.ma_nv,
          avatar: employee.hinh_anh,
          name: `${employee.ho} ${employee.ten}`,
          email: employee.email,
          sex: employee.gioitinh,
          address: employee.dia_chi,
          phoneNumber: employee.dien_thoai,
          ngay_sinh: employee.ngay_sinh,
          chuc_vu: employee.chuc_vu,
          chuyen_mon: employee.chuyen_mon,
        }));

        return res.status(200).json({
          status_code: 200,
          type: "success",
          message: "Thông tin giáo viên",
          data: employees,
        });
      });
    });
  });
}


GetClassNamesByClassIDs(req, res) {
  const { classIds } = req.body; // Expecting an array of class IDs

  if (!Array.isArray(classIds) || classIds.length === 0) {
    return res.status(400).json({
      status_code: 400,
      type: "error",
      message: "Invalid or empty classIds array",
    });
  }

  // Query to fetch class names based on class IDs
  const getClassNamesSql = `SELECT name FROM class WHERE id IN (?)`;

  pool.query(getClassNamesSql, [classIds], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status_code: 500,
        type: "error",
        message: "Lỗi server khi lấy thông tin lớp học",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        status_code: 404,
        type: "error",
        message: "Không tìm thấy thông tin lớp học",
      });
    }

    // Extract class names into a single array
    const classNames = result.map(cls => cls.name);

    return res.status(200).json({
      status_code: 200,
      type: "success",
      message: "Thông tin lớp học",
      class_names: classNames, // Return as a single array field
    });
  });
}



  UpdateEmployeeInfo(req, res) {
    const employeeId = req.params.employeeId; // Employee ID from the route parameters
    const { avatar, name, sex, phoneNumber, email, address, ngaySinh, chucVu, chuyenMon } = req.body;
  
    if (!employeeId) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Missing employee ID",
      });
    }
  
    // Build the SQL query dynamically based on the fields provided in the request body
    let updateEmployeeSql = "UPDATE nhan_vien nv SET ";
    const updateParams = [];
  
    if (avatar !== undefined) {
      updateEmployeeSql += "nv.hinh_anh = ?, ";
      updateParams.push(avatar);
    }
    if (name !== undefined) {
      const [ho, ...tenParts] = name.split(" "); // Split full name into first name and last name
      const ten = tenParts.join(" ");
      updateEmployeeSql += "nv.ho = ?, nv.ten = ?, ";
      updateParams.push(ho, ten);
    }
    if (sex !== undefined) {
      updateEmployeeSql += "nv.gioitinh = ?, ";
      updateParams.push(sex === "Nam" ? 1 : 0); // Assuming "Nam" is male (1), otherwise female (0)
    }
    if (phoneNumber !== undefined) {
      updateEmployeeSql += "nv.dien_thoai = ?, ";
      updateParams.push(phoneNumber);
    }
    if (email !== undefined) {
      updateEmployeeSql += "nv.email = ?, ";
      updateParams.push(email);
    }
    if (address !== undefined) {
      updateEmployeeSql += "nv.dia_chi = ?, ";
      updateParams.push(address);
    }
    if (ngaySinh !== undefined) {
      updateEmployeeSql += "nv.ngaysinh = ?, ";
      updateParams.push(ngaySinh);
    }
    if (chucVu !== undefined) {
      updateEmployeeSql += "nv.chuc_vu = ?, ";
      updateParams.push(chucVu);
    }
    if (chuyenMon !== undefined) {
      updateEmployeeSql += "nv.chuyen_mon = ?, ";
      updateParams.push(chuyenMon);
    }
  
    // Update the field `updated_at`
    const updated_at = new Date();
    updateEmployeeSql += "nv.updated_at = ? ";
    updateParams.push(updated_at);
  
    // Add the WHERE clause for the employee update
    updateEmployeeSql += "WHERE nv.ma_nv = ?";
    updateParams.push(employeeId);
  
    // Execute the update query
    pool.query(updateEmployeeSql, updateParams, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Server error",
        });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Employee not found",
        });
      }
  
      // Update was successful
      return res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Employee information updated successfully",
      });
    });
  }
  

  //Hàm xử lí thay đổi avatar cá nhân
  ChangeAvatar(req, res) {
    const employeeId = req.params.employeeId;
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
      const filename = `employee-${employeeId}-avatar.jpg`;
      const filePath = path.join("public", "image", filename);

      // Lưu ảnh với filePath vào file system
      fs.writeFileSync(filePath, imageData);

      // Query update lại trường avatar trong database sử dụng biến publicPath
      const updateAvatarSql = "UPDATE nhan_vien SET hinh_anh = ? WHERE ma_nv = ?";
      pool.query(updateAvatarSql, [filename, employeeId], (err, result) => {
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
  GetEmployeeAvatar(req, res) {
    const { filename } = req.params;
    const imagePath = path.resolve(
      __dirname,
      "..",
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

module.exports = new Employee();

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