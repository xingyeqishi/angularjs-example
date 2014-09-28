window.angular.module('myApp', ['ui.router', 'ngAnimate', 'angular-growl', 'anim-in-out'])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list');

    $stateProvider
        .state('list', {
            url: '/list',
            views: {
                main: {
                    templateUrl: '/views/singlepage/partial-list.html',
                    controller: function($scope, $timeout, growl, $http) {
                        $http({
                            method: 'GET',
                            url: '/fruit/list.ajax'
                        })
                        .success(function(data) {
                            if (data.status === 200) {
                                $scope.fruitData = data.data;
                            } else {
                                growl.addErrorMessage(data.errorMsg);
                            }
                        });


                        $scope.delete = function(item) {
                            $http({
                                method: 'POST',
                                url: '/fruit/delete.ajax',
                                data: item
                            })
                            .success(function(data) {
                                if (data.status === 200) {
                                    growl.addSuccessMessage('删除成功');
                                    $timeout(function() {
                                        deleteItem(item);
                                    }, 2500);
                                } else {
                                    growl.addErrorMessage(data.errorMsg);
                                }
                            });
                        };

                        function deleteItem(item) {
                            $scope.fruitData.some(function(val, index) {
                                if (item.fruitName === val.fruitName && item.price === val.price) {
                                    $scope.fruitData.splice(index, 1);
                                    return true;
                                }
                                return false;
                            });
                        }
                    }
                }
            }
        })
        .state('edit', {
            url: '/edit/:name/:price',
            views: {
                main: {
                    templateUrl: '/views/singlepage/partial-edit.html',
                    controller: function($scope, $http, $timeout, growl, $location, $stateParams) {
                        $scope.formData = {
                            fruitName: $stateParams.name,
                            price: $stateParams.price
                        };
                        $scope.submitForm = function() {
                            $http({
                                method: 'POST',
                                url: '/fruit/update.ajax',
                                data: $scope.formData
                            })
                            .success(function(data) {
                                if (data.status === 200) {
                                    growl.addSuccessMessage('修改成功');
                                    $timeout(function() {
                                        $location.path('/list');
                                    }, 2500);
                                } else {
                                    growl.addErrorMessage(data.errorMsg);
                                }
                            });
                        };
                    }
                }
            }
        })
        .state('create', {
            url: '/create',
            views: {
                main: {
                    templateUrl: '/views/singlepage/partial-create.html',
                    controller: function($scope, $http, growl, $window, $timeout, $location) {
                        $scope.submitForm = function() {
                            $http({
                                method: 'POST',
                                url: '/fruit/add.ajax',
                                data: $scope.formData
                            })
                            .success(function(data) {
                                if (data.status === 200) {
                                    growl.addSuccessMessage('添加成功');
                                    $timeout(function() {
                                        $location.path('/list');
                                    }, 2500);
                                } else {
                                    $window.alert(data.errorMsg);
                                }
                            });
                        };
                    }
                }
            }
        });
})
.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(2000);
}])
.controller('mainCtrl', function($scope) {
    $scope.speed = 500;
});
