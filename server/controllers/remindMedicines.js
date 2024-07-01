const { connection } = require("../configuration/dbConfig");
const moment = require ("moment");


class remindMedicines {
  // Hàm tạo Remind Medicines
  CreateRemindMedicines(req, res) {
    const { content, sickName, dateRangeList, startDate, endDate, status } =
      req.body;

    // Exception cho data không hợp lệ
    if (
      !content ||
      !sickName ||
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
    const created = new Date();

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
    const query =
      "INSERT INTO remindMedicines (content, sickName, startDate, endDate, createdDate, status) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(
      query,
      [content, sickName, start, end, created, statusValue],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ status_code: 500, type: "error", message: "Lỗi server" });
        }

        // Query insert vào table date_ranges_remind_med
        const insertDateRangeQuery =
          "INSERT INTO date_ranges_remind_med (remindId, date, morningSession, afternoonSession) VALUES (?, ?, ?, ?)";
        const remindId = result.insertId;
        const promises = dateRangeList.map(({ date, session }) => {
          const { morning, afternoon } = session;
          return new Promise((resolve, reject) => {
            connection.query(
              insertDateRangeQuery,
              [remindId, date, morning, afternoon],
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

  //Hàm lấy tất cả remind medicines
  GetAllRemindMedicines(req, res) {
    try {
      const query = `
                SELECT 
                  r.remindId, 
                  r.content, 
                  r.sickName,
                  r.startDate, 
                  r.endDate, 
                  r.createdDate,
                  dr.date, 
                  dr.morningSession, 
                  dr.afternoonSession
                FROM remindMedicines r
                LEFT JOIN date_ranges_remind_med dr ON r.remindId = dr.remindId
              `;

      connection.query(query, (err, results) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ status_code: 500, type: "error", message: "Lỗi server" });
        }

        // Định dạng format json
        const remindMedicines = results.reduce((acc, row) => {
          const {
            remindId,
            content,
            sickName,
            startDate,
            endDate,
            createdDate,
            date,
            morningSession,
            afternoonSession,
          } = row;
          const existingRemind = acc.find((r) => r.remindId === remindId);

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
              remindId,
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
    const { remindId } = req.params;

    // Query lấy remind medicines bằng remindId
    const query = `
                SELECT 
                  r.remindId, 
                  r.content, 
                  r.sickName,
                  r.startDate, 
                  r.endDate, 
                  r.createdDate,
                  dr.date, 
                  dr.morningSession, 
                  dr.afternoonSession
                FROM remindMedicines r
                LEFT JOIN date_ranges_remind_med dr ON r.remindId = dr.remindId WHERE remindId = ?
              `;
    connection.query(query, [remindId], (err, result) => {
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
          message: "Remind Medicines không tồn tại",
        });
      }

      // Định dạng format json
      const remindMedicines = results.reduce((acc, row) => {
        const {
          remindId,
          content,
          sickName,
          startDate,
          endDate,
          createdDate,
          date,
          morningSession,
          afternoonSession,
        } = row;
        const existingRemind = acc.find((r) => r.remindId === remindId);

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
            remindId,
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
          });
        }

        return acc;
      }, []);

      res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Thông tin lời nhắc",
        data: remindMedicines,
      });
    });
  }

  //Hàm Update lời nhắc
  UpdateRemindMedicines(req, res) {
    const { remindId } = req.params;
    const { content, sickName, dateRangeList, startDate, endDate } = req.body;
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    try {
      //Hàm update trong remind med
      connection.query(
        "UPDATE remindMedicines SET content = ?, sickName = ?, startDate = ?, endDate = ? WHERE remindId = ?",
        [content, sickName, formattedStartDate, formattedEndDate, remindId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ status_code: 500, type: "error", message: "Lỗi Server" });
          }

          if (result.affectedRows === 0) {
            return res
              .status(404)
              .json({
                status_code: 404,
                type: "error",
                message: "Lời nhắc không tồn tại",
              });
          }

          // Hàm update trong table date_ranges_remind_med
          const updatePromises = dateRangeList.map(({ date, session }) => {
            return new Promise((resolve, reject) => {
              connection.query(
                "UPDATE date_ranges_remind_med SET morningSession = ?, afternoonSession = ? WHERE remindId = ? AND date = ?",
                [session.morning, session.afternoon, remindId, date],
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
              res
                .status(200)
                .json({
                  status_code: 200,
                  type: "success",
                  message: "Lời nhắc đã được cập nhật",
                });
            })
            .catch((err) => {
              console.error(err);
              res
                .status(500)
                .json({
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
      connection.query("START TRANSACTION", (err, result) => {
        connection.query(
          "DELETE FROM date_ranges_remind_med WHERE remindId = ?",
          [remindId],
          (err, dateRangesResult) => {
            connection.query(
              "DELETE FROM remindMedicines WHERE remindId = ?",
              [remindId],
              (err, remindResult) => {
                if (
                  dateRangesResult.affectedRows === 0 &&
                  remindResult.affectedRows === 0
                ) {
                  return res.status(404).json({
                    status_code: 404,
                    type: "error",
                    message: "Không tìm thấy yêu cầu xin nghỉ phép",
                  });
                }
                connection.query("COMMIT", (err, result) => {
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
