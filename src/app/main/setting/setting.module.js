(function ()
{
    'use strict';

    angular
        .module('app.setting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {

        // State
   
        $stateProvider.state('app.setting', {
            url    : '/setting/',
            views  : {
                'content@app': {
               //    templateUrl: 'app/main/setting/setting.html',
                //    controller : 'TransactionController as vm'
                }
            }
        });

     
       


        // Navigation
        msNavigationServiceProvider.saveItem('setting', {
            title : 'Setting',
            icon  : 'icon-file-image-box',
            state : 'app.setting',
          
            weight: 7
        });
    }

})();