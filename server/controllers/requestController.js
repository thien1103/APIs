const {connection} = require('../configuration/dbConfig')
const moment = require('moment')

class Request{
  //Hàm tạo yêu cầu xin nghỉ
    AddLeaveRequest(req, res) {
        const { content, dateRangeList, startDate, endDate, createdDate } = req.body;

        //Exception cho data không được điền đầy đủ
        if ( !content || !dateRangeList || !startDate || !endDate || !createdDate) {
          return res.status(400).json({status_code: 400, type: "error", message: "Vui lòng nhập đầy đủ thông tin"});
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const created = new Date(createdDate);
        // const start = new Date(startDate).toISOString();
        // const end = new Date(endDate).toISOString();
        // const created = new Date(createdDate).toISOString();

        // Query insert vào table requests
        const query = 'INSERT INTO requests (content, startDate, endDate, createdDate) VALUES (?, ?, ?, ?)';
        connection.query(query, [content, start, end, created], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({status_code: 500, type: "error", message: "Lỗi server"});
          }

          //Query insert vào table date_ranges
          const insertDateRangeQuery = 'INSERT INTO date_ranges (requestId, date, morningSession, afternoonSession) VALUES (?, ?, ?, ?)';
          const requestId = result.insertId;

          const promises = dateRangeList.map(({ date, session }) => {
            const { morning, afternoon } = session;
            return new Promise((resolve, reject) => {
              connection.query(insertDateRangeQuery, [requestId, date, morning, afternoon], (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          });

          Promise.all(promises)
            .then(() => {
              return res.status(200).json({status_code: 200, type: "success", message: "Yêu cầu xin nghỉ đã được gửi đi"});
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).json({status_code: 500, type: "error", message: "Lỗi server"});
            });
        });
      }

    //Hàm Update yêu cầu nghỉ phép
    UpdateLeaveRequest(req, res) {
        const { requestId } = req.params;
        const { content, dateRangeList, startDate, endDate, createdDate } = req.body;
        const formattedStartDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
        const formattedEndDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
        const formattedCreatedDate = moment(createdDate).format('YYYY-MM-DD HH:mm:ss');
        try {
          //Hàm update trong requests
          connection.query(
            'UPDATE requests SET content = ?, startDate = ?, endDate = ?, createdDate = ? WHERE requestId = ?',
            [content, formattedStartDate, formattedEndDate, formattedCreatedDate, requestId],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).json({status_code: 500, type: "error", message: "Server error"});

              }

              if (result.affectedRows === 0) {
                return res.status(404).json({status_code: 404, type: "error", message: "Leave request not found"});
              }

              // Hàm update trong table date_ranges
              const updatePromises = dateRangeList.map(({ date, session }) => {
                return new Promise((resolve, reject) => {
                  connection.query(
                    'UPDATE date_ranges SET morningSession = ?, afternoonSession = ? WHERE requestId = ? AND date = ?',
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
                  res.status(200).json({status_code: 200, type: "success", message: "Leave request updated successfully"});
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).json({status_code: 500, type: "error", message: "Server error"});
                });
            }
          );
        } catch (err) {
          console.error(err);
          res.status(500).json({status_code: 500, type: "error", message: "Server error"});
        }
      }

        //Hàm xóa yêu cầu nghỉ phép
        DeleteLeaveRequest(req, res) {
            const { requestId } = req.params;
          
            try {
              connection.query('DELETE FROM requests WHERE requestId = ?', [requestId], 
              (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
                  }
          
                  if (result.affectedRows === 0) {
                    return res.status(404).json({status_code: 404, type:"error", message:"Không tìm thấy yêu cầu xin nghỉ phép"});
                  }
          
                  res.status(200).json({status_code: 200, type:"success", message:"Yêu cầu xin nghỉ đã được xóa"});
                }
              );
            } catch (err) {
              console.error(err);
              res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
            }
          }

          //Hàm lấy danh sách tất cả leave-request 
          GetAllLeaveRequests(req, res) {
            try {
              const query = `
                SELECT 
                  r.requestId, 
                  r.content, 
                  r.startDate, 
                  r.endDate, 
                  r.createdDate,
                  dr.date, 
                  dr.morningSession, 
                  dr.afternoonSession
                FROM requests r
                LEFT JOIN date_ranges dr ON r.requestId = dr.requestId
              `;

              connection.query(query, (err, results) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({status_code: 500, type: "error", message: "Lỗi server"});
                }

                // Định dạng format json
                const leaveRequests = results.reduce((acc, row) => {
                  const { requestId, content, startDate, endDate, createdDate, date, morningSession, afternoonSession } = row;
                  const existingRequest = acc.find(r => r.requestId === requestId);

                  if (existingRequest) {
                    existingRequest.dateRangeList.push({
                      date,
                      session: {
                        morning: morningSession === 1,
                        afternoon: afternoonSession === 1
                      }
                    });
                  } else {
                    acc.push({
                      requestId,
                      content,
                      dateRangeList: [
                        {
                          date,
                          session: {
                            morning: morningSession === 1,
                            afternoon: afternoonSession === 1
                          }
                        }
                      ],
                      startDate: startDate.toISOString(),
                      endDate: endDate.toISOString(),
                      createdDate: createdDate.toISOString()
                    });
                  }

                  return acc;
                }, []);

                res.status(200).json({status_code: 200, type: "success", message: "Danh sách xin nghỉ phép", data: leaveRequests});
              });
            } catch (err) {
              console.error(err);
              res.status(500).json({status_code: 500, type: "error", message: "Lỗi server"});
            }
          }
    }

module.exports = new Request;
