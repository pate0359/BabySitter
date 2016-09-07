angular.module('SitterAdvantage.emergencyServices', [])
// create this as a service 
// call the service in the app.js file 

.factory('GPSMap', function($ionicLoading, $compile, $http) {
  // Might use a resource here that returns a JSON array
 	return{
		get: function(position){
			var mapUrl = "http://maps.google.com/maps/api/staticmap?center=";
			mapUrl = mapUrl + position 
			+ '&zoom=14&size=400x400&maptype=terrain&sensor=true&markers=size:mid%7Ccolor:red%7C' 
			+ position;
			console.log(mapUrl); 
			return $http.get(mapUrl); 
		}
	}
		
});