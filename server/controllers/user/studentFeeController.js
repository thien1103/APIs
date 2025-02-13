const { pool } = require("../../configuration/dbConfig");

class StudentFee {
  GetStudentFeeByUserID(req, res) {
    const sql = `
      SELECT 
        k.khoi, 
        k.lop, 
        k.id_khoan, 
        k.id_hs, 
        k.ngay_khoi_tao, 
        k.tien_phai_tra, 
        k.tien_da_tra, 
        t.ma_hd
      FROM 
        khoan_apdung_hs AS k 
      INNER JOIN 
        thu_tien_hoc_phi AS t 
      ON 
        k.id_hs = t.id_hs 
      INNER JOIN
        enrollment_records as er
      ON 
        t.id_hs = er.id
      INNER JOIN 
        Role_PHHS AS rp
      ON
        er.id = rp.id_hs
      INNER JOIN
        users as u
      ON
        rp.id_ph = u.id
      WHERE 
        u.id = ?
    `;

    pool.query(sql, [req.params.userId], (error, results) => {
      if (error) {
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: error.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "No records found.",
        });
      }

      const response = {};
      let fetchCount = results.length;

      results.forEach((studentFee) => {
        const classQuery = `SELECT name FROM class WHERE id = ?`;
        const khoanQuery = `SELECT ten_khoan FROM quan_ly_khoan WHERE id = ?`;
        const enrollmentQuery = `SELECT name FROM enrollment_records WHERE id = ?`;

        pool.query(classQuery, [studentFee.lop], (classError, classResult) => {
          if (classError) {
            return res.status(500).json({
              status_code: 500,
              type: "error",
              message: classError.message,
            });
          }
          const lop_name = classResult.length > 0 ? classResult[0].name : null;

          pool.query(
            khoanQuery,
            [studentFee.id_khoan],
            (khoanError, khoanResult) => {
              if (khoanError) {
                return res.status(500).json({
                  status_code: 500,
                  type: "error",
                  message: khoanError.message,
                });
              }
              const khoan_name =
                khoanResult.length > 0 ? khoanResult[0].ten_khoan : null;

              pool.query(
                enrollmentQuery,
                [studentFee.id_hs],
                (enrollmentError, enrollmentResult) => {
                  if (enrollmentError) {
                    return res.status(500).json({
                      status_code: 500,
                      type: "error",
                      message: enrollmentError.message,
                    });
                  }
                  const id_hs_name =
                    enrollmentResult.length > 0
                      ? enrollmentResult[0].name
                      : null;

                  if (!response[id_hs_name]) {
                    response[id_hs_name] = {
                      hs_name: id_hs_name, // Student name
                      ma_hd: studentFee.ma_hd, // Contract code
                      lop_name, // Class name
                      ngay_khoi_tao: studentFee.ngay_khoi_tao, // Creation date
                      khoan: [], // List of fees
                      tong_tien_phai_tra: 0, // Total of tien_phai_tra
                      tong_tien_da_tra: 0, // Total of tien_da_tra
                    };
                  }

                  // Add the khoan details
                  response[id_hs_name].khoan.push({
                    khoan_name,
                    tien_phai_tra: studentFee.tien_phai_tra,
                    tien_da_tra: studentFee.tien_da_tra,
                  });

                  // Accumulate totals
                  response[id_hs_name].tong_tien_phai_tra +=
                    studentFee.tien_phai_tra;
                  response[id_hs_name].tong_tien_da_tra += studentFee.tien_da_tra;

                  fetchCount--;
                  if (fetchCount === 0) {
                    // Calculate tong_tien as the difference
                    Object.values(response).forEach((student) => {
                      student.tong_tien_final =
                        student.tong_tien_phai_tra - student.tong_tien_da_tra;
                    
                    });

                    const finalResponse = Object.values(response);
                    return res.status(200).json({
                      status_code: 200,
                      type: "success",
                      data: finalResponse,
                    });
                  }
                }
              );
            }
          );
        });
      });
    });
  }
}

module.exports = new StudentFee();
