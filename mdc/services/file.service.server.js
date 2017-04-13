module.exports = function(app, model) {
    var FileModel = model.fileModel;
    var fs = require('fs');
    var aws = require('aws-sdk');

    var accessKey = process.env.S3_ACCESS_KEY;
    var secretKey = process.env.S3_SECRET_KEY;
    var bucketRegion = "us-east-1";

    aws.config.update({
        region: bucketRegion,
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    });

    var bucketName = process.env.S3_BUCKET_NAME;
    var s3 = new aws.S3({
        params: {Bucket: bucketName}
    });

    app.get("/api/file/:fid", findFileById);
    app.post("/api/file", uploadFile);
    app.delete("/api/file/:fid", deleteFile);
    app.get("/api/admin/files", listAllFileRecords);
    app.post("/api/admin/file", createFileRecord);
    app.get("/api/admin/file/:fid", findFileRecordById);
    app.delete("/api/admin/file/:fid", deleteFileRecord);

    // Service Functions
    function createFileRecord(req, res) {
        var uid = req.params['uid']; // TODO not gonna work like this, but will use as a placeholder
        var record = req.body;
        return FileModel.createFileRecord(uid, record)
            .then(function(record) {
                res.json(record);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findFileRecordById(req, res) {
        var fid = req.params['fid'];
        return FileModel.findFileRecordById(fid)
            .then(function(record) {
                if (record) {
                    res.json(record);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function deleteFileRecord(req, res) {
        var fid = req.params['fid'];
        return FileModel.deleteFileRecord(fid)
            .then(function(response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function listAllFileRecords(req, res) {
        return FileModel.listAllFileRecords()
            .then(function (records) {
                res.json(records);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function uploadFile(req, res) {
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
        var newFile = req.body;
        var fid = req.params['fid'];
        var fileKey = fid; // TODO will need to validate fid first
        var params = {
            Bucket: bucketName, /* required */
            Key: fileKey, /* required */
            Body: new Buffer('...') || 'STRING_VALUE' || streamObject,
            ACL: 'public-read',
            CacheControl: 'STRING_VALUE',
            ContentDisposition: 'STRING_VALUE',
            ContentEncoding: 'STRING_VALUE',
            ContentLanguage: 'STRING_VALUE',
            ContentLength: 0,
            ContentMD5: 'STRING_VALUE',
            ContentType: 'STRING_VALUE',
            GrantFullControl: 'STRING_VALUE',
            GrantRead: 'STRING_VALUE',
            Metadata: {
                someKey: 'STRING_VALUE'
                /* anotherKey: ... */
            }
        };

        s3.putObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
        /*
         Should be accessible at https://s3.amazonaws.com/bucket-name/path-to-file
         */
    }

    function findFileById(req, res) {
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
        var fid = req.params['fid'];
        var fileKey = fid; // TODO will need to validate fid first
        var params = {
            Bucket: bucketName, /* required */
            Key: fileKey, /* required */
            IfMatch: 'STRING_VALUE',
            IfNoneMatch: 'STRING_VALUE'
        };

        s3.getObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    }

    function deleteFile(req, res) {
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
        var fid = req.params['fid'];
        var fileKey = fid; // TODO will need to validate fid first
        console.log(fid);
        var params = {
            Bucket: bucketName,
            Key: fileKey
        };
        s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    }
};