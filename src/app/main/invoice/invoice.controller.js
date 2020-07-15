(function ()
{
    'use strict';

    angular
        .module('app.invoice')
        .controller('InvoiceController', InvoiceController);

    /** @ngInject */
    function InvoiceController($scope,$mdDialog, InvoiceModel, $stateParams, $http, $filter, $window)
    {
         
    
       var token = $stateParams.token;
      $http.defaults.headers.common['INVOICETOKEN']= token;
      sessionStorage.setItem('INVOICETOKEN', token);
      localStorage.setItem('INVOICETOKEN', token);
     // console.log("token1" , token);
        var vm = this;
        vm.getitems = [];
        vm.itemname = [];
        vm.itemamount = [];
        vm.getclick = getclick ;
        vm.redirecttoback = redirecttoback;
        vm.checkoutshow = false;
        vm.invoiceshow = true;
        vm.paymentprocessshow = false;
        vm.paymentprocesssuccess = false;
        vm.paymentprocessunsuccess = false;
        vm.paymentprosuccess = false;
        $scope.myFunction ;
        $scope.showProgress = false;

        // for( var i = 0; i < 2; i++){ 
        // vm.getitems.push(array1[i]);
        // }
         console.log(vm.getitems);

  //  getclick();
  
  $scope.myFunction = function(ev){
   
    var e = event || window.event;  // get event object
    var key = e.keyCode || e.which; // get key cross-browser
debugger;
    if ( key > 64 && key < 91 ) { //if it is not a number ascii code
        //Prevent default action, which is inserting character
        if (e.preventDefault)
        {
          e.preventDefault();
          //normal browsers
        e.returnValue = false; //IE
      }
    }
  }

     GetInvoice();
     function GetInvoice() {
      
console.log("avascas");
       $scope.promise = InvoiceModel.GetInvoiceDetails(token);
       $scope.promise.then(function (response) {
       //  console.log(response);
         if (response.statuscode == 0) {
          $scope.showProgress = true;
          var date = new Date();
          // console.log("$scope.date", vm.datetime);
          vm.datetime = $filter("date")(Date.now(), 'yyyy-MM-dd');
            debugger;
           vm.invoicecompanydetails = response.data.company;
           vm.invoicecustomerdetails = response.data.invoice;
           vm.erptype = response.data.erptype.type;

           vm.companyaddress = vm.invoicecompanydetails.address1;
           vm.companystate = vm.invoicecompanydetails.state;
           vm.companycity = vm.invoicecompanydetails.city;
           vm.companycountry = vm.invoicecompanydetails.country;
           vm.companyname = vm.invoicecompanydetails.name;
           vm.companyphone = vm.invoicecompanydetails.phone;
            vm.strFirstThree = vm.companyname.substring(0,3);
           
          vm.Balance = vm.invoicecustomerdetails[0].Balance;
          vm.invoice_id =  vm.invoicecustomerdetails[0].Id;
          vm.docId = vm.invoicecustomerdetails[0].DocNumber;
        vm.customername = vm.invoicecustomerdetails[0].CustomerRef.name;
        vm.customerid = vm.invoicecustomerdetails[0].CustomerRef.value;
        vm.companylogo = vm.invoicecompanydetails.logo;
         vm.emailinvoiceemail = vm.invoicecustomerdetails[0].BillEmail.Address;
       vm.Zipcode = vm.invoicecompanydetails.zipcode;
      vm.email = vm.invoicecustomerdetails[0].BillEmail.Address;



      //  for taxdetails

vm.taxamount = vm.invoicecustomerdetails[0].TxnTaxDetail.TotalTax;
console.log("vm.taxamount",vm.taxamount);



for(var i = 0; i < vm.invoicecustomerdetails[0].Line.length - 1; i++){

        vm.itemname.push(vm.invoicecustomerdetails[0].Line[i]);
        // vm.itemamount.push(vm.invoicecustomerdetails[0].Line[i].Amount);
}
         }
       })
     }


     function redirecttoback(){
       

  //      console.log($stateParams.token);
    
  //      var windowlocation = $window.location;    
  //  console.log("windowlocation",windowlocation.origin);
  //  var abcd = windowlocation.origin+"/invoice/"+$stateParams.token; 
  // console.log("url", abcd);
  //  // $state.go(abcd);
  //  $window.location.href = abcd;
  vm.checkoutshow = false;
  vm.invoiceshow = true;
   // console.log("state",$state);
     }


     
     function getclick() {
    
    
    
              // $mdDialog.show({
                 console.log("vm.checkoutshow", vm.checkoutshow);
              //     controller: InvoiceController,
              //     templateUrl: 'app/main/invoice/cardpayment.html',
              //      parent: angular.element(document.body),
              //     targetEvent: null,
              //     clickOutsideToClose: true,
              //     fullscreen: false
              // })
              //     .then(function (answer) { }, function () { });
              vm.checkoutshow = true;
              vm.invoiceshow = false;
              console.log("vm.checkoutshow", vm.checkoutshow);
              console.log("vm.invoiceshow", vm.invoiceshow);
          }

                $scope.submit = function () {
 
             vm.invoiceshow = false;
           vm.checkoutshow = false;
            vm.paymentprocessshow = true;

            console.log("vm.checkoutshow", vm.checkoutshow);
          


            var cardholder = vm.form.cardholder;
            var creditCardNumber = vm.form.cardnumber;
            var expdate = vm.form.datetime;
            var cc2 = vm.form.cc2;
            var zipcode = vm.Zipcode;
            var billemail =  vm.email;
            var emailreceipt = vm.form.emailreceipt;

//for date split 
var datetime = expdate.split("/");
vm.expmonth = datetime[0];
vm.expyear = datetime[1];

debugger;

            var paymentObj = {
              paymentinfo: {
                Amount: vm.Balance,
                Streetaddress: " ",
                Zipcode: zipcode,
                TransType: 'sale',
                Type: 'invoice',
                ErpType: vm.erptype,
                Beneficiary: {
                  IsEmail: emailreceipt,
                  Email: billemail
                },
                Cardinfo: {
                  Cardholder: cardholder,
                  CreditCardNumber: creditCardNumber.toString(),
                  Month: vm.expmonth,
                  Year: vm.expyear,
                  CCV2: cc2,
                  CardType: " "
                },
                Custom: {
                  CustomerRef: {
                    Id:  vm.customerid,
                    Name: vm.customername,
                    Email: vm.emailinvoiceemail
                  },
                  Invoice: {
                    Id: vm.invoice_id,
                    DocId: vm.docId
                  }
                }
              }
            };
    
           $scope.promise = InvoiceModel.CardConnectPayment(paymentObj);
       $scope.promise.then(function (response) { 
        
        if (response.statuscode == 0) {   
        
          vm.paymentmessage = response.statusmessage;
   vm.paymentprocessshow = false;
   vm.paymentprocesssuccess = true; 
  
  
        }
        else if(response.statuscode == 1){
          vm.paymentprocessshow = false;
          vm.paymentprocesssuccess = false; 
          vm.paymentprosuccess = true; 
          vm.paymentprocessunsuccess = true; 
          
          vm.unsuccmessage = response.statusmessage;
        }
    });

     }





   }  
})();
