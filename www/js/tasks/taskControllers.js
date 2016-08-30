angular.module('SitterAdvantage.taskControllers', [])

.controller('TaskCtrl', ["$scope", "Tasks", "$state","$filter",
      function ($scope, Tasks, $state,$filter) {

		console.log("TaskCtrl is loaded");
		$scope.tasks = [];		 
		  
		  $scope.$on('$ionicView.afterEnter', function(){
			  // Any thing you can think of			  
			  // get all task from database
			  Tasks.getAllTask().then(function (taskList) {
				  //alert("sucess");
					if (!taskList) return;
					console.log(taskList);
				  //alert("task list loaded");
				  $scope.changeDateFormat(taskList);

			   });
			});
		  
		  $scope.changeDateFormat = function(taskList){
			  
			  angular.forEach(taskList, function (task) {
				  
				  var newTask = {};
				  
				    newTask.taskId = task.taskId;
					newTask.taskTitle = task.taskTitle;
					newTask.taskDescription = task.taskDescription;
					newTask.taskStartDateTime = task.taskStartDateTime;
					newTask.taskEndDateTime = task.taskEndDateTime;
					newTask.taskNotes = task.taskNotes;
					newTask.clientId = task.clientId;
					newTask.kidId = task.kidId;
				    newTask.clientDesc = task.clientDesc;
				  
				  newTask.startDate = $filter('date')(new Date(task.taskStartDateTime), 'MMM, dd yyyy');
				  newTask.startTime = $filter('date')(new Date(task.taskStartDateTime), 'hh:mm:a');
				  
				  $scope.tasks.push(newTask);
				  
				});
		  }
		  
		$scope.addTask = function () {
			$state.go("tab.new-task");
		}
		
		$scope.goToInstructions = function () {
			$state.go("tab.instructions_tasks");
		}
		
		$scope.taskClicked = function ($index) {
			var item = $scope.tasks[$index];
			$state.go('tab.task-detail' + item.taskId);
		}
		
		
      }])

.controller('NewTaskCtrl', ["$scope", "Tasks", "Clients", "$state", "$stateParams", "$ionicNavBarDelegate","$ionicHistory","$filter","Notification",
  function ($scope, Tasks, Clients, $state, $stateParams, $ionicNavBarDelegate,$ionicHistory,$filter,Notification) {

  		$ionicNavBarDelegate.showBackButton(false);
	  

	  if ($stateParams.pageFrom == 1){

	  	$scope.isHideClientDescr = false;

	  }else{

		  $scope.isHideClientDescr = true;
	  }

	  // client in database
	  Clients.getClientsList().then(function (clientList) {
		  if (!clientList) return;
		  $scope.clientArray = clientList;

	  });


		console.log("im inside new task controller");
		$scope.cancelNewTask = function () {
			//$state.go("tab.tasks");
			
			$ionicHistory.goBack();

		};

		$scope.newTaskParams = {};

		$scope.saveNewTask = function () {
			// To add Task from Clien detail page
			
			if ($stateParams.pageFrom == 2){
				$scope.selectedClientId = $stateParams.clientId;
			  }
			 
			var params = {};
			
			params.taskTitle = $scope.newTaskParams.taskTitle;
			params.taskDescription = $scope.newTaskParams.taskDesc;
			params.taskStartDateTime = $filter('date')($scope.newTaskParams.startdatetimeValue, 'medium');	
			params.taskEndDateTime = $filter('date')($scope.newTaskParams.enddatetimeValue, 'medium');			
			params.taskNotes = $scope.newTaskParams.taskNotes;
			params.clientId = $scope.selectedClientId;
			params.kidId = 0;

			console.log("params "+params);
			//Call service function to add new task			
			Tasks.createNewTask(params).then(function (taskId) {
				  if (!taskId) return;
				
				Tasks.getTaskById(taskId).then(function (task) {
					if (!task) return;
					//Schedule task
					Notification.scheduleNotification(task);
					$ionicHistory.goBack();
				});
			});
		};

		$scope.getSelectedValue= function (client) {
			//alert("scope - "+ client.clientDesc);
			$scope.selectedClientId = client.clientId;
	    };
  }])

.controller('TasksDetailCtrl', ["$scope", "Tasks", "$stateParams", "$state", "$rootScope", "$ionicNavBarDelegate", "Clients","$ionicHistory","$ionicActionSheet","Notification", function ($scope, Tasks, $stateParams, $state, $rootScope, $ionicNavBarDelegate, Clients,$ionicHistory,$ionicActionSheet,Notification) {

	if ($stateParams.pageFrom == 1){

		$scope.disableEnableForm = false;
		$scope.toggleVisibility = false;
		$scope.disableEnableForm = false;

		$scope.pageTitle = "Task Detail";

		$ionicNavBarDelegate.showBackButton(true);

	}else{

		$ionicNavBarDelegate.showBackButton(false);

		$scope.disableEnableForm = true;
		$scope.disableEnableForm = true;
		$scope.toggleVisibility = true;

		$scope.pageTitle = "Edit Task";
	}

	//Get task by id
	Tasks.getTaskById($stateParams.taskId).then(function (task) {
				  if (!task) return;
				  $scope.task = task;
		
				// client in database
				  Clients.getClientById($scope.task.clientId).then(function (client) {
					  if (!client) return;
					  $scope.task.clientDesc = client.clientDesc;
				  });
			});
	
	$scope.editTaskDetails = function (e) {
		//$scope.disableEnableForm = function(e){ return true;} 
		$ionicNavBarDelegate.showBackButton(false);
		$scope.disableEnableForm = true;
		$scope.toggleVisibility = true;
		$scope.pageTitle = "Edit Task";
	}

	$scope.saveTaskDetails = function () {
		
		// update task with new params
		var param = {};
		param.taskId = $scope.task.taskId;
		param.taskTitle = $scope.task.taskTitle;
		param.taskDescription = $scope.task.taskDescription;
		param.taskStartDateTime = $scope.task.taskStartDateTime;
		param.taskEndDateTime = $scope.task.taskEndDateTime;		
		param.taskNotes = $scope.task.taskNotes;
		param.clientId = $scope.task.clientId;
		
		console.log("EditTask param : "+param);
		Tasks.updateTask(param).then(function (task) {
				  if (!task) return;
				  	//$scope.disableEnableForm = function(e){ return false;} 
			
					//Update notification
					Notification.updateNotification(param);
			
					$scope.disableEnableForm = false;
					$scope.toggleVisibility = false;
					$ionicNavBarDelegate.showBackButton(true);
			});
	}

	$scope.cancelTaskDetails = function () {

		if ($stateParams.pageFrom == 1) {

			$scope.toggleVisibility = false;
			$scope.disableEnableForm = false;
			$scope.pageTitle = "Task Detail";

		} else {

			// Go back to client detail page
			$ionicHistory.goBack();
		}

		$ionicNavBarDelegate.showBackButton(true);
	}

	$scope.deleteTaskDetails = function () {
        
        var hideSheet = $ionicActionSheet.show({
         
                destructiveText: 'Delete Task',
                cancelText: 'Cancel',

                cancel: function () {
                    hideSheet();
                },
            
                destructiveButtonClicked: function () {
                    //Delete task
		              Tasks.deleteTask($scope.task.taskId).then(function (res) {
						  if (!res) return;
						  
						  //Cancel notification
							Notification.cancelNotification($scope.task);
						  
							hideSheet();
						  	$ionicHistory.goBack();
					});
                }
            });		
	}
}]);