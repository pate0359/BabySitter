var db;
angular.module('SitterAdvantage.taskServices', [])

.factory('Tasks', function(dbService,$q) {
  var tasks = [];
  var taskId;
  var myTasks = {};
	 return {

        //// ********************* Client  ********************* ////

        //Get all task
        getAllTask: function () {

			var d = $q.defer();
			var query = "SELECT * FROM tasks t INNER JOIN clients c WHERE t.clientId = c.clientId";
			var querySuccessCallback = function (tx, res) {
				console.log("select statement for tasks succeeded");
				console.log("task count " + res.rows.length);

				var tasks = [];
				for (var t = 0; t < res.rows.length; t++) {
					tasks.push(res.rows.item(t));
				}

				console.log(tasks);
				d.resolve(tasks);
			};
			var queryErrorCallback = function (err) {
				console.error(err);
				d.resolve(err);
			};
			dbService.executeStatement(query, [], querySuccessCallback, queryErrorCallback);
			return d.promise;
		},
		 
		 getTaskById: function (taskId) {

            var d = $q.defer();

            var query = "SELECT * FROM tasks WHERE taskId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log(res.rows.item(0));
                
                var task = res.rows.item(0);
                d.resolve(task);
            };

            dbService.executeStatement(query, [taskId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },
		 
		 //create New task
        createNewTask: function (params) {

			var d = $q.defer();
			 var query = "INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)";

			var querySuccessCallback = function(tx, res) {
				// // get task id for new client after adding it.
				console.log("insert statement for adding a newTask succeeded");  
				console.log(res);
				d.resolve(res.insertId);
			};

			var queryErrorCallback = function (err) {
			   console.log("insert statement for tasks failed");
				d.resolve(err);
			};

   			 dbService.executeStatement(query, [params.taskTitle, params.taskDescription, params.startDate, params.endDate, params.startTime, params.endTime, params.taskNotes, params.clientId,params.kidId], querySuccessCallback, queryErrorCallback );
			
			return d.promise;
		},
		 //update task
        updateTask: function (params) {

			var d = $q.defer();
			 var query = "UPDATE tasks SET taskTitle = ?, taskDescription = ?, taskStartdate = ?, taskEnddate = ?, taskStarttime = ?, taskEndtime = ?, taskNotes = ?, clientId = ? WHERE taskId = ? ";
	  
			var querySuccessCallback = function(tx, res) {
				// // get task id for new client after adding it.
				console.log("update statement for task " +taskId);              
				console.log(res);
				d.resolve(res);
			};
			var queryErrorCallback = function (err) {
			   console.log("insert statement for tasks failed");
				d.resolve(err);
			};

   			 dbService.executeStatement(query, [params.taskTitle, params.taskDescription, params.startDate, params.endDate, params.startTime, params.endTime, params.taskNotes, params.clientId,params.taskId], querySuccessCallback, queryErrorCallback );
			
			return d.promise;
		},
		 //update task
        deleteTask: function (taskId) {

			var d = $q.defer();
			var query = "DELETE FROM tasks where taskId = ?";
			var querySuccessCallback = function(tx, res) {
				console.log("delete task succeeded");
				console.log(res);  
				d.resolve(res);
			};
			var queryErrorCallback = function (err) {
			   console.log("insert statement for tasks failed");
				d.resolve(err);
			};
   			dbService.executeStatement(query,[taskId], querySuccessCallback, queryErrorCallback );
			return d.promise;
		}
	 }
}); 
