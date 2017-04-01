(function () {
    angular
        .module("MyDigitalCookbook")
        .config(configuration);

    // var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
    //     var deferred = $q.defer();
    //     $http.get('/api/loggedin').success(function(user) {
    //         $rootScope.errorMessage = null;
    //         if (user !== '0') {
    //             $rootScope.currentUser = user;
    //             deferred.resolve();
    //         } else {
    //             deferred.reject();
    //             $location.url('/error?code=401');
    //         }
    //     });
    //     return deferred.promise;
    // };

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
                controller: 'loginController',
                controllerAs: 'model'
            })
            .when("/register",{
                templateUrl: 'views/user/templates/register.view.client.html',
                controller: 'registerController',
                controllerAs: 'model'
            })
            .when("/profile",{
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model'
                // resolve: { loggedin: checkLoggedin }
            })
            .when("/profile/changePassword",{
                templateUrl: 'views/user/templates/password.view.client.html',
                controller: 'passwordController',
                controllerAs: 'model'
                // resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/book",{
                templateUrl: 'views/book/templates/book-list.view.client.html',
                controller: 'BookListController',
                controllerAs: 'model'
                // resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/book/new",{
                templateUrl: 'views/book/templates/book-new.view.client.html',
                controller: 'BookNewController',
                controllerAs: 'model'
                // resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/book/:bid",{
                templateUrl: 'views/book/templates/book-edit.view.client.html',
                controller: 'BookEditController',
                controllerAs: 'model'
                // resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/book/:bid/recipe",{
                templateUrl: 'views/recipe/templates/recipe-list.view.client.html',
                controller: 'RecipeListController',
                controllerAs: 'model'
                // resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/book/:bid/recipe/new",{
                templateUrl: 'views/recipe/templates/recipe-new.view.client.html',
                controller: 'RecipeNewController',
                controllerAs: 'model'
                // resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/book/:bid/recipe/:rid",{
                templateUrl: 'views/recipe/templates/recipe-edit.view.client.html',
                controller: 'RecipeEditController',
                controllerAs: 'model'
                // resolve: { loggedin: checkLoggedin }
            })
            .otherwise({
                resolve: {errorPage: redirectTo404}
            });

        // $locationProvider.html5Mode(true);
    }
})();