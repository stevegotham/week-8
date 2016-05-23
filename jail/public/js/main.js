angular.module('app', [])

angular.module('app')
	.controller('mainController', ['$scope', '$http', function($scope, $http){
        $scope.loginForm = {}

        $scope.users = [
            { name : 'alice',   role : 'warden' },
            { name : 'bob',     role : 'guard' },
            { name : 'carlos',  role : 'visitor' },
            { name : 'eve',     role : 'prisoner' },
            { name : 'mallory', role : 'prisoner' },
        ]
        $scope.logInAs = function(user){
            $scope.loginForm.username = $scope.loginForm.password = user.name
        }
        $scope.signup = function(){
            $http({
                method : 'POST',
                url    : '/signup',
                data   : $scope.signupForm
            }).then(function(returnData){
                console.log(returnData)
                if ( returnData.data.success ) { window.location.href="/jail" }
            })
        }

        $scope.login = function(){
            $http({
                method : 'POST',
                url    : '/login',
                data   : $scope.loginForm
            }).then(function(returnData){
                if ( returnData.data.success ) { window.location.href="/jail" } 
                else { console.log(returnData)}
            })
        }

	}])
	