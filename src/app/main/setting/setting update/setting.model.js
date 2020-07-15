(function () {
  'use strict';
  angular
    .module('app.setting')
    .factory('TransactionModel', TransactionModel);

    TransactionModel.$inject = ['$http', 'Clique', '$httpParamSerializer'];

  function TransactionModel($http, Clique, $httpParamSerializer) {
    var service = {};

    service.GetAllTransaction = GetAllTransaction;
    service.GetCompanyInfo = GetCompanyInfo;
    service.GetPaymentInfo = GetPaymentInfo;
    service.GetSettings = GetSettings;
    return service;

  
 

    function GetSettings() {
      return Clique.callService('get','/settings/','').then(handleSuccess, handleError);
  }

    function GetAllTransaction(query) {
      // debugger;
      var qs = $httpParamSerializer(query);
      return Clique.callService('get','/invoice/transactions/?'+qs,'').then(handleSuccess, handleError);
  }

  function GetCompanyInfo() {
    return Clique.callService('get','/company','').then(handleSuccess, handleError);
}
function GetPaymentInfo() {
    return Clique.callService('get','/paymentmethods','').then(handleSuccess, handleError);
}

    function handleSuccess(res) {
      //console.log(res);
      return res.data;
    }

    function handleError(error) {
      //console.log(error);
      return error;
    }

  }

})();
