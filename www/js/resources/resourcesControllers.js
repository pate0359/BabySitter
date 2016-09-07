angular.module('SitterAdvantage.resourcesControllers', [])
.controller('ResourcesCtrl', ["$scope", "Tasks", "$state", "$cordovaInAppBrowser","$ionicPopup",'ResourcesService',
	function ($scope, Tasks, $state,$cordovaInAppBrowser,$ionicPopup,ResourcesService ) {
		$scope.resources= [
			{
				"title": "Games",
				"url": "http://www.whattodowiththekids.com/games/"
			},
			{
				"title": "Crafts",
				"url": "http://www.whattodowiththekids.com/crafts/"

			},
			{
				
                "title": "Activities",
				"url": "http://www.whattodowiththekids.com/activities/"
			}
		]
        
        var options = {
          location: 'yes',
          enableViewportScale: 'yes'
        };
        
		$scope.openWebsite = function(index){
			    $cordovaInAppBrowser.open($scope.resources[index].url, '_blank', options)
			      .then(function(event) {
			        // success
			        console.log('success to load openWebsite');
			      })
			      .catch(function(event) {
			        // error
			        console.log('failed to load openWebsite');
			        console.log(event);
			      });
		}
		
		$scope.goToInstruction = function(index){
			
			$state.go("tab.instructions_resources");
		}
		
		 $scope.$on('$ionicView.loaded', function(){
			 
			 ResourcesService.getDefaults().then(function (defaults) {
				
				 if (defaults){
					
					console.log("defaults :"+defaults.message);
				 	$scope.defaultMessage = defaults.message;
				 }else{
					 $scope.defaultMessage = "";
				 }
					
            	});
		  });
		
		$scope.defaultTextMessageClicked = function(index){
			
			$scope.data = {};
			$scope.data.defaultMessage = $scope.defaultMessage;
			
			// pop up Alert box
				var popUp = $ionicPopup.show({
					template: '<input type="text" ng-model="data.defaultMessage" />',
					title: 'Default Message',
					scope: $scope,
					buttons: [
						{
							text: 'Close',
							type: 'button-light',

            },
						{
							text: '<b>Save</b>',
							type: 'button-positive',
							onTap: function (e) {
								if (!$scope.data.defaultMessage) {
									e.preventDefault();
								} else {
									
									return $scope.data.defaultMessage;
								}
							}

            }, ]

				});

				popUp.then(function (res) {
					if (!res) return;
					
					$scope.defaultMessage = $scope.data.defaultMessage
					 ResourcesService.setDefaults($scope.defaultMessage).then(function (res) {
				
					console.log("defaults :"+res);
            	});
					
				});
		}

  	}])

.controller('InstructionsCtrl', ["$scope", "Tasks", "$state", "$cordovaInAppBrowser", "$stateParams", "$ionicNavBarDelegate", "$ionicHistory",
	function ($scope, Tasks, $state,$cordovaInAppBrowser, $stateParams, $ionicNavBarDelegate, $ionicHistory ) {
               
        $ionicNavBarDelegate.showBackButton(true);
        
        $scope.goBack = function(){
            $ionicHistory.goBack();
        }
	
}]);

