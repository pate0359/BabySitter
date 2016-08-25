angular.module('SitterAdvantage.taskControllers', [])

.controller('TaskCtrl', ["$scope", "Tasks", "$state",
      function ($scope, Tasks, $state) {

		console.log("TaskCtrl is loaded");
		$scope.tasks = [];
		$scope.tasks = Tasks.all();
		$scope.addTask = function () {
			$state.go("tab.new-task");
		}

		$scope.taskClicked = function ($index) {
			var item = $scope.tasks[$index];
			$state.go('tab.task-detail' + item.taskId);
		}
        
        $scope.goToInstructions = function(){
            $state.go('tab.instructions');
        }
      }])

.controller('NewTaskCtrl', ["$scope", "Tasks", "Clients", "$state", "$stateParams", "$ionicNavBarDelegate","$ionicHistory",
  function ($scope, Tasks, Clients, $state, $stateParams, $ionicNavBarDelegate,$ionicHistory) {
      
      //check if the user input is an integer value
     $scope.integerval = /^\d*$/;
     
     //check if the user input is a string value
     $scope.stringval = /^[a-zA-Z\s]*$/;
      
      //validating start and end dates
      
       $scope.checkErr = function(startDate,endDate) {
        $scope.errMessage1 = '';
        $scope.errMessage2 = '';
        
        var curDate = new Date();
        
        if(new Date(startDate) > new Date(endDate)){
          $scope.errMessage1 = 'End Date should be greater than start date';
          return false;
        }
        if(new Date(startDate) < curDate){
           $scope.errMessage2 = 'Start date should not be before today.';
           return false;
        }
    };

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
			// console.dir($scope);
			// console.dir($scope.newTask);
			// Tasks.createNewTask($scope.newTask);
			// console.log("inside saveNewTask ");
			// Go back to client detail page

			//alert("Client Id - "+ $scope.selectedClientId);

			// To add Task from Clien detail page
			 $scope.selectedClientId = $stateParams.clientId;

			 // if (!$scope.selectedClientId) {

			 // 	alert("Please select client.")
			 // }

			var params = {};

			params.taskTitle = $scope.newTaskParams.taskTitle;
			params.taskDescription = $scope.newTaskParams.taskDesc;
			params.startDate = $scope.newTaskParams.taskStartDate;
			params.endDate = $scope.newTaskParams.taskEndDate;
			params.startTime = $scope.newTaskParams.taskStartTime;
			params.endTime = $scope.newTaskParams.taskEndTime;
			params.taskNotes = $scope.newTaskParams.taskNotes;
			params.clientId = $scope.selectedClientId;
			params.kidId = 0;

			console.log("params "+params);
			//Call service function to add new task
			Tasks.createNewTask(params);
			
			$ionicHistory.goBack();
		};

		$scope.getSelectedValue= function (client) {


	       //$scope.CategoryID = category.id;
			//alert("scope - "+ client.clientDesc);

			$scope.selectedClientId = client.clientId;

	    };


		//selecting clients and filtering kids to dispay on "new task" form
		//Clients.loadFromDB();
		// $scope.kids = [];
		// $scope.cid = 0; //3;
		// $scope.clientList = Clients.all();

		//$scope.selectedKidId = 0;

		//console.log($scope.clientList[0]);
		//console.log("NewTaskCtrl :: $scope.clientList " + $scope.clientList.length);
		// $scope.kidList = []; //[{"kidId":1, "kidName":"Jack"},{"kidId":2, "kidName":"Andrea"},{"kidId":3, "kidName":"Ariana"}];

		// $scope.newTask = {
		// 	clientId: "",
		// 	kidId: "",
		// 	taskTitle: "",
		// 	taskDescription: "",
		// 	startDate: "",
		// 	endDate: "",
		// 	startTime: "",
		// 	endTime: "",
		// 	taskNotes: ""
		// };

		// $scope.rememberKidId = function (kidId) {

		// 	$scope.newTask.kidId = kidId;

		// }	

		

		// $scope.loadKiddy = function (cid) {
		// 	console.log(JSON.stringify($scope.clientList));
		// 	console.log(cid);
		// 	var num = $scope.clientList.length;
		// 	for (var c = 0; c < num; c++) {
		// 		console.log("matching..." + $scope.clientList[c].clientId + " " + cid);
		// 		if ($scope.clientList[c].clientId == cid) {
		// 			$scope.kids = $scope.clientList[c].kids;
		// 			$scope.newTask.clientId = cid;
		// 			console.log(JSON.stringify($scope.kids));
		// 		}
		// 	}
		// }

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
	console.log("inside task details controller");

	$scope.task = Tasks.get($stateParams.taskId);
	

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
		param.taskStartdate = $scope.task.taskStartdate;
		param.taskEnddate = $scope.task.taskEnddate;
		param.taskStarttime = $scope.task.taskStarttime;
		param.taskEndtime = $scope.task.taskEndtime;
		param.taskNotes = $scope.task.taskNotes;
		param.clientId = $scope.task.clientId;
		
		console.log("EditTask param : "+param);
		Tasks.updateTask(param);
		
		//$scope.disableEnableForm = function(e){ return false;} 
		$scope.disableEnableForm = false;
		$scope.toggleVisibility = false;
		$ionicNavBarDelegate.showBackButton(true);
		
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
		              Tasks.deleteTask($scope.task.taskId);
                    $ionicHistory.goBack();
                    hideSheet();
                }
            });
		
	}
	
	$scope.editTask = function () {

	}

}]);