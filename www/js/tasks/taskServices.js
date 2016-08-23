var db;
angular.module('SitterAdvantage.taskServices', [])

.factory('Tasks', function(dbService) {
  var tasks = [];
  var taskId;
  var myTasks = {};

  var loadFromDB = function(){

    tasks = [];
    
    var query = "SELECT * FROM tasks t INNER JOIN clients c WHERE t.clientId = c.clientId";
    var querySuccessCallback = function(tx, res) {
       console.log("select statement for tasks succeeded");
       console.log( "task count " + res.rows.length );

       console.log(res.rows);

       for (var t = 0; t < res.rows.length; t++){
        tasks.push(res.rows.item(t));
       }

       console.log(tasks);
       // call create new task([]);
       
    };
    var queryErrorCallback = function (err) {
       console.log("select statement for tasks failed");
       console.error(err);
    };

    dbService.executeStatement(query, [], querySuccessCallback, queryErrorCallback ); 
  }


/*---------------------------------------------------------------
  ____________________Insert new task ____________________________
  Save data for each new task______________________________________ */
  var createNewTask = function(params){
        
        console.log("inside createNewTask");
        console.log(params);

        var query = "INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)";
        // var query = "INSERT INTO tasks (taskTitle, taskDescription, taskStartdate, taskEnddate, taskStarttime, taskEndtime, taskNotes, clientId,kidId) VALUES (?,?,?,?,?,?,?,?,?)";

        var querySuccessCallback = function(tx, res) {
          // console.log(res.insertId);   
            // // get task id for new client after adding it.
            // taskId = res.insertId; 
            console.log("insert statement for adding a newTask succeeded");  
            console.log(params);
            console.log(res);

            console.log("should add new task to list of tasks");

            tasks.push({
              "taskId":res.insertId, 
                "taskTitle":params.taskTitle, 
                "taskDescription":params.taskDescription, 
                "taskStartdate":params.startDate, 
                "taskEnddate":params.endDate, 
                "taskStarttime":params.startTime, 
                "taskEndtime":params.endTime, 
                "taskNotes":params.taskNotes, 
                "clientId" :params.clientId,
                "kidId" :params.kidId
            });
        };

    var queryErrorCallback = function (err) {
       console.log("insert statement for tasks failed");
       console.error(err);
    };

    dbService.executeStatement(query, [params.taskTitle, params.taskDescription, params.startDate, params.endDate, params.startTime, params.endTime, params.taskNotes, params.clientId,params.kidId], querySuccessCallback, queryErrorCallback );
  }
  
  /*---------------------------------------------------------------
  ____________________Update task ____________________________
  ---------------------------------------------------------------*/
  
  var updateTask = function(params){
        
        console.log("inside createNewTask");
        console.log(params);
   
    //dbService.executeStatement(query,[description, id], querySuccessCallback, queryErrorCallback );
	  
        var query = "UPDATE tasks SET taskTitle = ?, taskDescription = ?, taskStartdate = ?, taskEnddate = ?, taskStarttime = ?, taskEndtime = ?, taskNotes = ?, clientId = ? WHERE taskId = ? ";
	  
        var querySuccessCallback = function(tx, res) {
          // console.log(res.insertId);   
            // // get task id for new client after adding it.
            // taskId = res.insertId; 
            console.log("update statement for task " +taskId);  
            console.log(params);
            console.log(res);
            console.log("should add new task to list of tasks");

//            tasks.push({
//              "taskId":res.insertId, 
//                "taskTitle":params.taskTitle, 
//                "taskDescription":params.taskDescription, 
//                "taskStartdate":params.startDate, 
//                "taskEnddate":params.endDate, 
//                "taskStarttime":params.startTime, 
//                "taskEndtime":params.endTime, 
//                "taskNotes":params.taskNotes, 
//                "clientId" :params.clientId
//			});
        };

    var queryErrorCallback = function (err) {
       console.log("update statement for tasks failed");
       console.error(err);
    };

    dbService.executeStatement(query, [params.taskTitle, params.taskDescription, params.startDate, params.endDate, params.startTime, params.endTime, params.taskNotes, params.clientId,params.taskId], querySuccessCallback, queryErrorCallback );
  }
  
  /*---------------------------------------------------------------
  ____________________Delete task ____________________________
  ---------------------------------------------------------------*/
   var deleteTask = function(taskId) {
	   
    var query = "DELETE FROM tasks where taskId = ?";
    var querySuccessCallback = function(tx, res) {
        console.log("delete task succeeded");
        console.log(res);  

      //tasks = $filter('filter')(tasks, {taskId: '!taskId'})        

    };

	 var queryErrorCallback = function (err) {
       console.log("delete task failed");
       console.error(err);
    };
	   
    dbService.executeStatement(query,[taskId], querySuccessCallback, queryErrorCallback );
  };

  return {
    loadFromDB: loadFromDB,
    all: function() {

      loadFromDB();
      //tasks.splice(0, tasks.length);
      return tasks;
    },
    remove: function(task) {
      tasks.splice(tasks.indexOf(task), 1);
    },
    get: function(taskId) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === parseInt(taskId)) {
          return tasks[i];
        }
      }
      return null;
    },
    createNewTask: createNewTask,
	updateTask: updateTask,
	deleteTask: deleteTask
  };

}); 
