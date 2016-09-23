angular.module('SitterAdvantage.clientControllers', [])
	.controller('ClientsCtrl', ["$scope", "Clients", "$ionicPopup", "$state", "$ionicActionSheet", "$ionicHistory","$rootScope","Tasks",
 function ($scope, Clients, $ionicPopup, $state, $ionicActionSheet, $ionicHistory,$rootScope, Tasks) {

			console.log("ClientsCtrl is loaded");
			$scope.clients = [];

			// Insert client in database
			Clients.getClientsList().then(function (clientList) {
				if (!clientList) return;
				console.log(clientList);
				//$scope.clients = clientList;
				//Get kids
				$scope.getKidsForClient(clientList)
			});

			//Get kids for client
			$scope.getKidsForClient = function (clientsArray) {

				for (var i = 0; i < clientsArray.length; i++) {

					var client = clientsArray[i];
					Clients.getKidsForClient(client).then(function (clientWithKids) {

						$scope.clients.push(clientWithKids);
					});
				}
			};

	 		$scope.clientClicked = function($index){
				
				var client = $scope.clients[$index];
				
				$rootScope.segmentIndex = 0;
				
				$state.go("tab.client-detail", {
						clientId: client.clientId,
					});
			};
	 
			$scope.editClientDescription = function ($index) {
				// pop up Alert box
				$scope.data = {};

				$scope.selectedClient = $scope.clients[$index];

				var popUp = $ionicPopup.show({
					template: '<input type="text" ng-model="selectedClient.clientDesc" />',
					title: 'Edit Family Name',
					scope: $scope,
					buttons: [
						{
							text: 'Cancel',
							type: 'button-light',

            },
						{
							text: '<b>Save</b>',
							type: 'button-positive',
							onTap: function (e) {
								if (!$scope.selectedClient.clientDesc) {
									//don't allow the user to close untill he added something in input text
									e.preventDefault();
								} else {
									return $scope.selectedClient.clientDesc;
								}
							}
            }, ]

				});

				popUp.then(function (res) {
					if (!res) return;
					$scope.updateClientDescription(res, $index);
				});
			};

			$scope.updateClientDescription = function (clientDescription, $index) {

				// Insert client in database
				Clients.editClientDescription($scope.selectedClient).then(function (res) {
					if (!res) return;
					console.log(res)

					$scope.clients[$index] = $scope.selectedClient;
					//$state.reload();
				});
			}

			//delete client
			$scope.deleteClient = function ($index) {

				var client = $scope.clients[$index];
                
                  var popUp = $ionicPopup.show({
					title: 'Delete Client',
                    template: 'Note: All client details, including parents, kids and tasks will be permanently removed.',
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
								 Clients.deleteClient(client.clientId);
                                $scope.clients.splice($index, 1);
                                return;
							}
                        }, ]

				});
            
            popUp.then(function (res) {
					if (!res) {
                        return;
                    }			
				var hideSheet = $ionicActionSheet.show({

					destructiveText: 'Delete Client',
					cancelText: 'Cancel',

					cancel: function () {
						hideSheet();
					},

					destructiveButtonClicked: function () {
						//Delete client

						Clients.deleteClient(client.clientId).then(function (res) {

							// Delete parents for client
							Clients.deleteParentsForClient(client.clientId).then(function (res) {
								console.log("Parents deleted for client");
							});
							
							// Delete Kids for client
							Clients.deleteKidsForClient(client.clientId).then(function (res) {
								console.log("Kids deleted for client");
							});
							
							// Delete Tasks for client
							Tasks.deleteTaskForClient(client.clientId).then(function (res) {
								console.log("Task deleted for client");
							});
							
							$scope.clients.splice($index, 1);
							// hide sheet
							hideSheet();
						});
					}
				});
			});
            }

			$scope.addClient = function () {

				// pop up Alert box
				$scope.data = {};

				var popUp = $ionicPopup.show({
					template: '<input type="text" ng-model="data.menuItemText"/>',
					title: 'Add Family Name',
					scope: $scope,
					buttons: [
						{
							text: 'Cancel',
							type: 'button-light',

            },
						{
							text: '<b>Save</b>',
							type: 'button-positive',
							onTap: function (e) {
								if (!$scope.data.menuItemText) {
									e.preventDefault();
								} else {
									return $scope.data.menuItemText;
								}
							}

            }, ]

				});

				popUp.then(function (res) {
					if (!res) return;

					$scope.insertClient(res);
				});
			};

			$scope.insertClient = function (clientDesc) {

				// Insert client in database
				Clients.addNewClient(clientDesc).then(function (clientId) {
					if (!clientId) return;
					console.log(clientId)


					$state.go("tab.client-detail", {
						clientId: clientId,
					});

				}, function (error) { //"error" --> deferred.reject(err);
					
					//error code
					console.log(error)					
				});
			};	 	
}])

