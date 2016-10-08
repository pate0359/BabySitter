angular.module('SitterAdvantage.emergencyControllers', ['ngCordova'])

.controller('EmergencyCtrl', ["$scope", "$ionicModal", "$cordovaSms", "GPSMap", "Clients", "Tasks", "ResourcesService", "$ionicLoading","$rootScope", function ($scope, $ionicModal, $cordovaSms, GPSMap, Clients, Tasks, ResourcesService, $ionicLoading,$rootScope) {

	$scope.latitude = "";
	$scope.longitude = "";

	//Get default text message
	ResourcesService.getDefaults().then(function (defaults) {

		if (defaults) {
			console.log("defaults :" + defaults.message);
			$scope.sosMessage = defaults.message;
		} else {
			$scope.sosMessage = "";
		}
	});

	$scope.settings = {
		enableFriends: true
	};

	$scope.$on("$ionicView.enter", function (event, data) {

		$scope.kids = [];
		$scope.parents = [];
		
		if ($rootScope.selectedClientId != undefined){
			
			$scope.getParentsAndKidsForClient();
			
		}else{
			
			$scope.kids = [];
			$scope.parents = [];
		}
	});

	$scope.getParentsAndKidsForClient = function () {
		
		Clients.getKidsForClientWithID($rootScope.selectedClientId).then(function (kids) {
				
				if (!kids) return;
				$scope.kids = kids;
			});
			
			Clients.getParentsForClient($rootScope.selectedClientId).then(function (parentList) {

				if (!parentList) return;
				$scope.parents = parentList;
				
				if ($scope.parents.length != 0){
				
					$scope.selectedParent = $scope.parents[0];
				}				
			});
	}


	var showGPS = "Show my location";
	var hideGPS = "Hide Map";

	$scope.buttonText = showGPS;
	$scope.togglebtn = "show";

	$ionicModal.fromTemplateUrl('templates/tab-emergency-map.html', {
		scope: $scope
	}).then(function (modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function () {

		$scope.modal.hide();
	};

	// Open the login modal
	$scope.showModal = function () {
		$scope.modal.show();

		$scope.showStaticMap();
	};

	// Sends an SMS message to the contact parents
	$scope.sendSMS = function (number) {

		var success = function () {
			console.log('Message sent successfully');
		};
		var error = function (e) {
			//alert('Message Failed:' + e + ". Check your phone connection."); 
			// change the phone number to the number stored in database
			document.getElementById("parent1").href = "sms:6138539911&body=" + $scope.sosMessage;
		};
		var options = {
			replaceLineBreaks: true, // true to replace \n by a new line, false by default
			android: {
				intent: 'INTENT' // send SMS with the native android SMS messaging
					//intent: '' // send SMS without open any other app
			}
		}

		$cordovaSms.send(number, $scope.sosMessage, options, success, error);
	};
	$scope.callNumber = function (number) {
		window.open('tel:' + number, '_system');
	};

	$scope.showStaticMap = function () {

		if (navigator.geolocation) {

			var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

			var mapOptions = {
				center: myLatlng,
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			var mapEle = document.getElementById("map");
			console.log("mapEle : " + mapEle);

			//if (!mapEle) return;

//			$scope.loading = $ionicLoading.show({
//				content: 'Getting current location...',
//				showBackdrop: false
//			});

			var map = new google.maps.Map(mapEle, mapOptions);
			//$scope.map = map;

			navigator.geolocation.getCurrentPosition(function (pos) {

				$scope.mapCoords = {
					lat: parseFloat(pos.coords.latitude.toFixed(6)),
					lng: parseFloat(pos.coords.longitude.toFixed(6))
				};

				$scope.latitude = parseFloat(pos.coords.latitude.toFixed(6));
				$scope.longitude = parseFloat(pos.coords.longitude.toFixed(6));

				map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
				var myLocation = new google.maps.Marker({
					position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
					map: map,
					title: "My Location"
				});

				//Get addess from lat long
				$scope.getAddress(pos.coords.latitude, pos.coords.longitude);

				//$ionicLoading.hide();
			});
		}
	};

	$scope.getAddress = function (lat, long) {

		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(lat, long);

		geocoder.geocode({
			'latLng': latlng
		}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {

					console.log(results[1].formatted_address); // details address
					$scope.address = results[1].formatted_address;
					$scope.$apply();

				} else {
					console.log('Location not found');
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}
		});
	};

			}]);