const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mysql-startkid-startkid.d.aivencloud.com',
    port: '22394',
    user: 'avnadmin',
    password: 'AVNS_86ep1Mrtd_SBnm_AglI',
    database: 'defaultdb'
});
module.exports = {
    connection
};