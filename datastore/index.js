const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    var directory = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(directory, text, (err) => {
      if (err) {
        throw(`${err}`);
      } else {
        callback(null, { id, text} ); //we fixed this from id: id and text: text, in case it makes a diff later
      }
    });
  });

};

exports.readAll = (callback) => {
  var mappedDir = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw(`${err}`);
    } else {
      files.forEach((file) => {
        var id = file.slice(0, 5);
        mappedDir.push({ id, text: id})
      });
      callback(null, mappedDir);
    }
  })
};

exports.readOne = (id, callback) => {
  var directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, 'utf-8', (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: fileData });
    }
  });
};


exports.update = (id, text, callback) => {
  var directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, 'utf-8', (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
    fs.writeFile(directory, text, () => {
      callback(null, { id, text });
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
