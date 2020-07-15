(function ()
{
    'use strict';

    angular
        .module('app.chat')
        .factory('ChatsService', ChatsService);

        ChatsService.$inject = ['$http', 'Clique', '$httpParamSerializer'];
      
    /** @ngInject */
    function ChatsService($http, Clique, $httpParamSerializer)
     {
        var service = {};
   
        service.GetCustomers = GetCustomers;
        service.GetInvoiceLink = GetInvoiceLink;
        service.PostChatData = PostChatData;
        service.GetChatData = GetChatData;
        service.GetCustomerInvoiceList = GetCustomerInvoiceList;
        service.PostContactNum = PostContactNum;
        
        return service;


        function GetCustomers() {
           
            return Clique.callService('get', '/erp/quickbooks/contact', '').then(handleSuccess, handleError);
        }
        function GetInvoiceLink(id) {
            return Clique.callService('get', '/sms/customer/messages/' + id ,  '' ).then(handleSuccess, handleError);
          }
          function PostChatData(params) {
            return Clique.callService('post', '/sms/send/', params).then(handleSuccess, handleError);
          }

          function GetChatData(invoice_id) {
           
            return Clique.callService('get', '/sms/list/'+ invoice_id , '').then(handleSuccess, handleError);
        }
        function GetCustomerInvoiceList(id,from,to,status) {

            // var qs = $httpParamSerializer(query);
            return Clique.callService('get', '/erp/quickbooks/invoice/?customer='+id+'&from='+from+'&to='+to+'&status='+status, '').then(handleSuccess, handleError);
        }
        function PostContactNum(params) {
            return Clique.callService('post', '/erp/quickbooks/contact/update/', params).then(handleSuccess, handleError);
          }
        //   function GetInvoiceLink(invoiceids) {
        //     return Clique.callService('post','/erp/quickbooks/invoice/link/',invoiceids).then(handleSuccess, handleError);
        // }

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