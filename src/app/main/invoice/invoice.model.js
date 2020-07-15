(function () {
  'use strict';
  angular
    .module('fuse')
    .factory('InvoiceModel', InvoiceModel);

  InvoiceModel.$inject = ['$http', 'Clique', '$httpParamSerializer'];

  function InvoiceModel($http, Clique, $httpParamSerializer) {
    var service = {};

    service.GetInvoiceDetails = GetInvoiceDetails;
    service.CardConnectPayment = CardConnectPayment;
  //  service.GetInvoiceDetailsBase64 = GetInvoiceDetailsBase64;
    // service.GetCpInvoice = GetCpInvoice;
    // service.GetInvoiceTemplate = GetInvoiceTemplate;
    return service;

  
    // function GetInvoiceDetailsBase64(token) {
     
    //   return Clique.callService('get', '/erp/quickbooks/getinvoice/?q=' + token, '').then(handleSuccess, handleError);
    // }

    

    function GetInvoiceDetails(token) {
     
      return Clique.callService('get', '/erp/quickbooks/getinvoice/?q=' + token, '').then(handleSuccess, handleError);
    }
    function CardConnectPayment(params) {
      return Clique.callService('post', '/cardconnect/sale/', params).then(handleSuccess, handleError);
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
