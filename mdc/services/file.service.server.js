module.exports = function(app, model) {
    // var bookModel = model.bookModel;

    app.get("/api/file/:fid", findFileById);
    app.post("/api/file", uploadFile);
    app.delete("/api/file/:fid", deleteFile);

    // Service Functions

    function uploadFile(req, res) {
        var newFile = req.body;
        var fid = req.params['fid'];
    }

    function findFileById(req, res) {
        var fid = req.params['fid'];
    }

    function deleteFile(req, res) {
        var fid = req.params['fid'];
    }
};