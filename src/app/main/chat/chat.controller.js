(function ()
{
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);
        // (function() {

        //     app.directive('onlyLettersInput', onlyLettersInput);
            
        //     function onlyLettersInput() {
        //         return {
        //           require: 'ngModel',
        //           link: function(scope, element, attr, ngModelCtrl) {
        //             function fromUser(text) {
        //               var transformedInput = text.replace(/[^a-zA-Z]/g, '');
        //               //console.log(transformedInput);
        //               if (transformedInput !== text) {
        //                 ngModelCtrl.$setViewValue(transformedInput);
        //                 ngModelCtrl.$render();
        //               }
        //               return transformedInput;
        //             }
        //             ngModelCtrl.$parsers.push(fromUser);
        //           }
        //         };
        //       };
          
        //   })();
    /** @ngInject */
    function ChatController($scope ,$cookies,$window,$mdDialog,   $rootScope, Contacts,$filter, Clique, ChatsService, $mdSidenav, User, $timeout, $document, $mdMedia)
    {




        var vm = this;

        // Data
        $scope.hideDialogActions = false;
        vm.contactsss = ChatsService.contacts = Contacts.data;
        console.log("vm.contacts", vm.contactsss);
        vm.chats = ChatsService.chats;
        vm.user = User.data;
        vm.leftSidenavView = false;
         vm.chat = 0;
         vm.customer_num = ''; 
        // Methods
        vm.getChat = getChat;
        vm.getchatinvoicelisting = getchatinvoicelisting;
        vm.showinvoicegrid = false;
        vm.toggleSidenav = toggleSidenav;
        // vm.toggleSidenavchat = toggleSidenavchat;
        vm.toggleLeftSidenavView = toggleLeftSidenavView;
        vm.reply = reply;
        vm.showmessage = showmessage;
        vm.setUserStatus = setUserStatus;
        vm.clearMessages = clearMessages;
        vm.textmessage = 0;
       $scope.chatmessagedata = [] ;
       $scope.showprogress = false;
       vm.closeside = closeside;
       vm.showinvoicelist = false;
       vm.showinvoicelisting = showinvoicelisting;
       vm.chatscustomerlist = [];
       vm.closedialog = closedialog;
    
        var color;
        //////////

        /**
         * Get Chat by Contact id
         * @param contactId
         */




        vm.getmerchantname = getmerchantname;
        getmerchantname();
        function getmerchantname() {
            // debugger;
            if ($cookies.get("USERINFO") != null){
        vm.merchant_nameinfo = $cookies.get("USERINFO");
        console.log("vm.merchant_name1", vm.merchant_nameinfo);
        vm.merchantInfo = JSON.parse(decodeURI($cookies.get("USERINFO")));
        vm.merchant_name = vm.merchantInfo.name;
        console.log("vm.merchant_name2", vm.merchant_name);
        console.log("vm.merchant_name3", vm.merchantInfo);
            }
            else {
                vm.merchant_name = 'John Smith';

            }
        }

        // capitalizeFirstLetter();
        // function capitalizeFirstLetter(string) {
        //     return string.charAt(0).toUpperCase() + string.slice(1);
        //   }
   



$scope.confirm = function(value){
    debugger;
    vm.contactnumber = value;
var SyncToken = sessionStorage.getItem('SyncToken');
var i = sessionStorage.getItem('count');


console.log("abc", value);
var postNumber = {
    Id: vm.customer_id,
    SyncToken: SyncToken,
    DisplayName : vm.customer_name,
    PrimaryPhone: {
        FreeFormNumber: vm.contactnumber 
      }
  }  
if(vm.contactnumber  == vm.customer_numold)
{
    $mdDialog.hide();
}
else {
  vm.promise = ChatsService.PostContactNum(postNumber);
  vm.promise.then(function (response) {
    if (response.statuscode == 0) {
        debugger;
        Clique.showToast(response.statusmessage, 'bottom right', 'success');
        vm.customer_numold = vm.contactnumber;
        vm.chatscustomerlist[i].PrimaryPhone.FreeFormNumber = vm.contactnumber ;
        vm.primaryphonenumber = vm.chatscustomerlist[i].PrimaryPhone.FreeFormNumber;
        vm.chatscustomerlist[i].SyncToken = ++SyncToken;
        sessionStorage.setItem('SyncToken',  vm.chatscustomerlist[i].SyncToken);
        vm.shownum = false;

        $mdDialog.hide();
    } else {
        Clique.showToast(response.statusmessage, 'bottom right', 'error');
    }
    $mdDialog.hide();
});
}

}






        getCustomer();
        function getCustomer() {
        //    debugger;
        
            vm.promise = ChatsService.GetCustomers()
                  vm.promise.then(function (response) {
                 //  console.log("getallmerchantchatresponse",response );
                    // vm.chatData = response.data.data;
                 
                    if (response.statuscode === 0) {
                        // debugger;
                      var chatDup = []
                      vm.chatscustomerlist = response.data.items;
                      console.log("vm.chatscustomerlist" , vm.chatscustomerlist);
                     $scope.showprogress = true;
                    //   for(var j = 0; j < vm.chats.length; j++){
                   
                    //   }
                      for (var i = 0; i < vm.chatscustomerlist.length; i++) {
                       
                        $scope.colorgenerate = Math.floor(0x1000000 * Math.random()).toString(16);
                        vm.chatscustomerlist[i].color = '#' + ('000000' + $scope.colorgenerate).slice(-6);
                        vm.color = vm.chatscustomerlist[i].color ;
                      
                      }
                    
                    } 
                  });
                }
            
                $scope.showprogress = false;


                function getchatinvoicelisting(value,value1){
              debugger;
                sessionStorage.setItem('count', value1);
                // sessionStorage.setItem('Synccode', value1);
                    console.log("item", value1);
                    vm.customer_name = value.DisplayName;
                    vm.customercolor = value.color;
                    vm.customer_id = value.Id;
                    vm.SyncToken = value.SyncToken;
                    vm.textmessage = 0;
                    vm.chat = 0;
                    vm.showinvoicegrid = false;
                //    vm.primaryphonenumber = value.PrimaryPhone;

                   if(value.PrimaryPhone != null){
                   vm.customer_num = value.PrimaryPhone.FreeFormNumber;  
                   vm.primaryphonenumber = value.PrimaryPhone.FreeFormNumber;
                   vm.customer_numold = value.PrimaryPhone.FreeFormNumber;
                   vm.shownum = false;
                   }
                   else{
                       vm.customer_num = ' ';
                       vm.shownum = true;
                       }
              
                   var date = new Date(),
                           y = date.getFullYear(),
                           m = date.getMonth();
                       $scope.from = new Date(y, m - 3, 1);
                       $scope.to = new Date(y, m + 1, 0)
                       $scope.from = $filter('date')($scope.from, "yyyy-MM-dd");
                       $scope.to = $filter('date')($scope.to, "yyyy-MM-dd");
                       vm.status_all = 'notpaid',
                       
                       vm.query = {
                       
                        order: '-TxnDate',
                      
                      };
                  
                    sessionStorage.setItem('customer_id', vm.customer_id);
                    sessionStorage.setItem('from', $scope.from);
                    sessionStorage.setItem('to', $scope.to);
                    sessionStorage.setItem('status_all',  vm.status_all); 
                    sessionStorage.setItem('SyncToken',  vm.SyncToken);
                           vm.promise = ChatsService.GetCustomerInvoiceList(vm.customer_id,$scope.from,$scope.to,vm.status_all)
                           vm.promise.then(function (response) {
                             if (response.statuscode === 0) {
                          
                            
                               vm.getallcustomerinvoice = response.data.items;
                               
                               console.log("getallcustomerinvoice" , vm.getallcustomerinvoice )
                               vm.showinvoicelist = true;
                               vm.showinvoicegrid = true;
                             }
                           });
           
                }


                $scope.callUpdateContact = function () {
                    debugger;
if(vm.customer_num == undefined || vm.customer_num == ' '){
    vm.customer_num = ' ';
}
else {
                    vm.customer_num = vm.primaryphonenumber;
}
                        $mdDialog.show({
                                
                                templateUrl: 'app/main/chat/upadate_contact.tmpl.html',
                                parent: angular.element(document.body),
                                targetEvent: null,
                                clickOutsideToClose: true,
                                fullscreen: true,
                                scope: $scope,
                                preserveScope: true
                            })
                            .then(function (answer) {}, function () {});
                    }

                function showinvoicelisting(){
                  var customer_id =  sessionStorage.getItem('customer_id', vm.customer_id);
                 var date_from =   sessionStorage.getItem('from', $scope.from);
                 var date_to =    sessionStorage.getItem('to', $scope.to);
                 var status =   sessionStorage.getItem('status_all',  vm.status_all);

                 vm.promise = ChatsService.GetCustomerInvoiceList(customer_id,date_from,date_to,status)
                 vm.promise.then(function (response) {
                   if (response.statuscode === 0) {
                  
                     vm.getallcustomerinvoice = response.data.items;
                     console.log("getallcustomerinvoice" , vm.getallcustomerinvoice )
                     vm.showinvoicelist = true;
                     vm.showinvoicegrid = true;
                   }
                 });

                }



        function getChat(value)
        {
       
        //  console.log("item", value);
         vm.customer_name = value.CustomerRef.name;
         vm.customercolor = value.color;
         vm.invoice_id = value.Id;
      
         vm.textmessage = 0;
         vm.chat = vm.chat + 1;
        // debugger;
      
                         vm.promise = ChatsService.GetInvoiceLink(value.Id)
                         vm.promise.then(function (response) {
                      
                           if (response.statuscode === 0) {
                        
                             vm.getcustomerlastinvoice = response.data;
                             console.log("getcustomerlastinvoice" , vm.getcustomerlastinvoice )
                         
                           }
                         });
                         vm.promise = ChatsService.GetChatData(value.Id)
                         vm.promise.then(function (response) {
                        
                           if (response.statuscode === 0) {
                      
                             vm.getallcustomerchat = response.data.items;
                             console.log("getallcustomerchat" , vm.getallcustomerchat )
                         
                           }
                         });
                // Reset the reply textarea
                resetReplyTextarea();

                // Scroll to the last message
                scrollToBottomOfChat();

                if ( !$mdMedia('gt-md') )
                {
                    $mdSidenav('right-sidenav').close();
                }

                // Reset Left Sidenav View
                vm.toggleLeftSidenavView(false);
                
            // });
        }
vm.count = 0;
        /**
         * Reply
         */

function showmessage(ev){
    debugger;
    console.log("vm.customer_num",vm.contactnumber );
// vm.textmessage = vm.textmessage;

            // if( vm.primaryphonephonenumber ==null  ){
               
                
if(vm.customer_num == undefined || vm.customer_num == " " )
{
                   $mdDialog.show({
                    
                    templateUrl: 'app/main/chat/alert_contact.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    scope: $scope,
                    preserveScope: true
                })
                .then(function (answer) {}, function () {});
        }
    
    
           }



function closedialog(){
  
$mdDialog.hide();
}

        function reply($event)
        {
           
            // If "shift + enter" pressed, grow the reply textarea
           


debugger;
            vm.count = vm.count + 1;
            var date = new Date();
            vm.datetime = $filter("date")(Date.now(), 'HH:mm');
           
            vm.datetimemessage = $filter("date")(Date.now(), 'yyyy-MM-dd HH:mm:ss');

            if ( $event && $event.keyCode === 13 && $event.shiftKey )
            {
              
                vm.textareaGrow = true;
                return;
            }
            if ($event.type == 'submit') {
             
                if (vm.replyMessage == undefined ) {
                  resetReplyTextarea();
                  return;
                } 
                else if(vm.replyMessage == "")
                {
                    resetReplyTextarea();
                    return;
                }
                else
                {
                 
                  var message = {
                    message: vm.replyMessage
                    
                  };
                  postChat(message);
             
                  resetReplyTextarea();
                }
                // timestamp: new Date().toISOString(),
              }
            // Prevent the reply() for key presses rather than the"enter" key.
            if ( $event && $event.keyCode !== 13 )
            {
            
                return;
            }

            // Check for empty messages
            if ( vm.replyMessage === '' )
            {
               
                resetReplyTextarea();
                return;
            }

            // Message
            var message = {
                // who    : 'user',
                message: vm.replyMessage
                // time   : new Date().toISOString()
            };
//mera kaam
  

            postChat(message);
            // Add the message to the chat
            

            // vm.chat.push(message);

            // Update Contact's lastMessage
            // vm.contacts.getById(vm.chatContactId).lastMessage = message;

            // Reset the reply textarea
            resetReplyTextarea();

            // Scroll to the new message
            scrollToBottomOfChat();

        }


        function postChat(message) {
            debugger;
           
               
                    var postMessage = {
                        message: message.message,
                        customer_phone: vm.customer_num,
                        customer_name : vm.customer_name,
                        customer_id : vm.customer_id,
                        payment_url : vm.getcustomerlastinvoice,
                        invoice_id : vm.invoice_id,
                        created_date : vm.datetimemessage
                      }  
               

                  $scope.promise = ChatsService.PostChatData(postMessage);
// debugger;
                  console.log("postMessage", postMessage);
                  getCustomerChatdata(postMessage)

                //  getCustomerChatdata();
             


                //   $timeout(function () {
                //     showMessage(postMessage);
                //     vm.promise = ThreadModel.GetTotalUnread();
                //     vm.promise.then(function (response) {
            
                //       if (response.statuscode === 0) {
                //     //    console.log('count is ', response.data)
                //         // sessionStorage.clear();
                //         // sessionStorage.setItem("count", response.data);
                //       }
                //     });
                //   }, 200);
             
                }

                function getCustomerChatdata(value) {
                      
                   
                    console.log(" vm.invoice_id",vm.invoice_id)
                  
                    setTimeout(function() {
                    vm.promise = ChatsService.GetChatData(value.invoice_id)
           
                          vm.promise.then(function (response) {
                         //  console.log("getallmerchantchatresponse",response );
                            // vm.chatData = response.data.data;
                            if (response.statuscode === 0) {
                            
                              vm.getallcustomerchat = response.data.items;
                            //   for(var j = 0; j < vm.chats.length; j++){
                             console.log("vm.getallcustomerchatonreply", vm.getallcustomerchat)
                            //   }
                            }
                          });   }, 2000)
                        }



        /**
         * Clear Chat Messages
         */
        function clearMessages()
        {
            vm.chats[vm.chatContactId] = vm.chat = [];
            vm.contacts.getById(vm.chatContactId).lastMessage = null;
        }

        /**
         * Reset reply textarea
         */
        function resetReplyTextarea()
        {
            vm.replyMessage = '';
            vm.textareaGrow = false;
        }

        /**
         * Scroll Chat Content to the bottom
         * @param speed
         */
        function scrollToBottomOfChat()
        {
            $timeout(function ()
            {
                var chatContent = angular.element($document.find('#chat-content'));

                chatContent.animate({
                    scrollTop: chatContent[0].scrollHeight
                }, 100);
            }, 2000);

        }

        /**
         * Set User Status
         */
        function setUserStatus(status)
        {
            vm.user.status = status;
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
      
         vm.showinvoicegrid = false;
       
        setTimeout(function(){ 
          $mdSidenav(sidenavId).toggle();}
          , 100);
        }
   

        /**
         * Toggle Left Sidenav View
         *
         * @param view id
         */
        function toggleLeftSidenavView(id)
        {

            vm.leftSidenavView = id;
        }


        function closeside(){
       
vm.chat = 0;
toggleSidenav();
        }


        /**
         * Array prototype
         *
         * Get by id
         *
         * @param value
         * @returns {T}
         */
        Array.prototype.getById = function (value)
        {
            return this.filter(function (x)
            {
                return x.id === value;
            })[0];
        };
    }
})();