(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('FileService', fileService);

    function fileService($http) {

        var api = {
            "findFileById": findFileById,
            "uploadFile": uploadFile,
            "deleteFile": deleteFile,
            "listAllFiles": listAllFiles
        };
        return api;

        function listAllFiles() {
            return $http.get("/api/admin/files");
        }

        function findFileById(fid) {
            return $http.get("/api/file/" + fid);
        }

        function uploadFile(file, bid) {
            return $http.post("/api/book/" + bid + "/file", file);
        }

        function deleteFile(fid) {
            return $http.delete("/api/file/" + fid);
        }
    }
})();