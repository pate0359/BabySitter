angular.module('SitterAdvantage.resourcesControllers', [])
.controller('ResourcesCtrl', ["$scope", "Tasks", "$state", "$cordovaInAppBrowser",
	function ($scope, Tasks, $state,$cordovaInAppBrowser ) {
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

  	}])

.controller('InstructionsCtrl', ["$scope", "Tasks", "$state", "$cordovaInAppBrowser", "$stateParams", "$ionicNavBarDelegate", "$ionicHistory",
	function ($scope, Tasks, $state,$cordovaInAppBrowser, $stateParams, $ionicNavBarDelegate, $ionicHistory ) {
               
        $ionicNavBarDelegate.showBackButton(true);
        
        $scope.goBack = function(){
            $ionicHistory.goBack();
        }
	
}]);

