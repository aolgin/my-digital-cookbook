(function () {
    angular
        .module("MyDigitalCookbook")
        .config(configuration);

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve(user);
            } else {
                deferred.reject();
                $location.url('/error?code=401');
            }
        });
        return deferred.promise;
    };

    function isAdmin($q, userService, $location) {
        var deferred = $q.defer();
        userService
            .isAdmin()
            .then(function (user) {
                if(user == '0') {
                    deferred.reject();
                    $location.url('/profile'); //TODO figure out best way to handle this
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
            .when("/error", {
                templateUrl: 'views/error/templates/error.view.client.html',
                controller: 'ErrorController',
                controllerAs: 'model'
            })
            .when("/login",{
                templateUrl: 'views/user/templates/login.view.client.html',
                controller: 'LoginController',
                controllerAs: 'model'
            })
            .when("/login/admin", {
                templateUrl: 'views/admin/templates/login.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model'
            })
            .when("/admin", {
                templateUrl: 'views/admin/templates/home.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model'
                // resolve: { adminUser: isAdmin }
            })
            .when("/admin/user", {
                templateUrl: 'views/admin/templates/user-list.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model'
                // resolve: { adminUser: isAdmin }
            })
            // .when("/admin/user/new", {
            //     templateUrl: 'views/admin/templates/user-new.view.client.html',
            //     controller: 'RegisterController',
            //     controllerAs: 'model',
            //     resolve: { adminUser: isAdmin }
            // })
            // .when("/admin/user/:uid", {
            //     templateUrl: 'views/admin/templates/user-edit.view.client.html',
            //     controller: 'ProfileController',
            //     controllerAs: 'model',
            //     resolve: { adminUser: isAdmin }
            // })
            .when("/admin/book", {
                templateUrl: 'views/admin/templates/book-list.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model'
                // resolve: { adminUser: isAdmin }
            })
            // .when("/admin/book/new", {
            //     templateUrl: 'views/admin/templates/book-new.view.client.html',
            //     controller: 'BookNewController',
            //     controllerAs: 'model',
            //     resolve: { adminUser: isAdmin }
            // })
            // .when("/admin/book/:bid", {
            //     templateUrl: 'views/admin/templates/book-edit.view.client.html',
            //     controller: 'BookEditController',
            //     controllerAs: 'model',
            //     resolve: { adminUser: isAdmin }
            // })
            .when("/admin/recipe", {
                templateUrl: 'views/admin/templates/recipe-list.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model'
                // resolve: { adminUser: isAdmin }
            })
            // .when("/admin/recipe/new", {
            //     templateUrl: 'views/admin/templates/recipe-new.view.client.html',
            //     controller: 'RecipeNewController',
            //     controllerAs: 'model',
            //     resolve: { adminUser: isAdmin }
            // })
            // .when("/admin/recipe/:rid", {
            //     templateUrl: 'views/admin/templates/recipe-edit.view.client.html',
            //     controller: 'RecipeEditController',
            //     controllerAs: 'model',
            //     resolve: { adminUser: isAdmin }
            // })
            .when("/register",{
                templateUrl: 'views/user/templates/register.view.client.html',
                controller: 'RegisterController',
                controllerAs: 'model'
            })
            .when("/dashboard", { // Will ultimately be removing the UID here
                templateUrl: 'views/user/templates/dashboard.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/dashboard/books", { // Will ultimately be removing the UID here
                templateUrl: 'views/user/templates/dashboard-books.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/dashboard/recipes", { // Will ultimately be removing the UID here
                templateUrl: 'views/user/templates/dashboard-recipes.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/dashboard/favorites", { // Will ultimately be removing the UID here
                templateUrl: 'views/user/templates/dashboard-favorites.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/dashboard/friends", { // Will ultimately be removing the UID here
                templateUrl: 'views/user/templates/dashboard-friends.view.client.html',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/dashboard/books/new", {
                templateUrl: 'views/book/templates/book-new.view.client.html',
                controller: 'BookNewController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/dashboard/books/:bid", {
                templateUrl: 'views/book/templates/book-edit.view.client.html',
                controller: 'BookEditController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/dashboard/recipes/new",{
                templateUrl: 'views/recipe/templates/recipe-new.view.client.html',
                controller: 'RecipeNewController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/dashboard/recipes/:rid",{
                templateUrl: 'views/Recipe/templates/recipe-edit.view.client.html',
                controller: 'RecipeEditController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/profile",{
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'ProfileController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/profile/changePassword",{
                templateUrl: 'views/user/templates/password.view.client.html',
                controller: 'PasswordController',
                controllerAs: 'model',
                resolve: { currentUser: checkLoggedin }
            })
            .when("/user/:uid/book",{
                templateUrl: 'views/book/templates/book-list.view.client.html',
                controller: 'BookListController',
                controllerAs: 'model'
                // resolve: { currentUser: checkLoggedin }
            })
            .when("/user/:uid/book/new",{
                templateUrl: 'views/book/templates/book-new.view.client.html',
                controller: 'BookNewController',
                controllerAs: 'model'
                // resolve: { currentUser: checkLoggedin }
            })
            .when("/user/:uid/book/:bid",{
                templateUrl: 'views/book/templates/book-edit.view.client.html',
                controller: 'BookEditController',
                controllerAs: 'model'
                // resolve: { currentUser: checkLoggedin }
            })
            .when("/user/:uid/book/:bid/recipe",{
                templateUrl: 'views/recipe/templates/recipe-list.view.client.html',
                controller: 'RecipeListController',
                controllerAs: 'model'
                // resolve: { currentUser: checkLoggedin }
            })
            .when("/user/:uid/book/:bid/recipe/new",{
                templateUrl: 'views/recipe/templates/recipe-new.view.client.html',
                controller: 'RecipeNewController',
                controllerAs: 'model'
                // resolve: { currentUser: checkLoggedin }
            })
            .when("/user/:uid/book/:bid/recipe/:rid",{
                templateUrl: 'views/recipe/templates/recipe-edit.view.client.html',
                controller: 'RecipeEditController',
                controllerAs: 'model'
                // resolve: { currentUser: checkLoggedin }
            })
            .when("/book/:bid", {
                templateUrl: 'views/book/templates/book-public.view.client.html',
                controller: 'BookController',
                controllerAs: 'model'
            })
            .when("/recipe/:rid", {
                templateUrl: 'views/recipe/templates/recipe-public.view.client.html',
                controller: 'RecipeController',
                controllerAs: 'model'
            })
            .when("/chef/:uid", {
                templateUrl: 'views/user/templates/profile-public.view.client.html',
                controller: 'ProfileController',
                controllerAs: 'model'
            })
            .when("/search/results", {
                templateUrl: 'views/search/templates/search-results.view.client.html',
                controller: 'SearchController',
                controllerAs: 'model'
            })
            .otherwise({
                resolve: {errorPage: redirectTo404}
            });
    }
})();