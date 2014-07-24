/*
	wrap mongodb to return promises
*/

var config = require('local-config');
var Promise = require('bluebird');
var mongodb = require('mongodb');
var db;


module.exports = function(name) {
	return connect().then(function(db) {
		return db.collection(name);
	})
	.then(function(collection) {
		Promise.promisifyAll(collection);
		return collection;
	});
};


module.exports.ObjectID = mongodb.ObjectID;


function connect() {
	if (db) return Promise.resolve(db);

	return new Promise(function(resolve, reject) {
		mongodb.MongoClient.connect(config.mongodb.url, {auto_reconnect: true}, function(err, db) {
			if (err) return reject(err);
			Promise.promisifyAll(db);
			resolve(db);
		});
	});
}
