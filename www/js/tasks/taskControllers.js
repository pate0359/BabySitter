angular.module('SitterAdvantage.taskControllers', [])

.controller('TaskCtrl', ["$scope", "Tasks", "$state","$filter", "$stateParams","ResourcesService","$ionicPopup", "Notification",
      function ($scope, Tasks, $state,$filter, $stateParams,    ResourcesService, $ionicPopup,Notification) {

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
				  	
				  	newTask.kidName = task.kidName;
				  
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
        
         
        $scope.deleteTask = function($index){
            
            var task = $scope.tasks[$index];
                var popUp = $ionicPopup.show({
					title: 'Delete Task',
                    template: 'Are you sure you want to delete this task?',
					scope: $scope,
					buttons: [
						{
							text: 'Cancel',
							type: 'button-light',
                        },
						{
							text: '<b>Delete</b>',
							type: 'button-positive',
                            onTap: function (e) {
								 //Delete Task 
                                Tasks.deleteTask(task.taskId);
                                $scope.tasks.splice($index, 1);
                                Notification.cancelNotification(task); 
                                return;
							}
                        }, ]

				});
            
            popUp.then(function (res) {
					if (!res) {
                        return;
                    }			
				});
			};     
		
		ResourcesService.getDefaults().then(function (defaults) {
				
				 if (!defaults){
					 
					 db.transaction(function(tx) {
						  tx.executeSql("INSERT INTO defaults (message) VALUES (?)", ["I am in trouble! Come home now!"], function(){ }, function(){});
					 });
				 }
		})
}])

.controller('NewTaskCtrl', ["$scope", "Tasks", "Clients", "$state", "$stateParams", "$ionicNavBarDelegate", "$ionicHistory", "$filter", "Notification","$timeout",
  function ($scope, Tasks, Clients, $state, $stateParams, $ionicNavBarDelegate, $ionicHistory, $filter, Notification,$timeout) {

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
			$scope.selectedClientId = $scope.selectClientOption.clientId;
			
			// get kids for client
			Clients.getKidsForClientWithID($scope.selectClientOption.clientId).then(function (kids) {
				if (!kids) return;
				$scope.kidsArray = kids;
				$scope.selectKidOption = $scope.kidsArray[0];
				$scope.selectedKidId = $scope.selectKidOption.kidId;
			});
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
      
      $scope.callAtTimeout = function () {
          
           $scope.errorStartDateTime = "";
           $scope.titleError = "";
            $scope.errorEndDateTime = "";
      }
        $scope.saveNewTask = function () {
            
        //////////////////////////////Validations for new task////////////////////////////////////////
            
            //check if any of the fields are null and set them to None
//            
//            for (var i = 0; i < $scope.newTaskParams.length; i++) { 
//                if($scope.newTaskParams[i] == null){
//                    alert("hi");
//                }
//                }
            
             //check if the task title is empty
            if($scope.newTaskParams.taskTitle == null){
                $scope.titleError = "* Task title is required."
                $timeout($scope.callAtTimeout, 4000);
                return;
            }
            else{
					  $scope.titleError = "";
				  }
            
                  
            //check if start date/time is greater than end date/time
				  if ($scope.newTaskParams.startdatetimeValue >= $scope.newTaskParams.enddatetimeValue){
					  
                      $scope.errorStartDateTime = "* Start Date/Time shoule not be greater than or equal to End Date/Time.";
                      
                      $timeout($scope.callAtTimeout, 4000);
                      
                      return;
				  }
           
                else{
					  $scope.errorStartDateTime = "";
				  }
      
                 //check if start date/time is null
				  if ($scope.newTaskParams.startdatetimeValue == null){
					  
                      $scope.errorStartDateTime = "* Start Date and Time is required.";
                      
                      $timeout($scope.callAtTimeout, 4000);
                      
                      return;
				  }
           
                else{
					  $scope.errorStartDateTime = "";
				  }
            
            
             //check if end date/time is null
				  if ($scope.newTaskParams.enddatetimeValue == null){
					  
                      $scope.errorEndDateTime = "* End Date and Time is required.";
                      
                      $timeout($scope.callAtTimeout, 4000);
                      
                      return;
				  }
           
                else{
					  $scope.errorEndDateTime = "";
				  }
            
            
      
      
            
            
           
            
            
            
                
            
            // To add Task from Client detail page

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
            params.kidId = $scope.selectedKidId;
            params.isCompleted = false;
            params.isNotify = $scope.newTaskParams.isNotify;

            console.log("params " + params);
            //Call service function to add new task			
            Tasks.createNewTask(params).then(function (taskId) {
                if (!taskId) return;

                Tasks.getTaskById(taskId).then(function (task) {
                    if (!task) return;

                    if (params.isNotify == true || params.isNotify == 'true') {
                        //Schedule task
                        Notification.scheduleNotification(task);
                    }
                    $ionicHistory.goBack();
                });
            });
        };

        $scope.getSelectedValue = function (client) {
            //alert("scope - "+ client.clientDesc);
            $scope.selectedClientId = client.clientId;
			
			 // get kids for client
			Clients.getKidsForClientWithID(client.clientId).then(function (kids) {
				if (!kids) return;
				$scope.kidsArray = kids;
				$scope.selectKidOption = $scope.kidsArray[0];
				$scope.selectedKidId = $scope.selectKidOption.kidId;
			});
        };
	  
	  $scope.getSelectedValueForKid = function (kid) {
            //alert("scope - "+ client.clientDesc);
            $scope.selectedKidId = kid.kidId;
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

            if ((param.isNotify == true || param.isNotify == 'true')) {
                //Update notification
                Notification.updateNotification(param);
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
                    Notification.cancelNotification(param);

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
        
        var popUp = $ionicPopup.show({
					title: 'Delete Task',
                    template: 'Are you sure you want to delete this task?',
					scope: $scope,
					buttons: [
						{
							text: 'Cancel',
							type: 'button-light',

                        },
						{
							text: '<b>Delete</b>',
							type: 'button-positive',
                            onTap: function (e) {
								 Tasks.deleteTask($scope.task.taskId);
                                //Cancel notification
                                Notification.cancelNotification($scope.task);
                                $ionicHistory.goBack();
                                return;
							}
                        }, ]

				});
            
            popUp.then(function (res) {
					if (!res) {
                        return;
                    }			
				});
    }
}]);