(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('FileService', fileService);

    function fileService($http) {

        var api = {
            "findFileById": findFileById,
            "uploadFile": uploadFile,
            "deleteFile": deleteFile
        };
        return api;

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