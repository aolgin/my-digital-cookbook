(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("AdminCategoryController", AdminCategoryController);

    function AdminCategoryController(AdminService, $location, UserService, adminUser) {
        var vm = this;

        function init() {
            if (!adminUser) {
                $location.url("/error?code=401");
            } else {
                vm.username = adminUser.username;
                vm.uid = adminUser._id;
                vm.admin = true;
                renderCategories();
            }
        }
        init();

        vm.search = search;
        vm.toggleCategoryUpdateBox = toggleCategoryUpdateBox;
        vm.toggleCategoryCreationBox = toggleCategoryCreationBox;
        vm.renderCategories = renderCategories;
        vm.deleteCategory = deleteCategory;
        vm.createCategory = createCategory;
        vm.updateCategory = updateCategory;
        vm.logout = logout;

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/login");
                });
        }

        function toggleCategoryCreationBox() {
            if (vm.showCreationBox) {
                vm.showCreationBox = false;
            } else {
                vm.showCreationBox = true;
            }
        }

        function toggleCategoryUpdateBox(cat) {
            if (cat) {
                vm.category = cat;
            }
            if (vm.showUpdateBox) {
                vm.showUpdateBox = false;
            } else {
                vm.showUpdateBox = true;
            }
        }

        function renderCategories() {
            AdminService.findAllCategories()
                .then(function (response) {
                    vm.categories = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching categories: \n" + err;
                })
        }

        function deleteCategory(cid) {
            var answer = confirm("Are you sure?");
            if (answer) {
                AdminService.deleteCategory(cid)
                    .then(function (response) {
                        vm.error = null;
                        vm.message = "Successfully deleted category!";
                        renderCategories();
                    }).catch(function (err) {
                        vm.message = null;
                        vm.error = "An uncaught error occurred deleting the category: \n" + err.data;
                    });
            }
        }

        function createCategory(cat) {
            if (!cat || !cat.name) {
                vm.error = "Name required!";
                return;
            }
            AdminService.createCategory(cat)
                .then(function (response) {
                    vm.error = null;
                    vm.message = "Category successfully created!";
                    vm.showCreationBox = false;
                    renderCategories();
                }).catch(function (err) {
                    vm.message = null;
                    if (err.status === 409) {
                        vm.error = "A category with that name already exists!";
                    } else {
                        vm.error = "An uncaught error occurred creating the category: \n" + err.data;
                    }
                });
        }

        function updateCategory(cat) {
            if (!cat || !cat.name) {
                vm.error = "Name required!";
                return;
            }
            AdminService.updateCategory(cat._id, cat)
                .then(function (response) {
                    vm.message = "Category successfully updated!";
                    vm.error = null;
                    vm.showUpdateBox = false;
                    renderCategories();
                }).catch(function (err) {
                    vm.message = null;
                    if (err.status === 409) {
                        vm.error = "A category with that name already exists!";
                    } else {
                        vm.error = "An uncaught error occurred updating the category: \n" + err.data;
                    }
                });
        }
    }
})();