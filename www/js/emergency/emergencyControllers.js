angular.module('SitterAdvantage.emergencyControllers', ['ngCordova'])

.controller('EmergencyCtrl', ["$scope", "$ionicModal", "$cordovaSms", "GPSMap", "Clients", "Tasks", "ResourcesService", "$ionicLoading", function ($scope, $ionicModal, $cordovaSms, GPSMap, Clients, Tasks, ResourcesService, $ionicLoading) {

	$scope.latitude = "";
	$scope.longitude = "";

	console.log("entering emergency");

	$scope.$on("$ionicView.loaded", function (event, data) {

		if (navigator.geolocation) {

			navigator.geolocation.getCurrentPosition(function (pos) {

				$scope.latitude = parseFloat(pos.coords.latitude.toFixed(6));
				$scope.longitude = parseFloat(pos.coords.longitude.toFixed(6));

				//Get addess from lat long
				$scope.getAddress(pos.coords.latitude, pos.coords.longitude);

				$scope.$apply();
			});
		}
	});

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

	$scope.currentTasks = [];
	$scope.parents = [];

	// get client in database
	Tasks.getAllTask().then(function (taskList) {
		if (!taskList) return;
		$scope.getCurrentTask(taskList);
	});

	$scope.getCurrentTask = function (taskList) {

		angular.forEach(taskList, function (task) {

			var startDateTime = new Date(task.taskStartDateTime)
			var endDateTime = new Date(task.taskEndDateTime)
			var now = new Date();

			if (now >= startDateTime && now < endDateTime) { // Task is running

				$scope.currentTasks.push(task);
			}
		});

		$scope.getParentsForCurrentTasks();
	};

	$scope.getParentsForCurrentTasks = function () {

		angular.forEach($scope.currentTasks, function (task) {

			if (!task.clientId) {
				return;
			}

			Clients.getKidById(task.kidId).then(function (kid) {
				if (!kid) return;
				$scope.kid = kid;
			});

			Clients.getParentsForClient(task.clientId).then(function (parentList) {

				if (!parentList) return;
				$scope.parents = parentList;
			});
		});
	};


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

	// Handle geolocation errors 
	//		$scope.handleLocationError = function (browserHasGeolocation, infoWindow, mapCoords) {
	//			infoWindow.setPosition($scope.mapCoords);
	//			infoWindow.setContent(browserHasGeolocation ?
	//				'Error: The Geolocation service failed.' :
	//				'Error: Your browser doesn\'t support geolocation.');
	//		}

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

		var gpsURL = "";

		// If there is a location for the babysitter, send it to the parents  
		if ($scope.mapCoords.lat != 0 && $scope.mapCoords.lng != 0) {
			gpsURL = "http://maps.google.com/maps?f=q&amp;geocode=&amp;q=" + $scope.latitude + "," + $scope.longitude + "&z=14";

			$scope.sosMessage += "Map: " + gpsURL;
		} else {
			gpsURL = "";
		}
		sms.send(number, $scope.sosMessage, options, success, error);
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

			if (!mapEle) return;

			$scope.loading = $ionicLoading.show({
				content: 'Getting current location...',
				showBackdrop: false
			});

			var map = new google.maps.Map(document.getElementById("map"), mapOptions);
			$scope.map = map;

			navigator.geolocation.getCurrentPosition(function (pos) {

				$scope.mapCoords = {
					lat: parseFloat(pos.coords.latitude.toFixed(6)),
					lng: parseFloat(pos.coords.longitude.toFixed(6))
				};

				$scope.latitude = parseFloat(pos.coords.latitude.toFixed(6));
				$scope.longitude = parseFloat(pos.coords.longitude.toFixed(6));

				$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
				var myLocation = new google.maps.Marker({
					position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
					map: map,
					title: "My Location"
				});

				//Get addess from lat long
				$scope.getAddress(pos.coords.latitude, pos.coords.longitude);				

				$ionicLoading.hide();

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