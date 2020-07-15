(function ()
{
    'use strict';

    angular
        .module('app.transaction', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {

        // State
   
        $stateProvider.state('app.transaction', {
            url    : '/transaction/',
            views  : {
                'content@app': {
                   templateUrl: 'app/main/transaction/transaction.html',
                    controller : 'TransactionController as vm'
                }
            }
        });

     
       


        // Navigation
        msNavigationServiceProvider.saveItem('transaction', {
            title : 'Transaction',
            icon  : 'icon-file-image-box',
            state : 'app.transaction',
          
            weight: 6
        });
    }

})();