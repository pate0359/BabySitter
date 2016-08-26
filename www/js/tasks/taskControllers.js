angular.module('SitterAdvantage.taskControllers', [])

.controller('TaskCtrl', ["$scope", "Tasks", "$state",
      function ($scope, Tasks, $state) {

		console.log("TaskCtrl is loaded");
		$scope.tasks = [];		 
		  // get all task from database
          Tasks.getAllTask().then(function (taskList) {
                if (!taskList) return;
                console.log(taskList);
                $scope.tasks = taskList;
           });
		  
		$scope.addTask = function () {
			$state.go("tab.new-task");
		}

		$scope.taskClicked = function ($index) {
			var item = $scope.tasks[$index];
			$state.go('tab.task-detail' + item.taskId);
		}
      }])

.controller('NewTaskCtrl', ["$scope", "Tasks", "Clients", "$state", "$stateParams", "$ionicNavBarDelegate","$ionicHistory",
  function ($scope, Tasks, Clients, $state, $stateParams, $ionicNavBarDelegate,$ionicHistory) {

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
			params.taskStartDateTime = $scope.newTaskParams.startdatetimeValue;
			params.taskEndDateTime = $scope.newTaskParams.enddatetimeValue;			
			params.taskNotes = $scope.newTaskParams.taskNotes;
			params.clientId = $scope.selectedClientId;
			params.kidId = 0;

			console.log("params "+params);
			//Call service function to add new task			
			Tasks.createNewTask(params).then(function (task) {
				  if (!task) return;
				  $ionicHistory.goBack();
			});
		};

		$scope.getSelectedValue= function (client) {
			//alert("scope - "+ client.clientDesc);
			$scope.selectedClientId = client.clientId;
	    };
  }])

.controller('TasksDetailCtrl', ["$scope", "Tasks", "$stateParams", "$state", "$rootScope", "$ionicNavBarDelegate", "Clients","$ionicHistory","$ionicActionSheet", function ($scope, Tasks, $stateParams, $state, $rootScope, $ionicNavBarDelegate, Clients,$ionicHistory,$ionicActionSheet) {

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
							hideSheet();
						  	$ionicHistory.goBack();
					});
                }
            });		
	}
}]);