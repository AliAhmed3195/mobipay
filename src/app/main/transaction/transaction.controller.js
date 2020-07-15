(function ()
{
    'use strict';

    angular
        .module('app.transaction')
        .controller('TransactionController', TransactionController);

    /** @ngInject */
    function TransactionController($window, printer,helper,  TransactionModel, $http, $compile, $rootScope, $filter, $scope, $timeout, $q, $mdDialog,  Clique, $mdSidenav, $log, $state, CliqueConstant, VantivTriPOSiPP350)
    {
     
//         console.log("printer", printer);
// console.log("VantivTriPOSiPP350", VantivTriPOSiPP350);
        $timeout(function () {
          angular.element('.fold-toggle').triggerHandler('click');
          angular.element('.fold-toggle').triggerHandler('click');
        }, 1000);
        // Data
        var vm = this;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        vm.openInvoiceDetail = openInvoiceDetail;
        vm.getTransaction = getTransaction;
        vm.printTransaction = printTransaction;
        vm.downloadReport = downloadReport;
        activate();
        vm.searchAdvance = searchAdvance;
        $scope.searchingstatus = 'all';
        //$rootScope.foldedLeftPannel = false;
        $rootScope.title = "Invoices";
        $scope.showProgressbar = false;
        vm.invoiceSelectAction = false;
        $scope.enableAdvanceSearch = false;
        $scope.contentPage = false;
        vm.isTransactionLoaded = false;
        $scope.paid = '';
        $scope.due = '';
        $scope.overdue = '';
        var supportVoidRefund = false;
        vm.fileName = ''
        vm.newfileName = ''
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
    
    
    // debugger;
        $scope.from_date = firstDay;
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        $scope.to_date = lastDay;
    
        $scope.currentCustomerInfo = JSON.parse(localStorage.getItem('CURRENT_CUSTOMER'));
        vm.userName = localStorage.getItem('username');
    
        // vm.selectedCustomerID = $scope.currentCustomerInfo.customer_id;
        vm.query = {
      
        };
    

        vm.disabledVoidOption = function (item) {
            // debugger;

            switch (item.trans_type) {
                case "triposipp350_debit":
                    return true;
                    break;
                case "triposipp350_gift":
                    return true;
                    break;
                default:
                    // remain_amount is not updated from server
                    if (item.trans_amount != item.remain_amount || item.trans_amount <= 0) {
                        return true;
                    } else {
                        return false;
                    }
                    break;
            }
            return true;
        }

        $scope.resetForm = function () {
            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth();
            vm.query = {
                // status: '',
                // order: '-trans_timestamp',
                // customer: '',
                // limit: 15,
                // page: 1
            }
            $scope.from = new Date(y, m, 1);
            $scope.to = new Date(y, m + 1, 0)
            sessionStorage.setItem("transaction_search", "{}");

        }


        function getTransaction() {
           
          vm.query.from = $filter('date')($scope.from_date, "yyyy-MM-dd");
          vm.query.to = $filter('date')($scope.to_date, "yyyy-MM-dd");
          vm.fileName = $filter('date')(new Date(), "dd/MM/yy");

          vm.query.limit = 100;
          vm.query.order = '-TxnDate';
          vm.query.page = 1;




        //   vm.query.customerName = $scope.searching.customer;
        //   vm.query.amount_from = $scope.searching.amount_from;
        //   vm.query.amount_to = $scope.searching.amount_to;
          if ($scope.searching.status == '') {
            // vm.query.status = ""
          } else {
            // vm.query.status = $scope.searching.status;
          }
          $scope.showProgressbar = true;

          vm.promise = TransactionModel.GetAllTransaction(vm.query);
      
          vm.promise.then(function (response) {

            if (response.statuscode == 0) {
          
            //   vm.invoices = response.data;
            //   vm.InvoiceData = vm.invoices.items;
            filterArray(response.data.items)
            vm.isTransactionLoaded = true;
            }
            // vm.isTransactionLoaded = false;
            //  else {
            //   Clique.showToast(response.statusmessage, 'bottom right', 'error');
            //   $scope.showProgressbar = false;
            //   $scope.transSelection = [];
            // }
          });
          $mdSidenav('left').close();
        }

        vm.isTransactionLoaded = false;
        function filterArray(data) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (data[i].ref_id === data[j].ref_id && data[i].trans_id !== data[j].trans_id) {
                        if (data[j].trans_type == "refund" || data[j].trans_type == "void") {
                            data[i].subtrans.push(data[j])
                            data[j].subtrans = []
                        }
                    }
                }
            }
            var result = []
            for (var x = 0; x < data.length; x++) {
                if (!(data[x].trans_type == "refund" || data[x].trans_type == "void")) {
                    result.push(data[x])
                }
            }
            for (var y = 0; y < result.length; y++) {
                if (result[y].subtrans.length > 0) {
                    var sum = 0;
                    for (var z = 0; z < result[y].subtrans.length; z++) {
                        if (result[y].subtrans[z].trans_type == "refund") {
                            sum += result[y].subtrans[z].trans_amount
                            result[y].remain_amount = result[y].trans_amount - sum
                        } else {
                            result[y].remain_amount = 0
                        }
                    }
                }
            }
            vm.InvoiceData = result;
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
        function activate() {
        
            var bookmark;
            $scope.$watch('vm.query.filter', function (newValue, oldValue) {
                //console.log('watching');
                if (!oldValue) {
                    bookmark = vm.query.page;
                }

                if (newValue !== oldValue) {
                    vm.query.page = 1;
                }

                if (!newValue) {
                    vm.query.page = bookmark;
                }

                vm.getTransaction();
            });
        }
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
        //   vm.query.limit = 10;
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





     
        $scope.promise = TransactionModel.GetPaymentInfo();
        $scope.promise.then(function (response) {
            if (response.statuscode == 0) {

                ///Get Settings/////
                $scope.promise = TransactionModel.GetCompanyInfo();
               
                $scope.promise.then(function (response) {
                    if (response.statuscode == 0) {
                    // debugger;
                        $rootScope.companyInfo = response.data;

                    }
                });

                $scope.paymentInfo = response.data;
                if (response.data.total_count > 0) {
                    angular.forEach(response.data.items, function (value, key) {
                   
                        var is_default = value.is_default;
                        var voidrefund = value.voidrefund;

                        if (is_default == true) {


                            if (helper.checkHardwareModel(value, 'triposipp350') == true) {
                                $scope.hardwareSupport.triposipp350 = true;
                                VantivTriPOSiPP350.config.serviceAddress = value.configuration.hardware.triposipp350.service_address;
                                VantivTriPOSiPP350.config.tpAuthorizationCredential = value.configuration.hardware.triposipp350.developer_key;
                                VantivTriPOSiPP350.config.tpAuthorizationSecret = value.configuration.hardware.triposipp350.developer_secret;

                                if ($scope.laneId == null || $scope.laneId == undefined) {
                                    //Get Lane Information
                                    VantivTriPOSiPP350.getLaneInfo(VantivTriPOSiPP350.config, function (res) {
                                        var response = res.data;
                                        $scope.triPOSLaneInfo = response;
                                        $scope.triPOSLaneInfo._hasErrors;
                                        if ($scope.triPOSLaneInfo._hasErrors == true) {
                                            $scope.triPOSLaneInfo.errorMessage = response._errors[0].developerMessage;
                                        } else {
                                            $scope.laneId = parseInt($scope.triPOSLaneInfo.ipLanes[0].laneId);
                                        }
                                    });
                                }

                            }
                            if (voidrefund == true) {
                                //
                                supportVoidRefund = true;
                                vm.tblAction = [{
                                        name: 'Void',
                                        icon: 'fa fa-plus',
                                        method: 'call-void',
                                        class: "md-warn md-raised md-small"
                                    },
                                    {
                                        name: 'Refund',
                                        icon: 'fa fa-minus',
                                        method: 'call-refund',
                                        class: "md-primary md-raised md-small"
                                    }
                                ];

                                $rootScope.$on("call-void", function (event, params) {
                                    callVoid(params);
                                });
                                $rootScope.$on("call-refund", function (event, params) {
                                    callRefund(params);
                                });


                            }

                        } ///
                    });
                }
            }
        });

//        
        // $scope.emailReceipt();
        $scope.emailReceipt = function (transData, transType) {
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

            var receipt_type = "normal";
            var isTriposipp350 = transType.search("triposipp350");
            if (isTriposipp350 == 0) {
                receipt_type = "triposipp350";
            }


            var customer_email = transData.customer_email;
            $scope.promise = TransactionModel.GetSettings();
            $scope.promise.then(function (response) {
                if (response.statuscode == 0) {
                 debugger;
                    $scope.settings = response.data;
                    console.log($scope.settings);
                    $scope.settings.title = "Send Receipt";
                    $scope.settings.transaction = transData;
                    $scope.settings.companyInfo = $rootScope.companyInfo.company;
                    $scope.settings.receipt_type = receipt_type;

                    $scope.settings.InvoiceContacts.to_email = [];
                    // if (customer_email != null || customer_email != "null") {
                    //     debugger;
                    //     $scope.settings.InvoiceContacts.to_email.push(customer_email);
                    //     $scope.settings.InvoiceContacts.to_email = customer_email.split(",");

                    // }
                    try {
                        if (customer_email != null) {
                            $scope.settings.InvoiceContacts.to_email.push(customer_email);
                            $scope.settings.InvoiceContacts.to_email =   customer_email.replace(/[\[\]']+/g,'');
                            $scope.settings.InvoiceContacts.to_email =  $scope.settings.InvoiceContacts.to_email.split(",");
                            // var WithOutBrackets="[test]".replace(/[\[\]']+/g,'');
                        }
                    } catch (err) {
                        console.log("TCL: $scope.emailReceipt -> err", err)
                    }
                    $scope.sendReceiptDialog();
                }
             
            });

        };
        $scope.sendReceiptDialog = function () {
         
            $mdDialog.show({
                controller: ReceiptController,
                templateUrl: 'app/main/transaction/sendConfirmationDialog.html',
                parent: angular.element(document.body),
                scope: $scope.$new(),
                //targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function (answer) {

            }, function () {

            });
        };
        $scope.callVoid = function (transData, transType) {
        
            $rootScope.transData = transData;
            $rootScope.parentTransType = transType;
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'app/main/transaction/transaction.void.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    scope: $scope,
                    preserveScope: true
                })
                .then(function (answer) {}, function () {});
        }
        $scope.callRefund = function (transData, transType) {
            $rootScope.transData = transData;
            $rootScope.parentTransType = transType;
       
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'app/main/transaction/transaction.refund.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    scope: $scope,
                    preserveScope: true
                })
                .then(function (answer) {}, function () {});
        }
        $scope.printReceipt = function (transData, transType) {
          
            $rootScope.parentTransType = transType;
          
            $rootScope.transactionResponse = transData;
            callPrintReceipt();
        }
        function callPrintReceipt() {

            var receipt_template = "transaction.print.html";
            var isTriposipp350 = ($rootScope.transactionResponse.trans_type).search("triposipp350");
            if (isTriposipp350 == 0) {
                var transData = $rootScope.transactionResponse;
                receipt_template = "transaction.triposipp350.print.html";
            } else if ($rootScope.parentTransType != undefined) {
                if (($rootScope.parentTransType).search("triposipp350") == 0) {
                    receipt_template = "transaction.triposipp350.print.html";
                }
            }
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'assets/' + receipt_template,
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    fullscreen: true
                })
                .then(function (answer) {}, function () {});
        }


        $scope.toggleLeft = buildToggler('left');
        $scope.clear = function() {
          // $mdSidenav('left').close();
        }
        function buildToggler(componentId) {
          return function() {
            $mdSidenav(componentId).toggle();
          }
        }



        $scope.logPagination = function (page, limit) {
            debugger;
            sessionStorage.setItem('invoice_current_page', page);
        }



        function ReceiptController($timeout, $mdDialog, $filter,  $window, $rootScope, $scope,  Clique, TransactionModel)
         {

            $scope.disabledSubmitButton = false;
            $scope.showCCSIcon = 'zmdi zmdi-account-add';
            $scope.showCCS = false;

            if ($scope.settings.InvoiceContacts.to_email.length > 0) {
                debugger;
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
               debugger;
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

   

      function DialogController($window, $scope, $mdDialog) {

        $scope.transData = $rootScope.transData;
        $scope.companyInfo = $rootScope.companyInfo;
        $scope.hideDialogActions = false;
        $scope.hideEmailReceiptButton = true;
        $scope.transactionResponse = $rootScope.transactionResponse;
        $scope.refund_amount = 0.0;


        $scope.confirm = function (task) {


            var transType = $scope.transData.trans_type;
            var expr = /triposipp350/;


            if (task == 'void') {

           
                if (transType.match(expr) && $scope.hardwareSupport.triposipp350) {
                    $scope.processTriPosVoid($scope.transData, task);
                } else {
                    $scope.processRefundAndVoid(task);
                }
            } else if (task == 'refund') {

                var title = (task == 'refund' ? 'Are you sure you want to refund?' : 'Are you sure you want to void this payment?');
                var confirm = $mdDialog.confirm()
                    .title(title)
                    .textContent('')
                    .ariaLabel('Confirmation')
                    //.targetEvent(ev)
                    .ok('Confirm')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function () {
               
                    if (transType.match(expr) && $scope.hardwareSupport.triposipp350) {
                        $scope.processTriPosRefund($scope.transData, task);
                    } else {

                        $scope.processRefundAndVoid(task);
                    }
                    //$scope.processRefundAndVoid(task);
                }, function () {
                    console.log("error")

                });
            }

        };



        $scope.processTriPosVoid = function (transData, task) {
       
            $scope.showProgress = true;
            $scope.hideDialogActions = true;
            var trans_id = transData.ref_id;
            var trans_type = (transData.trans_type).split('_');
            var url = VantivTriPOSiPP350.config.serviceAddress + 'api/v1/void/' + trans_id;
            var params = {
                laneId: $scope.laneId
            };

            VantivTriPOSiPP350.processVoidRefund(
                url,
                params,
                VantivTriPOSiPP350.config,
                function (res) {
                    $scope.showProgress = false;
                    $scope.hideDialogActions = false;
                    var response = res.data;
                    var triPOSResponse = response;
                    if (triPOSResponse._hasErrors == true) {
                        var error_message = response._errors[0].developerMessage;
                        Clique.showToast(error_message, 'bottom right', 'error');
                        $mdDialog.hide();
                    } else {

                        var transStatus = "";
                        var reason = "";
                        if (triPOSResponse.isApproved == true) {
                            transStatus = "approved";
                        } else {
                            transStatus = "declined";
                            reason = triPOSResponse._processor.processorResponseMessage;
                        }

                        var RawResponse = "";
                        var ResponseCode = "";
                        var processorRawResponse = "";
                        var xml2json = x2js.xml_str2json(triPOSResponse._processor.processorRawResponse);
                        RawResponse = xml2json.CreditCardVoidResponse.Response;
                        if (transStatus == 'approved') {
                            ResponseCode = triPOSResponse._processor.hostResponseCode + "/" + triPOSResponse._processor.hostResponseMessage;
                        } else {
                            ResponseCode = triPOSResponse._processor.expressResponseCode + "/" + triPOSResponse._processor.expressResponseMessage;
                        }
                        var ProcessorInfo = "";
                        ProcessorInfo = {
                            processorRawResponse: {
                                RawResponse: RawResponse,
                                MerchantId: triPOSResponse.merchantId,
                                TerminalId: triPOSResponse.terminalId,
                                ApprovalNumber: triPOSResponse.approvalNumber,
                                paymentType: 'Void',
                                ResponseCode: ResponseCode,
                            },
                            transactionId: triPOSResponse.transactionId,
                            TransStatus: transStatus,
                            StatusMessage: reason
                        }
                        $scope.transData.ProcessorInfo = ProcessorInfo;
                        $scope.transData.status = transStatus;
                        $scope.transData.statusmessage = reason;
                        $scope.transData.authcode = ResponseCode;
                        $scope.transData.payment_data = "";
                        $scope.processRefundAndVoid(task);

                    }
                });
        }
        $scope.processTriPosRefund = function (transData, task) {
      
            $scope.showProgress = true;
            $scope.hideDialogActions = true;
            var trans_id = transData.ref_id;
            var trans_type = (transData.trans_type).split('_');
            var url = VantivTriPOSiPP350.config.serviceAddress + 'api/v1/reversal/' + trans_id + '/' + trans_type[1];
            var refund_amount = parseFloat($scope.refund_amount);
            var params = {
                laneId: $scope.laneId,
                transactionAmount: refund_amount
            };

            VantivTriPOSiPP350.processVoidRefund(
                url,
                params,
                VantivTriPOSiPP350.config,
                function (res) {
                    $scope.showProgress = false;
                    $scope.hideDialogActions = false;

                    var response = res.data;
                    var triPOSResponse = response;
                    if (triPOSResponse._hasErrors == true) {
                        var error_message = response._errors[0].developerMessage;
                        Clique.showToast(error_message, 'bottom right', 'error');
                        $mdDialog.hide();
                    } else {
                     
                        var transStatus = "";
                        var reason = "";
                        if (triPOSResponse.isApproved == true) {
                            transStatus = "approved";
                        } else {
                            transStatus = "declined";
                            reason = triPOSResponse._processor.processorResponseMessage;
                        }



                        var RawResponse = "";
                        var ResponseCode = "";
                        var processorRawResponse = "";
                        var payment_type = ""
                        var xml2json = x2js.xml_str2json(triPOSResponse._processor.processorRawResponse);
                        payment_type = (triPOSResponse.paymentType).toLowerCase();
                        //RawResponse=xml2json.CreditCardReversalResponse.Response;
                        if (payment_type == 'credit') {
                            RawResponse = xml2json.CreditCardReversalResponse.Response;
                        } else if (payment_type == 'debit') {
                            RawResponse = xml2json.DebitCardReversalResponse.Response;
                        } else if (payment_type == 'gift') {
                            RawResponse = xml2json.GiftCardReversalResponse.Response;
                        }
                        if (transStatus == 'approved') {
                            ResponseCode = triPOSResponse._processor.hostResponseCode + "/" + triPOSResponse._processor.hostResponseMessage;
                        } else {
                            ResponseCode = triPOSResponse._processor.expressResponseCode + "/" + triPOSResponse._processor.expressResponseMessage;
                        }

                        var ProcessorInfo = "";
                        ProcessorInfo = {
                            processorRawResponse: {
                                RawResponse: RawResponse,
                                MerchantId: triPOSResponse.merchantId,
                                TerminalId: triPOSResponse.terminalId,
                                ApprovalNumber: triPOSResponse.approvalNumber,
                                paymentType: 'Refund',
                                ResponseCode: ResponseCode,
                            },
                            transactionId: triPOSResponse.transactionId,
                            TransStatus: transStatus,
                            StatusMessage: reason
                        }
                        $scope.transData.ProcessorInfo = ProcessorInfo;
                        $scope.transData.status = transStatus;
                        $scope.transData.statusmessage = reason;
                        $scope.transData.authcode = ResponseCode;
                        $scope.transData.payment_data = "";

                        $scope.processRefundAndVoid(task);

                    }
                });

        }

        $scope.processRefundAndVoid = function (task) {
 
            $scope.showProgress = true;
            $scope.hideDialogActions = true;


            if (task == 'refund') {
                var postData = $scope.transData;

                postData.refund_amount = $scope.refund_amount;
                postData.action = 'refund';
                postData.type = postData.process_type;

                vm.promise = TransactionModel.DoRefundTransaction(postData);
                vm.promise.then(function (response) {
                    if (response.statuscode == 0) {
                 
                        Clique.showToast(response.statusmessage, 'bottom right', 'success');
                        $rootScope.transactionResponse = response.data;
                        getTransaction();
                        callPrintReceipt();
                    } else {
                        Clique.showToast(response.statusmessage, 'bottom right', 'error');
                    }

                    $mdDialog.hide();

                    $scope.showProgress = false;
                });
            }
            if (task == 'void') {
            
                var postData = $scope.transData;
                postData.action = 'void';
                postData.type = postData.process_type;
                vm.promise = TransactionModel.DoVoidTransaction(postData);
                vm.promise.then(function (response) {
                    if (response.statuscode == 0) {
                
                        Clique.showToast(response.statusmessage, 'bottom right', 'success');
                        $rootScope.transactionResponse = response.data;
                        getTransaction();
                        callPrintReceipt();

                    } else {
                        Clique.showToast(response.statusmessage, 'bottom right', 'error');
                    }

                    $mdDialog.hide();
                    $scope.showProgress = false;
                });
            }
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.print = function () {
            var receipt_template = "transaction.print.html";
            var isTriposipp350 = ($scope.transactionResponse.trans_type).search("triposipp350");
            if (isTriposipp350 == 0) {
                receipt_template = "transaction.triposipp350.print.html";
            } else if ($rootScope.parentTransType != undefined) {
                if ($rootScope.parentTransType.search("triposipp350") == 0) {
                    receipt_template = "transaction.triposipp350.print.html";
                }
            }

            printer.print('assets/' + receipt_template, {
                transactionResponse: $scope.transactionResponse,
                companyInfo: $rootScope.companyInfo
            });


        };
    }









      }
})();
