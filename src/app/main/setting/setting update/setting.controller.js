(function ()
{
    'use strict';

    angular
        .module('app.setting')
        .controller('TransactionController', TransactionController);

    /** @ngInject */
    function TransactionController($window, TransactionModel, $http, $compile, $rootScope, $filter, $scope, $timeout, $q, $mdDialog,  Clique, $mdSidenav, $log, $state, CliqueConstant)
    {

        $timeout(function () {
          angular.element('.fold-toggle').triggerHandler('click');
          angular.element('.fold-toggle').triggerHandler('click');
        }, 1000);
        // Data
        var vm = this;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        vm.openInvoiceDetail = openInvoiceDetail;
        vm.searchTransactions = searchTransactions;
        vm.printTransaction = printTransaction;
        vm.downloadReport = downloadReport;
    
        vm.searchAdvance = searchAdvance;
        $scope.searchingstatus = 'all';
        //$rootScope.foldedLeftPannel = false;
        $rootScope.title = "Invoices";
        $scope.showProgressbar = false;
        vm.invoiceSelectAction = false;
        $scope.enableAdvanceSearch = false;
        $scope.contentPage = false;
        $scope.paid = '';
        $scope.due = '';
        $scope.overdue = '';
        $scope.transSelection = [];
        $scope.searching = {
          amount_from: "",
          amount_to: "",
          customer: "",
          status: ""
    
        };  
        var originatorEv;
    
         this.openFiltermenu = function(ev) {
          originatorEv = ev;
          console.log("hello")
          $mdMenu.open(ev);
        };
    
        $scope.isOpen = false;
        $scope.selectedDirection = 'up';
        $scope.selectedMode = 'md-scale';
    
    
        $rootScope.companyInfo = localStorage.getItem("companyinfo");
        $rootScope.companyInfo = JSON.parse($rootScope.companyInfo);
    
    
    debugger;
        $scope.from_date = firstDay;
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        $scope.to_date = lastDay;
    
        $scope.currentCustomerInfo = JSON.parse(localStorage.getItem('CURRENT_CUSTOMER'));
        vm.userName = localStorage.getItem('username');
    
        // vm.selectedCustomerID = $scope.currentCustomerInfo.customer_id;
        vm.query = {
        //   status: $scope.searchingstatus,
        //   limit: 100,
        //   order: '-TxnDate',
        //   customer_id: vm.selectedCustomerID,
        //   page: 1,
        //   amount_from: "",
        //   amount_to: "",
        //   device_type: 'web',
        };
    
        function searchTransactions() {
          vm.query.from = $filter('date')($scope.from_date, "yyyy-MM-dd");
          vm.query.to = $filter('date')($scope.to_date, "yyyy-MM-dd");
        //   vm.query.customerName = $scope.searching.customer;
        //   vm.query.amount_from = $scope.searching.amount_from;
        //   vm.query.amount_to = $scope.searching.amount_to;
          if ($scope.searching.status == '') {
            // vm.query.status = ""
          } else {
            // vm.query.status = $scope.searching.status;
          }
          $scope.showProgressbar = true;
    debugger;
          vm.promise = TransactionModel.GetAllTransaction(vm.query);
          vm.promise.then(function (response) {

            if (response.statuscode == 0) {
                debugger;
              vm.invoices = response.data;
              vm.InvoiceData = vm.invoices.items;
              $scope.showProgressbar = false;
              $timeout(function () {
                $scope.contentPage = true;
              }, 900);
              $scope.transSelection = [];
            } else {
              Clique.showToast(response.statusmessage, 'bottom right', 'error');
              $scope.showProgressbar = false;
              $scope.transSelection = [];
            }
          });
          $mdSidenav('left').close();
        }
        $scope.filterInvoices = function(x){
     
          console.log(x);
          console.log(vm.InvoiceData);
          switch(x){
            case '0':
              vm.status = undefined
              console.log(vm.status)
              break;
            case 'declined':
              vm.status = 'declined'
              console.log(vm.status)
              break;
            case 'approved':
              vm.status = 'approved'
              console.log(vm.status)
              break;
          }
          
        }
        // Search Filter 
        // cardholder_name: searching.customer, trans_amount:searching.amount_from || searching.amount_to
        $scope.searchEngine = function(x){
     
          console.log('value is',x);
          // console.log(vm.InvoiceData);
          // switch(x){
          //   case '0':
          //     vm.status = undefined
          //     console.log(vm.status)
          //     break;
          //   case 'declined':
          //     vm.status = 'declined'
          //     console.log(vm.status)
          //     break;
          //   case 'approved':
          //     vm.status = 'approved'
          //     console.log(vm.status)
          //     break;
          // }
          
        }
        function GetTransactions() {
          searchTransactions()
        }
        GetTransactions();
        // GetInvoiceDetail();
    
        // function GetInvoiceDetail() {
        //   // debugger;
        //   $scope.promise = InvoiceModel.GetInvoiceDetails();
        //   $scope.promise.then(function (response) {
        //     // debugger;
        //     if (response.statuscode == 0) {
        //       var data = response.data;
        //       vm.company = data.company;
        //       $rootScope.companyInfo = vm.company;
        //       localStorage.setItem('companyinfo', JSON.stringify($rootScope.companyInfo));
        //     }
        //   })
        // }
    
        function printTransaction() {
          var transDetails = '';
          angular.forEach($scope.transSelection, function (value, key) {
            var payment_data = value.payment_data;
    
            if (value.trans_type != undefined) {
              transDetails += '<tr>' +
                '<td align="left" width="50%">Trans. Type:</td>' +
                '<td width="50%" class="ng-binding">' + transactionType(value.trans_type) + '</td>' +
                '</tr>';
            }
    
            if (value.customer_name != undefined) {
              transDetails += '<tr>' +
                '<td align="left" width="50%">Customer Name:</td>' +
                '<td width="50%" class="ng-binding" style="text-transform: capitalize">' + value.customer_name + '</td>' +
                '</tr>' +
                '<tr>';
            }
            if (value.trans_timestamp != undefined) {
              transDetails += '<tr>' +
                '<td align="left">Trans. Date:</td>' +
                '<td class="ng-binding">' + timeConverter(value.trans_timestamp) + '</td>' +
                '</tr>';
            }
            if (value.trans_amount != undefined) {
              transDetails += '<tr>' +
                '<td align="left">Trans. Amount:</td>' +
                '<td class="ng-binding">$' + parseFloat(value.trans_amount).toFixed(2) + '</td>' +
                '</tr>';
            }
            if (value.invoice_no != undefined) {
              transDetails += '<tr>' +
                '<td align="left">Inv/Sale #:</td>' +
                '<td class="ng-binding">' + value.invoice_no + '</td>' +
                '</tr>';
            }
            if (value.status != undefined) {
              transDetails += '<tr>' +
                '<td align="left">Trans. Status:</td>' +
                '<td class="ng-binding" style="text-transform:capitalize;">' + value.status + '</td>' +
                '</tr>';
            }
            if (value.trans_type == "sale") {
    
              transDetails += '<tr aria-hidden="true" class="ng-hide" style="">' +
                '<td align="left">Card #:</td>' +
                '<td class="ng-binding">xxxxxxxxxxxx' + value.last4digit + '</td>' +
                '</tr>' +
                '<tr aria-hidden="true" class="ng-hide">' +
                '<td align="left">Card Type:</td>' +
                '<td class="ng-binding">' + value.cardtype + '</td>' +
                '</tr>' +
                '<tr aria-hidden="true" class="ng-hide">' +
                '<td align="left">Cardholder:</td>' +
                '<td class="ng-binding" style="text-transform:capitalize;">' + value.cardholder_name + '</td>' +
                '</tr>';
            }
            if (payment_data.retref != undefined) {
              transDetails += '<tr>' +
                '<td align="left">Ref ID:</td>' +
                '<td class="ng-binding">' + payment_data.retref + '</td>' +
                '</tr>' +
                '<tr>';
    
            }
            if (payment_data.authcode != undefined) {
              transDetails += '<tr>' +
                '<td align="left">Auth Response:</td>' +
                '<td class="ng-binding">' + value.authcode + '</td>' +
                '</tr>' +
                '<tr><td colspan="2"><hr></td></tr>';
            }
          });
          // '<td colspan="2" align="center"><img src="' + $rootScope.companyInfo.logo + '" height="80"></td>' +
          var popupWin = window.open('', '_blank', '');
          popupWin.document.open();
          var printContent = '<div class="md-dialog-content print_receipt"><table id="print_receipt" width="350px">' +
            '<tbody><tr>' +
            '<td colspan="2" align="center"><img src="" height="80"></td>' +
            '</tr> ' +
            '<tr>' +
            '<td colspan="2">' +
            '<p align="center" class="ng-binding">' +
            '<strong class="ng-binding">' + $rootScope.companyInfo.name + '</strong><br>' +
            $rootScope.companyInfo.address1 + '<br>' +
            $rootScope.companyInfo.city + $rootScope.companyInfo.state + $rootScope.companyInfo.zipcode + '<br>' +
            'Phone: ' + $rootScope.companyInfo.phone +
            '</p>' +
            '</td>' +
            '</tr> ' +
            transDetails +
            '<tr>' +
            '<td colspan="2">' +
            '<p align="center">' +
            'Thank You<br>' +
            '*****************************<br>' +
            'Powered By<br>' +
            // 'CliquePayments Inc<br>' +
            // '(www.cliquepayments.com)' +
            '</p>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '</div>';
    
          popupWin.document.write('<html><head></head><body>' + printContent + '</body></html>');
          popupWin.document.close();
    
          popupWin.moveTo(0, 0);
          popupWin.resizeTo(screen.width, screen.height);
          $(popupWin.window).on("load", function () {
            popupWin.print();
            popupWin.close();
          });
        }
    
        function downloadReport(id) {
          $scope.selectedTransId = [];
          angular.forEach($scope.transSelection, function (value, key) {
            $scope.selectedTransId.push(value.trans_id);
          });
    
          vm.query.from = $filter('date')($scope.from_date, "yyyy-MM-dd");
          vm.query.to = $filter('date')($scope.to_date, "yyyy-MM-dd");
          // vm.query.customerName = $scope.searching.customer;
          vm.query.customer_id = vm.selectedCustomerID;
          vm.query.amount_from = $scope.searching.amount_from;
          vm.query.amount_to = $scope.searching.amount_to;
          vm.query.status = $scope.searching.status;
          vm.query.limit = 100;
          vm.query.order = '-TxnDate';
          vm.query.page = 1;
          vm.query.t_ids = id;
    
          var serviceurl = Clique.getServiceUrl();
          var endPoint = "/transaction/receiptdownload/?";
          vm.params = "from=" + vm.query.from + "&to=" + vm.query.to + "&customer_id=" + vm.query.customer + "&amount_from=" + vm.query.amount_from + "&amount_to=" + vm.query.amount_to + "&status=" + vm.query.status + "&limit=" + vm.query.limit + "&order=" + vm.query.order + "&page=" + vm.query.page + "&t_ids=" + vm.query.t_ids;
          var url = serviceurl + endPoint + vm.params
          $http({
            method: 'GET',
            url: url,
            responseType: "arraybuffer"
          }).then(function (response) {
            var blob = new Blob([response.data], {
              type: "application/pdf",
            });
            var fileURL = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            a.download = 'receipts.pdf';
            document.body.appendChild(a);
            a.click();
          });
        }
    
        function searchAdvance() {
          $scope.enableAdvanceSearch = true;
        }
    
        function openInvoiceDetail(invoice) {
          var invoice_status = '';
          if (invoice.Balance == 0) {
            invoice_status = 'paid';
          } else {
            invoice_status = 'unpaid';
          }
          sessionStorage.setItem('invoice_detail', JSON.stringify(invoice));
          $state.go('app.invoice-detail', {
            id: invoice.DocNumber
          });
    
        }
    
        function timeConverter(UNIX_timestamp) {
          var a = new Date(UNIX_timestamp * 1000);
          var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          var year = a.getFullYear();
          var month = months[a.getMonth()];
          var date = a.getDate();
          var hour = a.getHours();
          var min = a.getMinutes();
    
    
          var ampm = hour >= 12 ? 'pm' : 'am';
          hour = hour % 12;
          hour = hour ? hour : 12; // the hour '0' should be '12'
          min = min < 10 ? '0' + min : min;
    
          var sec = a.getSeconds();
          var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec + " " + ampm;
          return time;
        }
    
        function transactionType(value) {
          var trans_type = "";
          switch (value) {
            case "sale":
              trans_type = "Sale";
              break;
            case "void":
              trans_type = "Void";
              break;
            case "refund":
              trans_type = "Refund";
              break;
            case "profile_delete":
              trans_type = "Profile Delete";
              break;
            case "profile_update":
              trans_type = "Profile Update";
              break;
            case "profile_refund":
              trans_type = "Profile Refund";
              break;
            case "profile_void":
              trans_type = "Profile Void";
              break;
            case "profile_sale":
              trans_type = "Profile Sale";
              break;
            case "bolt_sale":
              trans_type = "Bolt Sale";
              break;
            case "cash":
              trans_type = "Cash";
              break;
            case "ach_sale":
              trans_type = "Ach Sale";
              break;
            case "triposipp350_credit":
              trans_type = "Tripos Credit";
              break;
            case "triposipp350_debit":
              trans_type = "Tripos Debit";
              break;
            case "triposipp350_gift":
              trans_type = "Tripos Gift";
              break
          }
          return trans_type;
    
        }


        $scope.sendReceiptDialog = function () {
            $mdDialog.show({
                    controller: ReceiptController,
                    templateUrl: 'app/main/setting/sendConfirmationDialog.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    //targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function () {

                });
        };

        $scope.emailReceipt = function () {
debugger;
            $scope.settings = {
                InvoiceContacts: {
                    sender_email: '',
                    sender_name: '',
                    cc_email: [],
                    bcc_email: [],
                    to_email: [],
                    save_email_erp: false,
                },
                subject: '',
                template_id: '',
                title: "Send Reciept"
            };

            // var receipt_type = "normal";
            // var isTriposipp350 = transType.search("triposipp350");
            // if (isTriposipp350 == 0) {
            //     receipt_type = "triposipp350";
            // }


            // var customer_email = transData.customer_email;
            $scope.promise = TransactionModel.GetSettings();
            $scope.promise.then(function (response) {
                if (response.statuscode == 0) {
                    debugger;
                    $scope.settings = response.data;
                    console.log($scope.settings);
                    $scope.settings.title = "Send Receipt";
                    // $scope.settings.transaction = transData;
                    // $scope.settings.companyInfo = $rootScope.companyInfo.company;
                    // $scope.settings.receipt_type = receipt_type;

                    $scope.settings.InvoiceContacts.to_email = [];
                    // if (customer_email != null || customer_email != "null") {
                    //     // $scope.settings.InvoiceContacts.to_email.push(customer_email);
                    //     $scope.settings.InvoiceContacts.to_email = customer_email.split(",");

                    // }
                    try {
                        if (customer_email != null) {
                            // $scope.settings.InvoiceContacts.to_email.push(customer_email);
                            $scope.settings.InvoiceContacts.to_email = customer_email.split(",");
                        }
                    } catch (err) {
                        console.log("TCL: $scope.emailReceipt -> err", err)
                    }
                    $scope.sendReceiptDialog();
                }
                $scope.sendReceiptDialog();
            });

        };
        $scope.toggleLeft = buildToggler('left');
        $scope.clear = function() {
          // $mdSidenav('left').close();
        }
        function buildToggler(componentId) {
          return function() {
            $mdSidenav(componentId).toggle();
          }
        }







        function ReceiptController($timeout, $mdDialog, $filter, triSkins, $window, $rootScope, $scope, SettingModel, Clique, TransactionModel) {

            $scope.disabledSubmitButton = false;
            $scope.showCCSIcon = 'zmdi zmdi-account-add';
            $scope.showCCS = false;

            if ($scope.settings.InvoiceContacts.to_email.length > 0) {
                $scope.disabledSubmitButton = false;
            } else {
                $scope.disabledSubmitButton = true;
            }

            $scope.toggleCCS = function () {
                $scope.showCCS = !$scope.showCCS;
                $scope.showCCSIcon = $scope.showCCS ? 'zmdi zmdi-account' : 'zmdi zmdi-account-add';
            }


            $scope.cancel = function () {
                $mdDialog.hide();
            }
            $scope.validateChip = function ($chip, type) {
                if (!$chip) return;
                // check if the current string length is greater than or equal to a character limit.
                var reg = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                if (!reg.test($chip)) {
                    if (type == "bcc") {
                        $scope.settings.InvoiceContacts.bcc_email.pop();
                    }
                    if (type == "cc") {
                        $scope.settings.InvoiceContacts.cc_email.pop();
                    }
                    if (type == "to") {
                        $scope.settings.InvoiceContacts.to_email.pop();
                    }
                }
                if (type == "to") {
                    if ($scope.settings.InvoiceContacts.to_email.length == 0) {
                        $scope.disabledSubmitButton = true;
                    } else {
                        $scope.disabledSubmitButton = false;
                    }
                }
            }
            $scope.submit = function () {
                $scope.showProgress = true;
                $scope.disabledSubmitButton = true;
                var receiptData = {
                    companyInfo: $scope.settings.companyInfo,
                    transaction: $scope.settings.transaction,
                    contact: $scope.settings.InvoiceContacts,
                    receiptType: $scope.settings.receipt_type
                }
                vm.promise = TransactionModel.sendReceipt(receiptData);
                vm.promise.then(function (response) {
                    if (response.statuscode == 0) {

                        Clique.showToast(response.statusmessage, 'bottom right', 'success');
                    } else {

                        Clique.showToast(response.statusmessage, 'bottom right', 'error');
                    }
                    $scope.showProgress = false;
                    $mdDialog.hide();

                });
            }

            ////////////////

        }












      }
})();
