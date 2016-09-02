angular.module('SitterAdvantage.dbService', [])

.factory('dbService', function() {

	//---------------------- function responsible to create all the tables once ----------------------
	var createTables = function(){
	  db.transaction(function(tx) {
//	  	    tx.executeSql("DROP TABLE clients");
//	  	    tx.executeSql("DROP TABLE parents");
//	  	    tx.executeSql("DROP TABLE tasks");
//	  	    tx.executeSql("DROP TABLE kids");         

	      tx.executeSql("CREATE TABLE IF NOT EXISTS clients (clientId integer primary key , clientDesc text)",[], function(){}, function(){});
	      tx.executeSql("CREATE TABLE IF NOT EXISTS parents(parentId integer primary key , parentName text, parentStreet text, parentCity text, parentState text, parentZipcode text, parentPrimaryphone text, parentSecondaryphone text, parentEmailid text, parentNotes text, clientId integer)",[], function(){}, function(){});  
	      tx.executeSql("CREATE TABLE IF NOT EXISTS tasks(taskId integer primary key , taskTitle text, taskDescription text, taskStartDateTime text, taskEndDateTime text, taskNotes text,clientId integer, kidId integer, isCompleted bool)" , [], function(){}, function(){});
	      tx.executeSql("CREATE TABLE IF NOT EXISTS kids(kidId integer primary key, kidName text, kidBirthdate numeric, kidGender text, kidPicture text, kidNotes text,clientId integer, allergyDescription text,disabilityDescription text, medicationDescription text)" , [], function(){}, function(){});
          
	  },

	  function(){
	    console.error("Failed to create tables into database ");
	  });
	};

   //------------------------ function used to create and delete fake data ---------------------------
	var insertTestData = function(){
	  console.log("data is going to be inserted into db");
	  db.transaction(function(tx){
	  	//Delete all test data
	    tx.executeSql("DELETE FROM clients", []);
	    tx.executeSql("DELETE FROM parents", []);
	    tx.executeSql("DELETE FROM kids", []);
	    tx.executeSql("DELETE FROM tasks", []);
	    
	    //3 clients
	    tx.executeSql("INSERT INTO clients (clientDesc) VALUES (?)", ["The Smith Family"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO clients (clientDesc) VALUES (?)", ["The Jones Family"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO clients (clientDesc) VALUES (?)", ["The Jetsons Family"], function(){ }, function(){});
	    //5 parents
	    tx.executeSql("INSERT INTO parents (parentName, parentNotes, parentStreet, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Maria Smith","Primary Guardian – Custody","10 Jones Street","Erie","Pennsylvania","23877","613-574-5893","613-584-6839","maria.smith@gmail.com","1"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO parents (parentName, parentNotes, parentStreet, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["John Smith","Divorced – allowed contact with kids","77 King Street","Erie","Pennsylvania","23767","287-456-6812","288-433-6691","john.smith@gmail.com.com","1"], function(){ }, function(){});
	    tx.executeSql("INSERT INTO parents (parentName, parentNotes, parentStreet, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Mack Jones","","100 Arthur Street","Los Angeles","California","90125","623-546-5582","623-543-5571","mack.jones@hotmail.com","2"], function(){}, function(){});
	    tx.executeSql("INSERT INTO parents (parentName, parentNotes, parentStreet, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["Francine Jones","","100 Arthur  Street","Los Angeles","Californa","90125","612-335-5199","614-445-8923","Francine.jones@hotmail.com","2"], function(){}, function(){});
	    tx.executeSql("INSERT INTO parents (parentName, parentNotes, parentStreet, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId) VALUES (?,?,?,?,?,?,?,?,?,?)", 
	      ["George Jetson","Single Dad - Custody","990 Pluto Drive Street","Denver","Collorado","23567","683-559-2295","165-345-4451","george.jetsen@gmail.com","3"], function(){ }, function(){});
	
	    //6 kids
	    tx.executeSql("INSERT INTO kids (kidName, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,  allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Rohn Smith", "2011-03-12", "Male", "No iPads or phones allowed", "Rohn.jpg", "1","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidName, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Samuel Smith", "17/June/2006", "Male", "Video games off at 8:00", "Samuel.jpg", "1","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidName, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Jane Smith", "09/March/2008", "Female", "Sensitive to high volume sounds or music", "Jane.jpg","1","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidName, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Fred Jones", "06/July/2011", "Male", "Limit watching TV to 2 hours maximum.", "Fred.jpg", "2","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidName, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Judy Jetson", "12/12/2012", "Female", "She likes reading books.", "Judy.jpg", "3","","",""], function(){}, function(){});
	    tx.executeSql("INSERT INTO kids (kidName, kidBirthdate, kidGender, kidNotes, kidPicture, clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?)", 
	      ["Robert", "Jetson", "11/October/2015", "Male", "No meat is allowed", "Robert.jpg","3","","",""], function(){}, function(){});
	    //4 tasks

	    console.log("----- TASK -----");

	    tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartDateTime, taskEndDateTime, taskNotes, clientId,kidId,isCompleted) VALUES (?,?,?,?,?,?,?,?)", 
	      ["Lunch for Rohn","Nutritious lunch with a blend of vegetables", "Aug 27, 2016 8:09:00 PM","Aug 27, 2016 8:09:00 PM","Favourite vegetables: Avocado, Potatoes and Tomatoes","1","1",true], function(res){ console.log("res :"+res)}, function(error){ console.log("error"+error)});
	    tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartDateTime, taskEndDateTime, taskNotes, clientId,kidId,isCompleted) VALUES (?,?,?,?,?,?,?,?)", 
	      ["Homework for Samuel","Help Samuel complete all his homework", "Aug 27, 2016 8:09:00 PM","Aug 27, 2016 8:09:00 PM","Homework details: Read a short story and complete 3 exercises","1","2",false], function(){ }, function(){});
	    tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartDateTime, taskEndDateTime, taskNotes, clientId,kidId,isCompleted) VALUES (?,?,?,?,?,?,?,?)", 
	      ["Drawing time for Jane","Prepare crayons and an album for Jane and give her some picture to duplicate", "Aug 27, 2016 8:09:00 PM","Aug 27, 2016 8:09:00 PM","Help her to start and make sure to check her progress","1","3",true], function(){}, function(){});
	     tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartDateTime, taskEndDateTime, taskNotes, clientId,kidId,isCompleted) VALUES (?,?,?,?,?,?,?,?)", 
	      ["Play time for Judy","Help Judy decorate her dollhouse", "Aug 27, 2016 8:09:00 PM","Aug 27, 2016 8:09:00 PM","Ask her to bring all her furniture for dollhouse","3","5",false], function(){ }, function(){});
	      tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartDateTime, taskEndDateTime, taskNotes, clientId,kidId,isCompleted) VALUES (?,?,?,?,?,?,?,?)", 
	      ["Babysit Robert","Give him dinner and put him to sleep", "Aug 27, 2016 8:09:00 PM","Aug 27, 2016 8:09:00 PM","Do not let Robert fall asleep on the sofa.","3","6",false], function(){ }, function(){});
	      tx.executeSql("INSERT INTO tasks (taskTitle, taskDescription, taskStartDateTime, taskEndDateTime, taskNotes, clientId,kidId,isCompleted) VALUES (?,?,?,?,?,?,?,?)", 
	      ["iPad game time for Fred","Give iPad to Fred for 1 hour to play a game.", "Aug 27, 2016 8:09:00 PM","Aug 27, 2016 8:09:00 PM","Make sure he has finished his dinner and monitor the time","2","4",false], function(){}, function(){});
	  }, 
	    function(){
	      console.error("Failed to insert items into database");   
	  });	
	};

	//function to be used in all services to execute sql statements
	var executeStatement = function(query, params , sucessCallback, errorCallback){
		if (db) {		
			db.transaction(function(tx) {
		  		tx.executeSql(query, params, sucessCallback, errorCallback)
		  	});
		}else{
			console.error("db is not opened");
		}
	};

	return{
		createTables: createTables,
		insertTestData:insertTestData,
		executeStatement: executeStatement
	}
});