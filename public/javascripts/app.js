
////////////////////////////////////////////////////
angular.module('ClientAuth',[])
.factory('Auth',function ($http,$rootScope,$cookieStore,AccessLevels,UserRoles) {
  var accessLevels=AccessLevels;
  var userRoles=UserRoles;
  var currentUser=$cookieStore.get('user')||{username:'',role:userRoles.public};
  return{
    accessLevels:accessLevels,
    userRoles:userRoles,
    user:currentUser,
    authorize:function (accessLevels,role) {
      if(role===undefined){
        // debugger;
        role=currentUser.role;
      }
      console.log(accessLevels);
      console.log(role);
      return accessLevels&role;
    },
    isLoggedIn:function (user) {
      if(user===undefined){
          user=currentUser;
      }
      return user.role===userRoles.user||user.role===userRoles.admin;
    },
    register:function (user,success,error) {
      $http.post('/register',user).success(success).error(error);
    },
    login:function (user,success,error) {
      $http.post('/login',user).success(function (user) {
        $rootScope.user=user;
        success(user);
      }).error(error);
    },
    logout:function (success,error) {
      $http.post('/logout').success(function () {
        $rootScope.user = {
           username:'',
           role:userRoles.public
       };
       success();
     }).error(error);
   }
  };
});

////////////////////////////////////////////////////
var app=angular.module("MyApp",['ngCookies','ngRoute','ClientAuth']);
app.constant('UserRoles',{
  'public':1,
  'user':2,
  'admin':4
});
app.constant('AccessLevels',{
  'public':7,
  'anon':1,
  'user':6,
  'admin':4
});


app.config(function ($routeProvider,AccessLevels) {
  $routeProvider
  .when('/admin',{
    controller:'AdminController',
    templateUrl:'partial/admin.html',
    access_level:AccessLevels.admin
  })
  .when('/register',{
    controller:'RegisterController',
    templateUrl:'partial/register.html',
    access_level:AccessLevels.anon
  })
  .when('/login',{
    controller:'LoginController',
    templateUrl:'partial/login.html',
    access_level:AccessLevels.anon
  })
  .when('/user', {
    controller: 'UserController',
    templateUrl: 'partial/user.html',
    access_level: AccessLevels.user     //设定一个访问级别
  }).otherwise({
    redirectTo:'/'
  });
});

app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!Auth.authorize(next.access_level)) {
            if(Auth.isLoggedIn())
                $location.path('/');
            else
                $location.path('/login');
        }
    });
}]);
app.controller('MainController',function ($scope) {

});

app.controller('UserController',function ($scope) {

});


app.controller('LoginController',function ($scope) {

});

app.controller('RegisterController',function ($scope) {

});

app.controller('AdminController',function ($scope) {

});
