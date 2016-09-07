angular.module('SitterAdvantage.taskControllers', [])

<<<<<<< HEAD
.controller('TaskCtrl', ["$scope", "Tasks", "$state", "$filter",
      function ($scope, Tasks, $state, $filter) {

        console.log("TaskCtrl is loaded");
        $scope.tasks = [];

        $scope.$on('$ionicView.afterEnter', function () {
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

        $scope.changeDateFormat = function (taskList) {

            var array = [];

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
                newTask.isCompleted = task.isCompleted;
                newTask.isNotify = task.isNotify;
                newTask.start_dateObj = new Date(task.taskStartDateTime);
                newTask.startDate = $filter('date')(new Date(task.taskStartDateTime), 'MMM dd, yyyy');
                newTask.startTime = $filter('date')(new Date(task.taskStartDateTime), 'hh:mm:a');

                array.push(newTask);
            });

            $scope.tasks = $filter('orderBy')(array, 'start_dateObj');
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
=======
.controller('TaskCtrl', ["$scope", "Tasks", "$state","$filter","ResourcesService",
      function ($scope, Tasks, $state,$filter,ResourcesService) {

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
			  
			  var array = [];
			  
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
				  	newTask.isCompleted = task.isCompleted;
				  	newTask.isNotify = task.isNotify;
				  newTask.start_dateObj = new Date(task.taskStartDateTime);
				  newTask.startDate = $filter('date')(new Date(task.taskStartDateTime), 'MMM, dd yyyy');
				  newTask.startTime = $filter('date')(new Date(task.taskStartDateTime), 'hh:mm:a');
				  
				  array.push(newTask);
				});
			  
			  $scope.tasks = $filter('orderBy')(array, 'start_dateObj');
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
		
		ResourcesService.getDefaults().then(function (defaults) {
				
				 if (!defaults){
					 
					 db.transaction(function(tx) {
						  tx.executeSql("INSERT INTO defaults (message) VALUES (?)", ["I am in trouble! Come home now!"], function(){ }, function(){});
					 });
				 }
		})
}])
>>>>>>> origin/master

.controller('NewTaskCtrl', ["$scope", "Tasks", "Clients", "$state", "$stateParams", "$ionicNavBarDelegate", "$ionicHistory", "$filter", "Notification",
  function ($scope, Tasks, Clients, $state, $stateParams, $ionicNavBarDelegate, $ionicHistory, $filter, Notification) {

        $ionicNavBarDelegate.showBackButton(false);

        if ($stateParams.pageFrom == 1) {

            $scope.isHideClientDescr = false;

        } else {
            $scope.isHideClientDescr = true;
        }

        //$scope.isNotify = false;

        // client in database
        Clients.getClientsList().then(function (clientList) {
            if (!clientList) return;

            console.log(clientList);
            $scope.clientArray = clientList;

            $scope.selectClientOption = $scope.clientArray[0];
        });

        $scope.cancelNewTask = function () {
            //$state.go("tab.tasks");

            $ionicHistory.goBack();
        };

        $scope.newTaskParams = {};

        //newTaskParams.isNotify = false;

        $scope.notificationChange = function () {

            console.log('Push Notification Change', $scope.isNotify);
        };

        $scope.saveNewTask = function () {
            // To add Task from Clien detail page

            if ($stateParams.pageFrom == 2) {
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
            params.isCompleted = false;
            params.isNotify = $scope.newTaskParams.isNotify;

            console.log("params " + params);
            //Call service function to add new task			
            Tasks.createNewTask(params).then(function (taskId) {
                if (!taskId) return;

                Tasks.getTaskById(taskId).then(function (task) {
                    if (!task) return;

                    if (params.isNotify == 'true') {
                        //Schedule task
                        //Notification.scheduleNotification(task);
                    }
                    $ionicHistory.goBack();
                });
            });
        };

        $scope.getSelectedValue = function (client) {
            //alert("scope - "+ client.clientDesc);
            $scope.selectedClientId = client.clientId;
        };
  }])

.controller('TasksDetailCtrl', ["$scope", "Tasks", "$stateParams", "$ionicPopup", "$state", "$rootScope", "$ionicNavBarDelegate", "Clients", "$ionicHistory", "$ionicActionSheet", "Notification", "$filter", function ($scope, Tasks, $stateParams, $ionicPopup, $state, $rootScope, $ionicNavBarDelegate, Clients, $ionicHistory, $ionicActionSheet, Notification, $filter) {

    if ($stateParams.pageFrom == 1) {

        $scope.disableEnableForm = false;
        $scope.toggleVisibility = false;
        $scope.disableEnableForm = false;

        $scope.pageTitle = "Task Detail";

        $ionicNavBarDelegate.showBackButton(true);

    } else {

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

        if ($scope.task.isNotify == "true" || $scope.task.isNotify === "true") {
            $scope.task.isNotify = true;
        } else {
            $scope.task.isNotify = false;
        }

        // client in database
        Clients.getClientById($scope.task.clientId).then(function (client) {
            if (!client) return;
            $scope.task.clientDesc = client.clientDesc;
        });
    });

    $scope.notificationChange = function () {

        console.log('Push Notification Change', $scope.task.isNotify);
    };

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
        param.taskStartDateTime = $filter('date')($scope.task.taskStartDateTime, 'medium');
        param.taskEndDateTime = $filter('date')($scope.task.taskEndDateTime, 'medium');
        param.taskNotes = $scope.task.taskNotes;
        param.clientId = $scope.task.clientId;
        param.isCompleted = $scope.task.isCompleted;
        param.isNotify = $scope.task.isNotify;

        console.log("EditTask param : " + param);
        Tasks.updateTask(param).then(function (task) {
            if (!task) return;
            //$scope.disableEnableForm = function(e){ return false;} 

            if (param.isNotify == 'true') {
                //Update notification
                //Notification.updateNotification(param);
            }

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

    $scope.completeTask = function () {

        var hideSheet = $ionicActionSheet.show({

            destructiveText: 'Complete Task',
            cancelText: 'Cancel',
            cancel: function () {
                hideSheet();
            },

            destructiveButtonClicked: function () {
                // update task with new params
                var param = {};
                param.taskId = $scope.task.taskId;
                param.taskTitle = $scope.task.taskTitle;
                param.taskDescription = $scope.task.taskDescription;
                param.taskStartDateTime = $scope.task.taskStartDateTime;
                param.taskEndDateTime = $scope.task.taskEndDateTime;
                param.taskNotes = $scope.task.taskNotes;
                param.clientId = $scope.task.clientId;
                param.isCompleted = true;
                param.isNotify = $scope.task.isNotify;

                console.log("EditTask param : " + param);
                Tasks.updateTask(param).then(function (task) {
                    if (!task) return;

                    //Cancel notification
                    //Notification.cancelNotification(param);

                    hideSheet();
                       var alertPopup = $ionicPopup.alert({
                         title: 'Task is Completed!',
                           buttons: [
                               {text: 'OK',
                               type: 'button-positive'
                               }
                           ]
                       });

                       alertPopup.then(function(res) {
                           $ionicHistory.goBack();
                       });
                
                    
                });
            }
        });
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