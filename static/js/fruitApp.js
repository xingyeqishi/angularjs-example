window.angular.module('fruitApp', ['ngAnimate', 'angular-growl', 'highlightDirective'])
.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(2000);
}])
.controller('mainCtrl', function($scope, $timeout, $window, $http, growl) {
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
                    // $scope.fruitData.unshift(data.data);
                }, 2500);
            } else {
                $window.alert(data.errorMsg);
            }
        });
    };

    $scope.deleteFruit = function(item) {
        $http({
            method: 'POST',
            url: '/fruit/delete.ajax',
            data: item
        })
        .success(function(data) {
            if (data.status === 200) {
                growl.addSuccessMessage('删除成功');
                $timeout(function() {
                    // deleteItem(item);
                }, 2500);
            } else {
                growl.addErrorMessage(data.errorMsg);
            }
        });
    };
/*
    function deleteItem(item) {
        $scope.fruitData.some(function(val, index) {
            if (item.fruitName === val.fruitName && item.price === val.price) {
                $scope.fruitData.splice(index, 1);
                return true;
            }
            return false;
        });
    }
    */
});
