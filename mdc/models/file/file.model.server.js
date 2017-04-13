module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var FileSchema = require("./file.schema.server")();
    var FileModel  = mongoose.model("FileModel", FileSchema);

    var api = {
        createFileRecord: createFileRecord,
        findFileRecordById: findFileRecordById,
        updateFileRecord: updateFileRecord,
        removeFileRecord: removeFileRecord,
        findAllFileRecords: findAllFileRecords,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findAllFileRecords() {
        return FileModel.find();
    }

    function removeFileRecord(fid) {
        return FileModel.remove({_id: fid});
    }

    function updateFileRecord(fid, record) {
        return FileModel.update({ _id: fid },
            {
                name: record.name // TODO Return to later
            }
        );
    }

    function findFileRecordById(fid) {
        return FileModel.findById(fid);
    }

    function createFileRecord(uid, record) {
        return FileModel.create(record)
            .then(function(fileObj) {
                model.userModel
                    .findUserById(uid)
                    .then(function(userObj) {
                        fileObj._user = userObj._id;
                        return fileObj.save();
                    }, function (err) {
                        console.log(err);
                    })
            })
    }

};