const mysql = require('mysql');

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'police'
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
      this.db.query(query, array, function (err, result) {
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