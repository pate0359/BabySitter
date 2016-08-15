angular.module('SitterAdvantage.resourcesControllers', [])
.controller('ResourcesCtrl', ["$scope", "Tasks", "$state", "$cordovaInAppBrowser",
	function ($scope, Tasks, $state,$cordovaInAppBrowser ) {
		
		$scope.resources= [
			{
				"title": "Games",
				"url": "http://www.whattodowiththekids.com/games/"
			},
			{
				"title": "Activities",
				"url": "http://www.whattodowiththekids.com/activities/"

			},
			{
				"title": "Crafts",
				"url": "http://www.whattodowiththekids.com/crafts/"
			}
		]
		$scope.openWebsite = function(index){
			    $cordovaInAppBrowser.open($scope.resources[index].url, '_blank')
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

  	}]);

