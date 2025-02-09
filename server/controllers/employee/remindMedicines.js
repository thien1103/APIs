const { pool } = require("../../configuration/dbConfig");
const moment = require ("moment");


class remindMedicines {
  
  //Hàm lấy tất cả remind medicines cho employee
  GetAllRemindMedicinesForEmployee(req, res) {
    try {
      const { teacherClasses } = req.body;

      // Validate and sanitize input
      const sanitizedClasses = teacherClasses 
        ? teacherClasses.map(Number).filter(Boolean)
        : [];
        
      if (sanitizedClasses.length === 0) {
        return res.status(400).json({
          status_code: 400,
          type: "error",
          message: "Danh sách lớp học không hợp lệ"
        });
      }

      // Create safe parameterized query
      const placeholders = sanitizedClasses.map(() => '?').join(',');
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
        INNER JOIN users u ON ru.userId = u.id
        INNER JOIN Role_PHHS rp ON u.id = rp.id_ph
        INNER JOIN enrollment_records er ON rp.id_hs = er.id
        WHERE er.id_class IN (${placeholders})
      `;

      // Execute query with sanitized parameters
      pool.query(sql, sanitizedClasses, (err, results) => {
        if (err) {
          console.error('SQL Error:', err.sql); // Log actual executed SQL
          return res.status(500).json({ 
            status_code: 500, 
            type: "error", 
            message: "Lỗi database" 
          });
        }
  
        // Formatting JSON response
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
  
          // Format boolean to text for status
          let statusText = status === 1 ? "Xác nhận" : "Chưa xác nhận";
  
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
      res.status(500).json({ status_code: 500, type: "error", message: "Lỗi server" });
    }
  }

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
        u.name AS parent_name,
        er.name AS student_name
      FROM remindMedicines r
      LEFT JOIN date_ranges_remind_med dr ON r.id = dr.remindId
      LEFT JOIN remindMedicines_user re ON r.id = re.remindId
      INNER JOIN users u ON re.userId = u.id
      INNER JOIN Role_PHHS rp ON u.id = rp.id_ph
      INNER JOIN enrollment_records er ON rp.id_hs = er.id
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
        parent_name,
        student_name
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
        parent_name,
        student_name,
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
      pool.query("START TRANSACTION", (err, result) => {
        pool.query(
          "DELETE FROM date_ranges_remind_med WHERE remindId = ?",
          [remindId],
          (err, dateRangesResult) => {
            pool.query(
              "DELETE FROM remindMedicines WHERE id = ?",
              [remindId],
              (err, remindResult) => {
                if (
                  dateRangesResult.affectedRows === 0 &&
                  remindResult.affectedRows === 0
                ) {
                  return res.status(404).json({
                    status_code: 404,
                    type: "error",
                    message: "Không tìm thấy lời nhắc uống thuốc",
                  });
                }
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
                    message: "Lời nhắc đã được xóa",
                  });
                });
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
