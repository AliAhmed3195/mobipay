(function ()
{
    'use strict';

    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope, $window, Clique)
    {
        var vm = this;
        debugger;
        var appConfig = Clique.configApp();
        $scope.appName=appConfig.appName;
        $scope.appLogo=appConfig.appLogo;
        console.log();
        // Data
        vm.bodyEl = angular.element('body');
        vm.folded = false;
        vm.msScrollOptions = {
            suppressScrollX: true
        };
// var appConfig = Clique.configApp();
//         $scope.appName = appConfig.appName;
//         $scope.appLogo = appConfig.appLogo;
        // Methods
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
        vm.redirecttoback = redirecttoback;

        function redirecttoback()
        {
            // Do logout here..
            debugger;
            var windowlocation = $window.location;    
        console.log("windowlocation",windowlocation.origin);
        var abcd = windowlocation.origin+"/apps/dashboard/home/"; 
       console.log("url", abcd);
        // $state.go(abcd);
        $window.location.href = abcd;
        // console.log("state",$state);
        }
        //////////

        /**
         * Toggle folded status
         */
        function toggleMsNavigationFolded()
        {
            vm.folded = !vm.folded;
        }

        // Close the mobile menu on $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function ()
        {
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active');
        });
    }

})();