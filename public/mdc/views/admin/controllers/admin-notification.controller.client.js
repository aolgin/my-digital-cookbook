(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("AdminNotificationController", AdminNotificationController);

    function AdminNotificationController(AdminService, $location, UserService, adminUser) {
        var vm = this;

        function init() {
            if (!adminUser) {
                $location.url("/error?code=401");
            } else {
                vm.username = adminUser.username;
                vm.uid = adminUser._id;
                vm.admin = true;
                renderNotifications();
            }
        }
        init();

        vm.search = search;
        vm.renderNotifications = renderNotifications;
        vm.deleteCategory = deleteCategory;
        vm.logout = logout;

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/");
                });
        }

        function renderNotifications() {
            AdminService.findAllNotifications()
                .then(function (response) {
                    vm.notifications = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching categories: \n" + err;
                })
        }

        function deleteCategory(nid) {
            var answer = confirm("Are you sure?");
            if (answer) {
                AdminService.deleteNotification(nid)
                    .then(function (response) {
                        vm.error = null;
                        vm.message = "Successfully deleted notification!";
                        renderNotifications();
                    }).catch(function (err) {
                        vm.message = null;
                        if (err.status === 401) {
                            vm.error = "You are not authorized to perform that action";
                        } else {
                            vm.error = "An uncaught error occurred deleting the notification: \n" + err.data;
                        }
                    });
            }
        }
        
    }
})();