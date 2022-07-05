
 angular.module('starter').service('customSliderService', ['$rootScope', customSlider]);

 
  function customSlider($rootScope) {
      $rootScope.customSliderData = [
          {
              value : 0,
              text : 'Project lost'
          },
          {
              value : 10,
              text : 'Initial lead'
          },
          {
              value : 50,
              text : 'Proposal submitted'
          },
          {
              value : 70,
              text : 'Positive outlook'
          },
          {
              value : 90,
              text : 'Verbally confirmed'
          },
          {
              value : 100,
              text : 'Project sold'
          }
      ];
      $rootScope.currentDot = [];
  $rootScope.selectedDot = function(dotIndex, sliderIndex) {
    $rootScope.currentDot[sliderIndex] = dotIndex;
  }

  $rootScope.getIndexFromValue = function(value) {
      if (value == undefined) return -1;
      if (value == 0) return 1;
      else if (value == 10) return 2;
      else if (value == 50) return 3;
      else if (value == 70) return 4;
      else if (value == 90) return 5;
      else if (value == 100) return 6;
  }

  $rootScope.getValueFromIndex = function(index) {
      if (index == 1) return 0;
      else if (index == 2) return 10;
      else if (index == 3) return 50;
      else if (index == 4) return 70;
      else if (index == 5) return 90;
      else if (index == 6) return 100;
  }

  };

