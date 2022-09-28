const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// Public API - Fix these CRUD functions ///////////////////////////////////////
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var directory = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(directory, text, (err) => {
      if (err) {
        throw(`${err}`);
      } else {
        callback(err, { id, text} );
      }
    });
  });
};

exports.readAll = (callback) => {
  let id = [];
  let arrayOfValues = [];
  return fs.promises.readdir(exports.dataDir)
  .then(files => {
    return Promise.all(files.map(file => {
      let directory = path.join(exports.dataDir, file)
      id.push(file.split('.')[0]);
      return fs.promises.readFile(directory, 'utf8')
    }))
  }).then(arr => {
    for (var i = 0; i < arr.length; i++) {
      arrayOfValues.push({'id': id[i], 'text': arr[i]})
    } return arrayOfValues;
}).then(obj => {callback(null, arrayOfValues)})
  .catch(err => console.log('err ', err))
};

exports.readOne = (id, callback) => {
  var directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, 'utf8', (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(err, { id, text: fileData });
    }
  });
};

exports.update = (id, text, callback) => {
  var directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, 'utf8', (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
    fs.writeFile(directory, text, () => {
      callback(err, { id, text });
    })
    }
  });
};

exports.delete = (id, callback) => {
  var directory = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(directory, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
