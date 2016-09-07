angular.module('SitterAdvantage.resourcesService', [])
// create this as a service 
// call the service in the app.js file 

var db;
angular.module('SitterAdvantage.resourcesService', [])

.factory('ResourcesService', function(dbService,$q) {
 
	 return {

        //// ********************* Default Message  ********************* ////

        //Get all task
        getDefaults: function () {

			var d = $q.defer();
			var query = "SELECT * FROM defaults";
			var querySuccessCallback = function (tx, res) {

				var defaults = [];
				for (var t = 0; t < res.rows.length; t++) {
					defaults.push(res.rows.item(t));
				}

				if (defaults.length >= 0){
				
					d.resolve(defaults[0]);
				}else{
					
					d.resolve();
				}			
			};
			var queryErrorCallback = function (err) {
				console.error(err);
				d.resolve(err);
			};
			dbService.executeStatement(query, [], querySuccessCallback, queryErrorCallback);
			return d.promise;
		},		 
		
		 //update 
        setDefaults: function (defaultMessage) {

			var d = $q.defer();
			 var query = "UPDATE defaults SET message = ?";
	  
			var querySuccessCallback = function(tx, res) {
				// // get task id for new client after adding it.
				console.log(res);				
				d.resolve(res);
				
			};
			var queryErrorCallback = function (err) {
			   console.log("update statement for defaults failed");
				d.resolve(err);
			};

   			 dbService.executeStatement(query, [defaultMessage], querySuccessCallback, queryErrorCallback );
			
			return d.promise;
		}
	 }
}); 