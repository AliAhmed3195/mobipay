(function ()
{
    'use strict';

    angular
        .module('fuse')
        .run(runBlock)
        .service('helper', function () {
            // private variable
      
    
            var checkHardwareModel = function (paymentObject, hardwareName) {
      
           
              if (paymentObject.hasOwnProperty('configuration')) {
                if (paymentObject.configuration.hasOwnProperty('hardware')) {
                  if (paymentObject.configuration.hardware.hasOwnProperty(hardwareName)) {
                    return true;
                  }
                }
              }
              return false;
            }
            var getAutoIncrementInvoiceNo = function (docNumber) {
              var numberPattern = /\d+/g;
      
              var getNonNumberSegment = []
              var getNumbericSegment = [];
              if (docNumber.split(numberPattern) != null) {
                getNonNumberSegment = docNumber.split(numberPattern);
              }
              if (docNumber.match(numberPattern) != null) {
                getNumbericSegment = docNumber.match(numberPattern);
              }
              if (getNumbericSegment != null) {
                var last_digit = parseInt(getNumbericSegment[getNumbericSegment.length - 1]);
                last_digit = ++last_digit;
                getNumbericSegment[getNumbericSegment.length - 1] = last_digit.toString();
              }
      
              var newDocNumber = "";
      
      
              if (getNonNumberSegment.length > getNumbericSegment.length) {
                for (i = 0; i < getNonNumberSegment.length; i++) {
                  newDocNumber += getNonNumberSegment[i];
                  if (i < getNumbericSegment.length)
                    newDocNumber += getNumbericSegment[i];
                }
              } else {
      
                for (i = 0; i < getNumbericSegment.length; i++) {
                  newDocNumber += getNumbericSegment[i];
                  if (i < getNonNumberSegment.length)
                    newDocNumber += getNonNumberSegment[i];
                }
              }
              if (newDocNumber == "") {
                return "1";
              }
              return newDocNumber;
      
            }
      
            return {
              getAutoIncrementInvoiceNo: getAutoIncrementInvoiceNo,
              checkHardwareModel: checkHardwareModel
      
            };
          })
    /** @ngInject */
    function runBlock($rootScope, $timeout, $state)
    {
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function ()
        {
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            }, 1800);
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();