.controller('ClientDetailCtrl', ["$scope", "$stateParams", "$rootScope", "Clients", "$ionicNavBarDelegate", "$state", "$filter",
 function ($scope, $stateParams, $rootScope, Clients, $ionicNavBarDelegate, $state, $filter) {


		//Show nav back button
		$ionicNavBarDelegate.showBackButton(true);
		$scope.selectedClient = {};
		//used stateParams to access clientId which allows us to navigate to each client's detail page.

	  $scope.$on('$ionicView.loaded', function(){
		  
		  if (!$rootScope.segmentIndex) {

			$rootScope.segmentIndex = 0;
		 }

		$scope.selectedIndex = $rootScope.segmentIndex;
		$scope.setSelectedButton = $scope.selectedIndex;
		  
		//Here your view content is fully loaded !!
		 $scope.updateSelection();
		 
	  });
		//Get Client
		Clients.getClientById($stateParams.clientId).then(function (client) {
			if (!client) return;
			$scope.selectedClient = client;
		});

		//Get parents
		Clients.getParentsForClient($stateParams.clientId).then(function (parents) {
			if (!parents) return;
			$scope.selectedClient.parents = parents;
		});

		//Get kids
		Clients.getKidsForClientWithID($stateParams.clientId).then(function (kids) {
			if (!kids) return;
			$scope.selectedClient.kids = kids;
		});

		//Get Tasks
		Clients.getTasksForClient($stateParams.clientId).then(function (tasks) {
			if (!tasks) return;
			//$scope.selectedClient.tasks = tasks;

			$scope.changeDateFormat(tasks);
		});
	 
	 $scope.updateSelection = function () {
		 
		 	$scope.active_class1 = [];
		 	$scope.active_class2 = [];
		 	$scope.active_class3 = [];		  

			if ($scope.selectedIndex == 0) {

				$scope.active_class1.push('active');

			} else if ($scope.selectedIndex == 1) {
				
				$scope.active_class2.push('active');

			} else if ($scope.selectedIndex == 2) {

				$scope.active_class3.push('active');
			}
	 }

		$scope.changeDateFormat = function (taskList) {

			$scope.selectedClient.tasks = [];
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
				
				newTask.start_dateObj = new Date(task.taskStartDateTime);
				
				 if (newTask.start_dateObj < new Date()){
					  
					  newTask.isPending = true;
				  }else{
					  newTask.isPending = false;
				  }


				newTask.startDate = $filter('date')(new Date(task.taskStartDateTime), 'MMM, dd yyyy');
				newTask.startTime = $filter('date')(new Date(task.taskStartDateTime), 'hh:mm:a');

				$scope.selectedClient.tasks.push(newTask);

			});
		}

		//create functions to show and hide different subpages based on active segmented controls

		

		$scope.buttonClicked = function (index) {

			$scope.selectedIndex = index;
			$rootScope.segmentIndex = index;
			
			$scope.$apply();
			//$scope.updateSelection();
		}

		$scope.taskItemClicked = function ($index) {

			$state.go("tab.task-detail_client", {
				taskId: $scope.selectedClient.tasks[$index].taskId
			});
		}

		//handler for editing parent information
		$scope.editParent = function ($index) {
			$state.go("tab.edit-parent", {
				parentId: $scope.selectedClient.parents[$index].parentId
			});
		}

		//handler for editing kid information
		$scope.editKid = function ($index) {
			$state.go("tab.edit-kid", {
				kidId: $scope.selectedClient.kids[$index].kidId
			});
			$ionicNavBarDelegate.showBackButton(false);
		}

		//handler for editing task information
		$scope.editTask = function ($index) {
			$state.go("tab.task-detail_client", {
				taskId: $scope.selectedClient.tasks[$index].taskId
			});
		}

		//handler for adding new task
		$scope.addNewTask = function () {

			$state.go("tab.new-task_client", {
				clientId: $stateParams.clientId
			});
		}

		//handler for adding new parent
		$scope.addNewParent = function () {

			$state.go("tab.new-parent", {
				clientId: $stateParams.clientId
			});
		}

		//handler for adding new kid
		$scope.addNewKid = function () {
			$state.go("tab.new-kid", {
				clientId: $stateParams.clientId
			});
		}

		$scope.editClient = function (selectedClient) {
			//Change the format of kids birthday to a date object so it can be edited
			// selectedClient.kids.kidBirthdate
			$state.go('tab.edit-client', {
				clientId: $stateParams.clientId
			});
		}

}])

