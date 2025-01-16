const { pool } = require("../../configuration/dbConfig");
const moment = require ("moment");


class remindMedicines {
  // Hàm tạo Remind Medicines
  CreateRemindMedicines(req, res) {
    const { content, sickName, dateRangeList, startDate, endDate, status, userId } =
      req.body;
  
    // Validate missing fields
    if (
      !content ||
      !sickName ||
      !dateRangeList ||
      !startDate ||
      !endDate ||
      status === undefined ||
      !userId
    ) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
    const created = new Date();
  
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
  
    // Insert into remindMedicines
    const sql =
      "INSERT INTO remindMedicines (content, sickName, startDate, endDate, createdDate, status) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(
      sql,
      [content, sickName, start, end, created, statusValue],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ status_code: 500, type: "error", message: "Lỗi server" });
        }
  
        const remindId = result.insertId;
  
        // Insert into remindMedicines_enrollment table
        const insertEnrollmentQuery =
          "INSERT INTO remindMedicines_user(remindId, userId) VALUES (?, ?)";
        pool.query(
          insertEnrollmentQuery,
          [remindId, userId],
          (err) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ status_code: 500, type: "error", message: "Lỗi server" });
            }
  
            const insertDateRangeQuery =
              "INSERT INTO date_ranges_remind_med (remindId, date, morningSession, afternoonSession) VALUES (?, ?, ?, ?)";
            const promises = dateRangeList.map(({ date, session }) => {
              const { morning, afternoon } = session;
              return new Promise((resolve, reject) => {
                pool.query(
                  insertDateRangeQuery,
                  [remindId, date, morning, afternoon],
                  (err) => {
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
                  message: "Lời nhắc đã được gửi đi",
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
    );
  }
  

  //Hàm lấy tất cả remind medicines
  GetAllRemindMedicinesForUser(req, res) {
    const {userId} = req.body;
    try {
      const sql = `
                SELECT 
                  r.id, 
                  r.content, 
                  r.sickName,
                  r.startDate, 
                  r.endDate, 
                  r.createdDate,
                  r.status,
                  dr.date, 
                  dr.morningSession, 
                  dr.afternoonSession
                FROM remindMedicines r
                LEFT JOIN date_ranges_remind_med dr ON r.id = dr.remindId
                INNER JOIN remindMedicines_user ru ON r.id = ru.remindId
                WHERE userId = ?
              `;

      pool.query(sql, [userId], (err, results) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ status_code: 500, type: "error", message: "Lỗi server" });
        }

        // Định dạng format json
        const remindMedicines = results.reduce((acc, row) => {
          const {
            id,
            content,
            sickName,
            startDate,
            endDate,
            createdDate,
            status,
            date,
            morningSession,
            afternoonSession,
          } = row;

          //Định dạng từ boolean ra text cho status
          let statusText;
          if (status === 1) {
            statusText = "Xác nhận";
          } else {
            statusText = "Chưa xác nhận";
          }

          const existingRemind = acc.find((r) => r.id === id);

          if (existingRemind) {
            existingRemind.dateRangeList.push({
              date,
              session: {
                morning: morningSession === 1,
                afternoon: afternoonSession === 1,
              },
            });
          } else {
            acc.push({
              id,
              content,
              sickName,
              dateRangeList: [
                {
                  date,
                  session: {
                    morning: morningSession === 1,
                    afternoon: afternoonSession === 1,
                  },
                },
              ],
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              createdDate: createdDate.toISOString(),
              status: statusText,
            });
          }

          return acc;
        }, []);

        res.status(200).json({
          status_code: 200,
          type: "success",
          message: "Danh sách lời nhắc",
          data: remindMedicines,
        });
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status_code: 500, type: "error", message: "Lỗi server" });
    }
  }

  //Hàm lấy remind medicines cụ thể
GetDetailedRemindMedicines(req, res) {
  const { remindId } = req.params; // Use remindId as the parameter
  
    // Query to get the remind medicines
    const sql = `
      SELECT 
        r.id, 
        r.content, 
        r.sickName,
        r.startDate, 
        r.endDate, 
        r.createdDate,
        r.status,
        dr.date, 
        dr.morningSession, 
        dr.afternoonSession,

      FROM remindMedicines r
      LEFT JOIN date_ranges_remind_med dr ON r.id = dr.remindId
      LEFT JOIN remindMedicines_user re ON r.id = re.remindId
      WHERE r.id = ?
    `;
  
    pool.query(sql, [remindId], (err, result) => {
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
        sickName,
        startDate,
        endDate,
        createdDate,
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
        sickName,
        dateRangeList: [
          {
            date,
            session: {
              morning: morningSession === 1,
              afternoon: afternoonSession === 1,
            },
          },
        ],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdDate: createdDate.toISOString(),
        status: statusText,

      };
  
      res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Chi tiết lời nhắc",
        data: response,
      });
    });
}

  


  //Hàm update dặn thuốc
  UpdateRemindMedicines(req, res) {
    const { remindId } = req.params;
    const { content, sickName, dateRangeList, startDate, endDate } = req.body;
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");

    try {
      // Update the remindMedicines table
      pool.query(
        "UPDATE remindMedicines SET content = ?, sickName = ?, startDate = ?, endDate = ? WHERE id = ?",
        [content, sickName, formattedStartDate, formattedEndDate, remindId],
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
              message: "Lời nhắc không tồn tại",
            });
          }

          // Update the date_ranges_remind_med table
          const updatePromises = dateRangeList.map(({date, session }) => {
            const formattedDate = date;
            return new Promise((resolve, reject) => {
              pool.query(
                "UPDATE date_ranges_remind_med SET date = ?, morningSession = ?, afternoonSession = ? WHERE remindId = ?",
                [
                  formattedDate,
                  session.morning,
                  session.afternoon,
                  remindId,
                  formattedDate,
                ],
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
                message: "Lời nhắc đã được cập nhật",
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

  //Hàm xóa lời nhắc
  DeleteRemindMedicines(req, res) {
    const { remindId } = req.params;
    try {
      pool.query("START TRANSACTION", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server",
          });
        }
        
        // Step 1: Delete from date_ranges_remind_med
        pool.query(
          "DELETE FROM date_ranges_remind_med WHERE remindId = ?",
          [remindId],
          (err, dateRangesResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                status_code: 500,
                type: "error",
                message: "Lỗi server trong xóa date ranges",
              });
            }
  
            // Step 2: Delete from remindMedicines_user
            pool.query(
              "DELETE FROM remindMedicines_user WHERE remindId = ?",
              [remindId],
              (err, userResult) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({
                    status_code: 500,
                    type: "error",
                    message: "Lỗi server trong xóa user",
                  });
                }
  
                // Step 3: Delete from remindMedicines
                pool.query(
                  "DELETE FROM remindMedicines WHERE id = ?",
                  [remindId],
                  (err, remindResult) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({
                        status_code: 500,
                        type: "error",
                        message: "Lỗi server trong xóa lời nhắc",
                      });
                    }
  
                    // Check if any rows were deleted
                    if (
                      dateRangesResult.affectedRows === 0 &&
                      userResult.affectedRows === 0 &&
                      remindResult.affectedRows === 0
                    ) {
                      return res.status(404).json({
                        status_code: 404,
                        type: "error",
                        message: "Không tìm thấy lời nhắc uống thuốc",
                      });
                    }
  
                    // Step 4: Commit the transaction
                    pool.query("COMMIT", (err) => {
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
                        message: "Lời nhắc đã được xóa",
                      });
                    });
                  }
                );
              }
            );
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
}


module.exports = new remindMedicines();
