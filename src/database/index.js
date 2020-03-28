const mysql = require('mysql');
const dbConfig = require('../config/db');

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });

    this.connection.connect(err => {
      if (err) throw err;
      console.log('Conectado ao banco')
    })
  }

  async doQuery(queryToDo) {
    const pro = new Promise((resolve, reject) => {
      const query = queryToDo;
      this.connection.query(query, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    })
    return pro.then((val) => {
      return val;
    })
  }

  async doQueryParams(queryToDo, array) {
    let pro = new Promise((resolve, reject) => {
      let query = queryToDo;
      this.connection.query(query, array, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    })
    return pro.then((val) => {
      return val;
    })
  }

}

module.exports = new Database();