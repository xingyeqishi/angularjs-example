window.angular.module('highlightDirective', [])
.directive('highlight', function() {
    return function(scope, elem, attrs) {
        var val = attrs['highlight'];
        if (scope.item.price > val) {
            elem.addClass('text-danger');
        }
    }
});
