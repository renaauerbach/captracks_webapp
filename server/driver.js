const {ObjectID} = require('mongodb');

// Driver constructor
CollectionDriver = function(db) {
    this.db = db;
};

// Get full collection
CollectionDriver.prototype.getCollection = function(collectionName, callback) {
    this.db.collection(collectionName, (error, the_collection) => {
        if (error) {
            callback(error);
        } else {
            callback(null, the_collection);
        }
    });
};

// Find all
CollectionDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, (error, the_collection) => {
        if (error) {
            callback(error);
        } else {
            the_collection.find().toArray((error, results) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, results);
                }
            });
        }
    });
};

// Get object
CollectionDriver.prototype.get = function(collectionName, id, callback) {
    this.getCollection(collectionName, (error, the_collection) => {
        if (error) callback(error);
        else {
            var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
            if (!checkForHexRegExp.test(id)) {
                callback({ error: 'invalid id' });
            } else {
                the_collection.findOne({ _id: ObjectID(id) }, (error, doc) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, doc);
                    }
                });
            }
        }
    });
};

//Save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, (error, the_collection) => {
        if (error) {
            callback(error);
        } else {
            obj.created_at = new Date();
            the_collection.insert(obj, () => {
                callback(null, obj);
            });
        }
    });
};

exports.CollectionDriver = CollectionDriver;
