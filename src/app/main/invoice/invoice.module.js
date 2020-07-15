(function ()
{
    'use strict';

    angular
        .module('app.invoice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {

        // State
        // debugger;
        $stateProvider.state('app.invoice', {
            url    : '/invoice/:token',
            views  : {
                'content@app': {
                   templateUrl: 'app/main/invoice/compact.html',
                    controller : 'InvoiceController as vm'
                },
                'content@app.invoice': {
                    templateUrl: 'app/main/invoice/compact.html',
                    controller : 'InvoiceController as vm'
                }
            }
        });

     
       


        // Navigation
        // msNavigationServiceProvider.saveItem('invoice', {
        //     title : 'invoice',
        //     icon  : 'icon-file-image-box',
        //     state : 'app.invoice',
          
        //     weight: 6
        // });
    }

})();