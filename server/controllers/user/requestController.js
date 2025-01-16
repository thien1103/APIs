const { pool } = require("../../configuration/dbConfig");
const moment = require("moment");

class Request {
  //Hàm tạo yêu cầu xin nghỉ
  AddLeaveRequest(req, res) {
    const { user_id, content, startDate, endDate, status, dateRangeList } =
      req.body;
    const title = "";
    // Exception cho data không hợp lệ
    if (
      !user_id ||
      !content ||
      !dateRangeList ||
      !startDate ||
      !endDate ||
      status === undefined
    ) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    // const created = new Date();

    // If để phân loại status trả về
    let statusValue;
    if (status === "Chưa xác nhận") {
      statusValue = 0;
    } else if (status === "Xác nhận") {
      statusValue = 1;
    } else {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Giá trị status trả về không hợp lệ",
      });
    }

    // Query insert vào table requests
    const sql =
      "INSERT INTO `leave` (user_id, content, title, startDateTime, endDateTime, status) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(
      sql,
      [user_id, content, title, start, end, statusValue],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ status_code: 500, type: "error", message: "Lỗi server" });
        }

        // Query insert vào table date_ranges_request
        const insertDateRangeQuery =
          "INSERT INTO date_ranges_request (requestId, date, morningSession, afternoonSession) VALUES (?, ?, ?, ?)";
        const requestId = result.insertId;
        const promises = dateRangeList.map(({ date, session }) => {
          const { morning, afternoon } = session;
          return new Promise((resolve, reject) => {
            pool.query(
              insertDateRangeQuery,
              [requestId, date, morning, afternoon],
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          });
        });

        Promise.all(promises)
          .then(() => {
            return res.status(200).json({
              status_code: 200,
              type: "success",
              message: "Yêu cầu xin nghỉ đã được gửi đi",
            });
          })
          .catch((err) => {
            console.error(err);
            return res
              .status(500)
              .json({ status_code: 500, type: "error", message: "Lỗi server" });
          });
      }
    );
  }

  //Hàm Update yêu cầu nghỉ phép
  UpdateLeaveRequest(req, res) {
    const { requestId } = req.params;
    const { content, dateRangeList, startDate, endDate } = req.body;
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    const title = "";
    try {
      //Hàm update trong requests
      pool.query(
        "UPDATE `leave` SET content = ?, title = ?, startDateTime = ?, endDateTime = ? WHERE id = ?",
        [
          content,
          title,
          formattedStartDate,
          formattedEndDate,
          requestId,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ status_code: 500, type: "error", message: "Lỗi Server" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              status_code: 404,
              type: "error",
              message: "Yêu cầu xin nghỉ phép không tồn tại",
            });
          }

          // Hàm update trong table date_ranges_request
          const updatePromises = dateRangeList.map(({ date, session }) => {
            return new Promise((resolve, reject) => {
              pool.query(
                "UPDATE date_ranges_request SET morningSession = ?, afternoonSession = ? WHERE requestId = ? AND date = ?",
                [session.morning, session.afternoon, requestId, date],
                (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          });

          Promise.all(updatePromises)
            .then(() => {
              res.status(200).json({
                status_code: 200,
                type: "success",
                message: "Yêu cầu của bạn đã được cập nhật",
              });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({
                status_code: 500,
                type: "error",
                message: "Lỗi Server",
              });
            });
        }
      );
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status_code: 500, type: "error", message: "Lỗi Server" });
    }
  }

  //Hàm xóa yêu cầu nghỉ phép
  DeleteLeaveRequest(req, res) {
    const { requestId } = req.params;
    try {
      pool.query("START TRANSACTION", (err, result) => {
        pool.query(
          "DELETE FROM date_ranges_request WHERE requestId = ?",
          [requestId],
          (err, dateRangesResult) => {
            if (dateRangesResult.affectedRows === 0) {
              return res.status(404).json({
                status_code: 404,
                type: "error",
                message: "Không tìm thấy yêu cầu xin nghỉ phép",
              });
            } else {
              pool.query(
                "DELETE FROM `leave` WHERE id = ?",
                [requestId],
                (err, requestResult) => {
                  if (requestResult.affectedRows === 0) {
                    return res.status(404).json({
                      status_code: 404,
                      type: "error",
                      message: "Không tìm thấy yêu cầu xin nghỉ phép",
                    });
                  } else {
                    pool.query("COMMIT", (err, result) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({
                          status_code: 500,
                          type: "error",
                          message: "Lỗi server",
                        });
                      }
                      res.status(200).json({
                        status_code: 200,
                        type: "success",
                        message: "Yêu cầu xin nghỉ đã được xóa",
                      });
                    });
                  }
                }
              );
            }
          }
        );
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status_code: 500, type: "error", message: "Lỗi server" });
    }
  }


  GetAllLeaveRequestsForUser(req, res) {
    const { userId } = req.params; // Get userId from request parameters
    try {
      // Check if the user exists
      const checkUserSql = "SELECT id FROM users WHERE id = ?";
  
      pool.query(checkUserSql, [userId], (err, userResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server",
          });
        }
  
        if (userResults.length === 0) {
          return res.status(404).json({
            status_code: 404,
            type: "error",
            message: "Người dùng không tồn tại",
          });
        }
  
        // If user exists, fetch leave requests
        const sql = `
          SELECT 
            l.id, 
            l.title, 
            l.content, 
            l.startDateTime, 
            l.endDateTime, 
            l.status,
            u.name AS username
          FROM \`leave\` l
          INNER JOIN users u ON l.user_id = u.id
          WHERE user_id = ?
        `;
  
        pool.query(sql, [userId], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              status_code: 500,
              type: "error",
              message: "Lỗi server",
            });
          }
  
          if (results.length === 0) {
            return res.status(404).json({
              status_code: 404,
              type: "error",
              message: "Chưa có yêu cầu xin nghỉ nào",
            });
          }
  
          // Get the username from the first result
          const username = results[0].username;
  
          // Formatting JSON response
          const leaveRequests = results.map(row => {
            const {
              id,
              title,
              content,
              startDateTime,
              endDateTime,
              status,
            } = row;
  
            // Format boolean to text for status
            const statusText = status === 1 ? "Đã duyệt" : "Chưa duyệt";
  
            return {
              id,
              title,
              content,
              startDateTime: startDateTime.toISOString(),
              endDateTime: endDateTime.toISOString(),
              status: statusText,
              username, // Include username in each request if needed
            };
          });
  
          return res.status(200).json({
            status_code: 200,
            type: "success",
            message: `Danh sách tất cả các yêu cầu xin nghỉ của người dùng ${username}`,
            data: leaveRequests,
          });
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status_code: 500,
        type: "error",
        message: "Lỗi server",
      });
    }
  }

  //Hàm lấy request chi tiết
  GetDetailedRemindMedicines(req, res) {
    const { requestId } = req.params; // Use remindId as the parameter
    
      // Query to get the remind medicines
      const sql = `
        SELECT 
          r.id, 
          r.content, 
          r.title,
          r.startDateTime, 
          r.endDateTime, 
          r.status,
          dr.date, 
          dr.morningSession, 
          dr.afternoonSession,
  
        FROM \'leave\' r
        LEFT JOIN date_ranges_request dr ON r.id = dr.requestId
        WHERE r.id = ?
      `;
    
      pool.query(sql, [requestId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server",
          });
        }
    
        if (result.length === 0) {
          return res.status(404).json({
            status_code: 404,
            type: "error",
            message: "Lời nhắc không tồn tại",
          });
        }
    
        // Format the response
        const {
          id,
          content,
          title,
          startDateTime,
          endDateTime,
          status,
          date,
          morningSession,
          afternoonSession,
        } = result[0]; // Use first result since the id is unique
    
        // Format boolean to text for status
        const statusText = status === 1 ? "Xác nhận" : "Chưa xác nhận";
    
        const response = {
          id,
          content,
          title,
          dateRangeList: [
            {
              date,
              session: {
                morning: morningSession === 1,
                afternoon: afternoonSession === 1,
              },
            },
          ],
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          status: statusText,
        };
    
        res.status(200).json({
          status_code: 200,
          type: "success",
          message: "Chi tiết xin nghỉ",
          data: response,
        });
      });
  }
}

module.exports = new Request();
