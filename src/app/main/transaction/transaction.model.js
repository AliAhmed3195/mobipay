(function () {
  'use strict';
  angular
    .module('app.transaction')
    .factory('TransactionModel', TransactionModel);

    TransactionModel.$inject = ['$http', 'Clique', '$httpParamSerializer'];

  function TransactionModel($http, Clique, $httpParamSerializer) {
    var service = {};

    service.GetAllTransaction = GetAllTransaction;
    service.GetCompanyInfo = GetCompanyInfo;
    service.GetPaymentInfo = GetPaymentInfo;
    service.GetSettings = GetSettings;
    service.DoVoidTransaction = DoVoidTransaction;
    service.DoRefundTransaction = DoRefundTransaction;
    service.sendReceipt = sendReceipt;
    return service;

  
 

    function GetSettings() {
      return Clique.callService('get','/settings/','').then(handleSuccess, handleError);
  }

    function GetAllTransaction(query) {
   
      var qs = $httpParamSerializer(query);
      return Clique.callService('get','/invoice/transactions/?'+qs,'').then(handleSuccess, handleError);
  }

  function GetCompanyInfo() {
    return Clique.callService('get','/company','').then(handleSuccess, handleError);
}
function GetPaymentInfo() {
    return Clique.callService('get','/paymentmethods','').then(handleSuccess, handleError);
}
function DoRefundTransaction(params) {
  return Clique.callService('post','/transaction/refund/',params).then(handleSuccess, handleError);
}

function DoVoidTransaction(params) {
  return Clique.callService('post','/transaction/void/',params).then(handleSuccess, handleError);
}

function sendReceipt(params) {
  debugger;
  return Clique.callService('post','/transaction/email_receipt/',params).then(handleSuccess, handleError);
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
