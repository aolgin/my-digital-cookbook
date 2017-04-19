(function () {
    angular
        .module("MyDigitalCookbook")
        .config(configuration);

    var checkLoggedin = function($q, UserService, $location) {
        var deferred = $q.defer();
        UserService
            .loggedin()
            .then(function (response) {
                var user = response.data;
                if(user === '0') {
                    deferred.reject();
                    $location.url('/error?code=401');
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    };

    // Intended for cases where you may want to use user information if it exists.
    // For example, looking at a public page while logged on,
    // and then being able to navigate to your profile if you are logged in
    var checkLoggedinNoRedirect = function($q, UserService) {
        var deferred = $q.defer();
        UserService
            .loggedin()
            .then(function (response) {
                var user = response.data;
                if(user !== '0') {
                    deferred.resolve(user);
                } else {
                    deferred.resolve();
                }
            }).catch(function(err) {
                console.log(err);
                deferred.reject();
                $location.url("/error?code=500");
            });
        return deferred.promise;
    };

    // Intended for cases where you may want to use user information if it exists.
    // Used to show a link to the admin portal
    function isAdminNoRedirect($q, AdminService, $location) {
        var deferred = $q.defer();
        AdminService
            .isAdmin()
            .then(function (response) {
                var user = response.data;
                if(user !== '0') {
                    deferred.resolve(user);
                } else {
                    deferred.resolve();
                }
            }).catch(function (err) {
                console.log(err);
                deferred.reject();
                $location.url('/error?code=500');
            });
        return deferred.promise;
    }

    function isAdmin($q, AdminService, $location) {
        var deferred = $q.defer();
        AdminService
            .isAdmin()
            .then(function (response) {
                var user = response.data;
                if(user === '0') {
                    deferred.reject();
                    $location.url('/error?code=401');
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    var redirectTo404 = function($location) {
        $location.url('/error?code=404');
    };

    function configuration($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/home", {
                templateUrl: 'views/home/templates/index.html',
                controller: 'HomeController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedinNoRedirect,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/error", {
                templateUrl: 'views/error/templates/error.view.client.html',
                controller: 'ErrorController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedinNoRedirect,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/login",{
                templateUrl: 'views/user/templates/login.view.client.html',
                controller: 'LoginController',
                controllerAs: 'model'
            })
            .when("/admin", {
                templateUrl: 'views/admin/templates/home.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/user", {
                templateUrl: 'views/admin/templates/user-list.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/user/new", {
                templateUrl: 'views/admin/templates/user-new.view.client.html',
                controller: 'RegisterController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/user/:uid/details", {
                templateUrl: 'views/admin/templates/user-details.view.client.html',
                controller: 'ProfileController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/book", {
                templateUrl: 'views/admin/templates/book-list.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/book/new", {
                templateUrl: 'views/admin/templates/book-new.view.client.html',
                controller: 'BookNewController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/book/:bid/details", {
                templateUrl: 'views/admin/templates/book-details.view.client.html',
                controller: 'BookEditController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/recipe", {
                templateUrl: 'views/admin/templates/recipe-list.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/recipe/new", {
                templateUrl: 'views/admin/templates/recipe-new.view.client.html',
                controller: 'RecipeNewController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/admin/recipe/:rid/details", {
                templateUrl: 'views/admin/templates/recipe-details.view.client.html',
                controller: 'RecipeEditController',
                controllerAs: 'model',
                resolve: { adminUser: isAdmin }
            })
            .when("/register",{
                templateUrl: 'views/user/templates/register.view.client.html',
                controller: 'RegisterController',
                controllerAs: 'model'
            })
            .when("/dashboard", { 
                templateUrl: 'views/user/templates/dashboard.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/dashboard/books", { 
                templateUrl: 'views/user/templates/dashboard-books.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/dashboard/recipes", { 
                templateUrl: 'views/user/templates/dashboard-recipes.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/dashboard/following", { 
                templateUrl: 'views/user/templates/dashboard-following.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/dashboard/books/new", {
                templateUrl: 'views/book/templates/book-new.view.client.html',
                controller: 'BookNewController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/dashboard/books/:bid", {
                templateUrl: 'views/book/templates/book-edit.view.client.html',
                controller: 'BookEditController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/dashboard/recipes/new",{
                templateUrl: 'views/recipe/templates/recipe-new.view.client.html',
                controller: 'RecipeNewController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/dashboard/recipes/:rid",{
                templateUrl: 'views/recipe/templates/recipe-edit.view.client.html',
                controller: 'RecipeEditController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/profile",{
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'ProfileController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/profile/changePassword",{
                templateUrl: 'views/user/templates/password.view.client.html',
                controller: 'PasswordController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedin,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/cookbook/:bid", {
                templateUrl: 'views/book/templates/book-public.view.client.html',
                controller: 'PublicBookController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedinNoRedirect,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/recipe/:rid", {
                templateUrl: 'views/recipe/templates/recipe-public.view.client.html',
                controller: 'PublicRecipeController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedinNoRedirect,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/chef/:uid", {
                templateUrl: 'views/user/templates/profile-public.view.client.html',
                controller: 'PublicProfileController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedinNoRedirect,
                    adminUser: isAdminNoRedirect
                }
            })
            .when("/search/results", {
                templateUrl: 'views/search/templates/search-results.view.client.html',
                controller: 'SearchController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLoggedinNoRedirect,
                    adminUser: isAdminNoRedirect
                }
            })
            .otherwise({
                resolve: {errorPage: redirectTo404}
            });
    }
})();