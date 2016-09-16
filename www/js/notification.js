var db;
angular.module('SitterAdvantage.notificationServices', [])

.factory('Notification', function($q,$cordovaLocalNotification) {

	 return {
       
		//Schedule Notification
        scheduleNotification: function (task) {

			$cordovaLocalNotification.schedule({
				id: task.taskId,
				date: new Date(task.taskStartDateTime),
				text: task.taskTitle,
				title: 'Sitter Advantage'
			}).then(function () {
				console.log("Notification set");
			});
			
		},
		//update Notification
        updateNotification: function (task) {

			$cordovaLocalNotification.isPresent(task.taskId).then(function (present) {
				if (present) {

					$cordovaLocalNotification.update({
						id: task.taskId,
						title: 'Sitter Advantage',
						text: task.taskTitle
					}).then(function (result) {
						console.log('Updated Notification Text');
					});
				}else{ // Set new notification
					
					console.log("No notification with current ID");
					
					$cordovaLocalNotification.schedule({
						id: task.taskId,
						date: new Date(task.taskStartDateTime),
						text: task.taskTitle,
						title: 'Sitter Advantage'
					}).then(function () {
						console.log("Notification set");
					});
				}
    		});
		},
		 //Cancel Notification
        cancelNotification: function (task) {

			$cordovaLocalNotification.isPresent(task.taskId).then(function (present) {
				if (present) {
					$cordovaLocalNotification.cancel(task.taskId).then(function (result) {
						console.log('Notification Cancelled');
					});
				} else {
					console.log("No notification with current ID");
				}
			});
		}
	 }
	}
); 