const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mysql-startkid-startkid.d.aivencloud.com',
    port: '22394',
    user: 'avnadmin',
    password: 'AVNS_86ep1Mrtd_SBnm_AglI',
    database: 'defaultdb'
});

// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: 'root',
//     database: 'testapi'
// });
module.exports = {
    connection
};