.controller('EditParentCtrl', ["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate",  "$timeout", "$state", "$ionicPopup", "$ionicHistory", "$ionicActionSheet",
 function ($scope, $stateParams, Clients, $ionicNavBarDelegate, $timeout, $state,$ionicPopup, $ionicHistory, $ionicActionSheet) {
     
      $scope.callAtTimeout = function () {
          
          $scope.parentPrimaryPhoneError = "";

      }
 

		//check if the user input is an integer value
		$scope.integerval = /^\d*$/;

		//check if the user input is a string value
		$scope.stringval = /^[a-zA-Z\s]*$/;

		$ionicNavBarDelegate.showBackButton(false);


		//check if the user input is an integer value
		$scope.integerval = /^\d*$/;

		//check if the user input is a string value
		$scope.stringval = /^[a-zA-Z\s]*$/;



		//$scope.params = {};

		Clients.getParentById($stateParams.parentId).then(function (parent) {
			if (!parent) return;
			$scope.parent = parent;
		});

		$scope.saveParent = function () {
            ///////////////////////vaidation on parent detail page///////////////////
            //check if parent primary phone is required
            if($scope.parent.parentPrimaryphone == null){
                $scope.parentPrimaryPhoneError = "* Parent Primary Phone is required."
                $timeout($scope.callAtTimeout, 4000);
                return;
            }
            else{
					  $scope.parentPrimaryPhoneError = "";
				  }
            
            

			//$scope.params.clientId = $stateParams.clientId;
			Clients.editParentInfo($scope.parent).then(function (parentId) {
				if (!parentId) return;

				$ionicHistory.goBack();
			});
		}

		$scope.cancelParent = function () {

			$ionicHistory.goBack();
			$ionicNavBarDelegate.showBackButton(true);

		}

		$scope.deleteParent = function () {
                
                  var popUp = $ionicPopup.show({
					title: 'Delete Parent',
                    template: 'Are you sure you want to delete this parent?',
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
								 Clients.deleteParent($scope.parent.parentId);
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
}])

.controller('EditKidCtrl', ["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate", "$ionicPopup", "$state", "$ionicActionSheet", "$ionicHistory","$cordovaCamera","$filter",
 function ($scope, $stateParams, Clients, $ionicNavBarDelegate, $ionicPopup, $state, $ionicActionSheet, $ionicHistory,$cordovaCamera,$filter) {

		//check if the user input is an integer value
		$scope.integerval = /^\d*$/;

		//check if the user input is a string value
		$scope.stringval = /^[a-zA-Z\s]*$/;


		Clients.getKidById($stateParams.kidId).then(function (kid) {
			if (!kid) return;
			$scope.kid = kid;
			
			$scope.imgURI = $scope.kid.kidPicture;
		});

		$scope.saveKid = function () {
			
			if (!$scope.imgURI){
				$scope.imgURI = "";
			}
			$scope.kid.kidPicture = $scope.imgURI;
			$scope.kid.kidBirthdate = $filter('date')($scope.kid.kidBirthdate, 'MMMM dd, yyyy');

			Clients.editKidInfo($scope.kid).then(function (res) {
				if (!res) return;
				$ionicHistory.goBack();
			});

			//Note: after going to client-details we should land on kid segmented control, (ng-switch when =1 ) instead of parent
		}
		$scope.cancelKid = function () {

			$ionicHistory.goBack();

			$ionicNavBarDelegate.showBackButton(true);
			//Note: after going to client-details we should land on kid segmented control, (ng-switch when = 2)instead of parent
		}

		$scope.deleteKid = function () {
            
             var popUp = $ionicPopup.show({
					title: 'Delete Kid',
                    template: 'Are you sure you want to delete this kid?',
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
								 Clients.deleteKid($scope.kid.kidId);
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
//			var hideSheet = $ionicActionSheet.show({
//
//				destructiveText: 'Delete Kid',
//				cancelText: 'Cancel',
//
//				cancel: function () {
//					hideSheet();
//				},
//
//				destructiveButtonClicked: function () {
//					//Delete kid
//					Clients.deleteKid($scope.kid.kidId).then(function (res) {
//
//						$ionicHistory.goBack();
//						hideSheet();
//					});
//				}
//			});
			//Note: after going to client-details we should land on kid segmented control, (ng-switch when = 2)instead of parent
		}

		$scope.editKidPicture = function () {
			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{
						text: 'Camera'
                 },{
						text: 'Photo Library'
                 }
      ],
				destructiveText: 'Delete Photo',
				cancelText: 'Cancel',

				cancel: function () {
					hideSheet();
				},
				buttonClicked: function (index) {
					//code for taking a new photo
					
					if (index == 0){
						$scope.openCamera();						
					}else if (index == 1){						
						$scope.openPhotoLibrary();
					}
					
					return true;
				},

				destructiveButtonClicked: function () {
					hideSheet();
				}
			});
		}

		$scope.openCamera = function () {
			var options = {
				quality: 75,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 300,
				targetHeight: 300,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: true
			};

			$cordovaCamera.getPicture(options).then(function (imageData) {
				$scope.imgURI = "data:image/jpeg;base64," + imageData;
			}, function (err) {
				// An error occured. Show a message to the user
			});
		}

		$scope.openPhotoLibrary = function () {
			var options = {
				quality: 75,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 300,
				targetHeight: 300,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
			};

			$cordovaCamera.getPicture(options).then(function (imageData) {
				$scope.imgURI = "data:image/jpeg;base64," + imageData;
			}, function (err) {
				// An error occured. Show a message to the user
			});
		}

}])

.controller('NewParentCtrl', ["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate","$timeout", "$state", "$ionicHistory",
 function ($scope, $stateParams, Clients, $ionicNavBarDelegate, $timeout, $state, $ionicHistory) {

		//check if the user input is an integer value
		$scope.integerval = /^\d*$/;

		//check if the user input is a string value
		$scope.stringval = /^[a-zA-Z\s]*$/;

		$ionicNavBarDelegate.showBackButton(false);

		$scope.params = {};
     
     
      $scope.callAtTimeout = function () {
          
           $scope.parentNameError = "";
          $scope.parentPrimaryPhoneError = "";
          $scope.kidNameError = "";
      }

		$scope.saveParent = function () {
            
            //////////////////////Validations for New Parent Page//////////////////////////////
            //check if parent title is null
            if($scope.params.parentName == null){
                $scope.parentNameError = "* Parent name is required."
                $timeout($scope.callAtTimeout, 4000);
                return;
            }
            else{
					  $scope.parentNameError = "";
				  }
            
            //check if the primary phone is empty
             if($scope.params.parentPrimaryphone == null){
                $scope.parentPrimaryPhoneError = "* Primary phone number is required."
                $timeout($scope.callAtTimeout, 4000);
                return;
            }
            else{
					  $scope.parentPrimaryPhoneError = "";
				  }
            
            

			$scope.params.clientId = $stateParams.clientId;
			Clients.addParentForClient($scope.params).then(function (parentId) {
				if (!parentId) return;

				$ionicHistory.goBack();
			});
		}

		$scope.cancelParent = function () {
			$ionicHistory.goBack();
		}
}])

.controller('NewKidCtrl', ["$scope", "$stateParams", "Clients", "$ionicNavBarDelegate","$timeout", "$state", "$ionicHistory", "$cordovaCamera","$ionicPopup", "$filter",
 function ($scope, $stateParams, Clients, $ionicNavBarDelegate, $timeout, $state, $ionicHistory, $cordovaCamera, $ionicPopup,$filter) {
     
     
     $scope.callAtTimeout = function () {
          
          $scope.kidNameError = "";
         $scope.kidBirthDateError = "";
         $scope.kidGenderError = "";

      }

		$ionicNavBarDelegate.showBackButton(false);

     
		//check if the user input is an integer value
		$scope.integerval = /^\d*$/;

		//check if the user input is a string value
		$scope.stringval = /^[a-zA-Z\s]*$/;

		$scope.kid = {};
     
		$scope.addPhoto = function () {
            
            
         		var popUp = $ionicPopup.show({
					title: 'Add New Photo',
					scope: $scope,
					buttons: [
						{
							text: 'Cancel',
							type: 'button-light',

            },
						{
							text: '<b>Camera</b>',
							type: 'button-positive',
							onTap: function (e) {
								$scope.openCamera();
							}
            }, ]

				});

				popUp.then(function (res) {
					if (!res) return;
				});
			};
            
		$scope.saveKid = function () {
            
            
            ////////////////////validaitons for new kid page//////////////////
        //check if the kid name is empty
        if($scope.kid.kidName == null){
                $scope.kidNameError = "* Kid name is required."
                $timeout($scope.callAtTimeout, 4000);
                return;
            }
            else{
					  $scope.kidNameError = "";
				  }
            //check if the kid birthdate is empty
        if($scope.kid.kidBirthdate == null){
                $scope.kidBirthDateError = "* Kid Date of Birth is required."
                $timeout($scope.callAtTimeout, 4000);
                return;
            }
            else{
					  $scope.kidBirthDateError = "";
				  }
            
//            //check if the kid date if birth is greater than current date
//             var date = new Date();
//             if($scope.kid.kidBirthdate < date){
//                 alert($scope.kid.kidBirthdate);
//                $scope.kidBirthDateError = "* Kid Date of Birth is not valid."
//                $timeout($scope.callAtTimeout, 4000);
//                return;
//            }
//            else{
//					  $scope.kidBirthDateError = "";
//				  }
            
            //check if the kid gender is empty
            if($scope.kid.kidGender == null){
                $scope.kidGenderError = "* Kid Gender is required."
                $timeout($scope.callAtTimeout, 4000);
                return;
            }
            else{
					  $scope.kidGenderError = "";
				  }

			$scope.kid.clientId = $stateParams.clientId;
			if (!$scope.imgURI){
				$scope.imgURI = "";
			}			
			$scope.kid.kidPicture = $scope.imgURI;
			$scope.kid.kidBirthdate = $filter('date')($scope.kid.kidBirthdate, 'MMMM dd, yyyy');
			
			Clients.addkidForClient($scope.kid).then(function (res) {
				if (!res) return;
				$ionicHistory.goBack();
			});

		}

		$scope.cancelKid = function () {
			$ionicHistory.goBack();
		}

		$scope.openCamera = function () {
			var options = {
				quality: 75,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 300,
				targetHeight: 300,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
			};

			$cordovaCamera.getPicture(options).then(function (imageData) {
				$scope.imgURI = "data:image/jpeg;base64," + imageData;
			}, function (err) {
				// An error occured. Show a message to the user
			});
		}

		$scope.openPhotoLibrary = function () {
			var options = {
				quality: 75,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 300,
				targetHeight: 300,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
			};

			$cordovaCamera.getPicture(options).then(function (imageData) {
				$scope.imgURI = "data:image/jpeg;base64," + imageData;
			}, function (err) {
				// An error occured. Show a message to the user
			});
		}

}]);