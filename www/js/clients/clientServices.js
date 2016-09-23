angular.module('SitterAdvantage.clientServices', [])

.factory('Clients', ['dbService', '$q', function (dbService, $q) {

    var clients = [];
    var parents = [];
    var kids = [];
    var tasks = [];

    return {

        //var clientId;

        //// ********************* Client  ********************* ////

        //Get cleint by ID
        getClientById: function (clientId) {

            var d = $q.defer();

            var query = "SELECT * FROM clients WHERE clientId = ?";
            var querySuccessCallback = function (tx, res) {
                console.log(res);
                
                var client = res.rows.item(0);
                d.resolve(client);
            };
            //error call back
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }

            dbService.executeStatement(query, [clientId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        //get client list
        getClientsList: function () {

            var d = $q.defer();

            var query = "SELECT * FROM clients";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("clients count " + res.rows.item);
                console.log(res.rows.item);


                var clientsList = [];

                for (var k = 0; k < res.rows.length; k++) {
                    clientsList.push(res.rows.item(k));
                }

                d.resolve(clientsList);
            };

            dbService.executeStatement(query, [], querySuccessCallback, queryErrorCallback);

            return d.promise;

        },

        // add new client description
        addNewClient: function (params) {

            var d = $q.defer();

            var query = "INSERT INTO clients (clientDesc) VALUES (?)";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("insert statement for adding a newClient succeeded");
                console.log(res);
                console.log(res.insertId);
                d.resolve(res.insertId);
                // get client id for new client after adding it.
                //return res.insertId; // return client id 
            }

            dbService.executeStatement(query, [params], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        // Update "client" description
        editClientDescription: function (clientInfo) {

            var d = $q.defer();

            var description = clientInfo.description;
            var id = clientInfo.clientId;
            var query = 'UPDATE clients SET clientDesc= ? WHERE clientId=?';
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("update statement for updating a Client succeeded");
                console.log(res);

                d.resolve(res);
            };
            dbService.executeStatement(query, [description, id], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        //Delete "client"    
        deleteClient: function (clientId) {

            var d = $q.defer();

            var query = "DELETE FROM clients where clientId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("delete cleint succeeded");
                console.log(res);
                //tasks = $filter('filter')(tasks, {taskId: '!taskId'})  
                d.resolve(res);
            };

            dbService.executeStatement(query, [clientId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        //// ********************* Kids  ********************* ////

        getKidById: function (kidId) {

            var d = $q.defer();
            var query = "SELECT * FROM kids WHERE kidId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log(res);
                
                var kid = res.rows.item(0);
                d.resolve(kid);
                
            };

            dbService.executeStatement(query, [kidId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        //this function gets the kids names to display in client list tab
        getKidsForClientWithID: function (clientId) {

            var d = $q.defer();

            var query = "SELECT * FROM kids k WHERE k.clientId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("select statement for kids of single client succeeded");
                console.log("kids count " + res.rows.length);
                var kids = [];
                for (var k = 0; k < res.rows.length; k++) {
                    kids.push(res.rows.item(k));
                }

                d.resolve(kids);
            };

            dbService.executeStatement(query, [clientId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        getKidsForClient: function (client) {

            var d = $q.defer();

            var query = "SELECT * FROM kids k WHERE k.clientId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("select statement for kids of single client succeeded");
                console.log("kids count " + res.rows.length);
                var kids = [];
                for (var k = 0; k < res.rows.length; k++) {
                    kids.push(res.rows.item(k));
                }
                client.kids = kids;
                // Return back to "then" function with data
                d.resolve(client);
            };

            dbService.executeStatement(query, [client.clientId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },


        addkidForClient: function (params) {

            var d = $q.defer();

            var query = "INSERT INTO kids (kidName, kidBirthdate, kidGender, kidNotes, kidPicture,clientId,allergyDescription,disabilityDescription, medicationDescription) VALUES (?,?,?,?,?,?,?,?,?)";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("insert statement for adding new kid to newClient succeeded");
                console.log(res);

                d.resolve(res.insertId);

                //TO:DO - Insert Kid in client array

            };
            dbService.executeStatement(query, [params.kidName, params.kidBirthdate, params.kidGender, params.kidNotes, params.kidPicture, params.clientId, params.allergyDescription, params.disabilityDescription, params.medicationDescription], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },
        
        // Update "kid" info
        editKidInfo: function (kidInfo) {

            var d = $q.defer();
            var id = kidInfo.kidId;
            var query = 'UPDATE kids SET kidName = ?, kidBirthdate = ?, kidGender = ?, kidNotes = ?, kidPicture = ?,  allergyDescription = ?,disabilityDescription = ?, medicationDescription = ? WHERE kidId=?';
            
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("update statement for updating a kid succeeded");
                console.log(res);

                d.resolve(res);
            };
            dbService.executeStatement(query, [kidInfo.kidName , kidInfo.kidBirthdate, kidInfo.kidGender, kidInfo.kidNotes, kidInfo.kidPicture,  kidInfo.allergyDescription,kidInfo.disabilityDescription, kidInfo.medicationDescription, id], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        //Delete "kid"    
        deleteKid: function (kidId) {

            var d = $q.defer();

            var query = "DELETE FROM kids where kidId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("delete kid succeeded");
                console.log(res);
                //tasks = $filter('filter')(tasks, {taskId: '!taskId'})    

                d.resolve(res);
            };

            dbService.executeStatement(query, [kidId], querySuccessCallback, queryErrorCallback);
            return d.promise;
        },
		
		//Delete kid for "client"    
        deleteKidsForClient: function (clientId) {

            var d = $q.defer();

            var query = "DELETE FROM kids where clientId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("delete client succeeded");
                console.log(res);
                //tasks = $filter('filter')(tasks, {taskId: '!taskId'})  
                d.resolve(res);
            };

            dbService.executeStatement(query, [clientId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        //// ********************* Parents  ********************* ////

        getParentById: function (parentId) {

            var d = $q.defer();

            var query = "SELECT * FROM parents WHERE parentId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log(res.rows.item(0));
                
                var parent = res.rows.item(0);
                d.resolve(parent);
            };

            dbService.executeStatement(query, [parentId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        getParentsForClient: function (clientId) {

            var d = $q.defer();
            var query = "SELECT * FROM parents p WHERE p.clientId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("select statement for parents of single client succeeded");
                console.log("parents count " + res.rows.length);
                console.log(res);

                var parentList = [];

                for (var k = 0; k < res.rows.length; k++) {
                    parentList.push(res.rows.item(k));
                }

                d.resolve(parentList);
            };

            dbService.executeStatement(query, [clientId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        addParentForClient: function (params) {

			var d = $q.defer();

            var query = "INSERT INTO parents (parentName, parentNotes, parentStreet, parentCity, parentState, parentZipcode, parentPrimaryphone, parentSecondaryphone, parentEmailid, clientId,isParentJobAddress,parentStreetJob,parentCityJob,parentStateJob,parentZipcodeJob) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("insert statement for adding parent to newClient succeeded");
                console.log(res);

                d.resolve(res.insertId);
            };

            dbService.executeStatement(query, [params.parentName, params.parentNotes, params.parentStreet, params.parentCity, params.parentState, params.parentZipcode, params.parentPrimaryphone, params.parentSecondaryphone, params.parentEmailid, params.clientId,params.isParentJobAddress,params.parentStreetJob,params.parentCityJob,params.parentStateJob,params.parentZipcodeJob], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        // Update "parent" info
        editParentInfo: function (parentInfo) {

            var d = $q.defer();
            var id = parentInfo.parentId;
            var query = 'UPDATE parents SET parentName = ?, parentNotes = ?, parentStreet = ?, parentCity = ?, parentState = ?, parentZipcode = ?, parentPrimaryphone = ?, parentSecondaryphone = ?, parentEmailid = ?, clientId = ?, isParentJobAddress = ? ,parentStreetJob = ?,parentCityJob = ?,parentStateJob = ?,parentZipcodeJob = ? WHERE parentId=?';
            
            var queryErrorCallback = function (err) {
                console.log(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("update statement for updating a parent succeeded");
                console.log(res);

                d.resolve(res);
            };
            dbService.executeStatement(query, [parentInfo.parentName, parentInfo.parentNotes, parentInfo.parentStreet,  parentInfo.parentCity, parentInfo.parentState, parentInfo.parentZipcode, parentInfo.parentPrimaryphone, parentInfo.parentSecondaryphone, parentInfo.parentEmailid, parentInfo.clientId,parentInfo.isParentJobAddress,parentInfo.parentStreetJob,parentInfo.parentCityJob,parentInfo.parentStateJob,parentInfo.parentZipcodeJob ,id], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },
        //Delete "parent"    
        deleteParent: function (parentId) {

            var d = $q.defer();

            var query = "DELETE FROM parents where parentId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("delete parent succeeded");
                console.log(res);
                d.resolve(res);
                //tasks = $filter('filter')(tasks, {taskId: '!taskId'})        
            };

            dbService.executeStatement(query, [parentId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },
		
		//Delete parent for "client"    
        deleteParentsForClient: function (clientId) {

            var d = $q.defer();

            var query = "DELETE FROM parents where clientId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("delete parents for client succeeded");
                console.log(res);
                //tasks = $filter('filter')(tasks, {taskId: '!taskId'})  
                d.resolve(res);
            };

            dbService.executeStatement(query, [clientId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        },

        //// ********************* Tasks  ********************* ////

        getTasksForClient: function (clientId) {

            var d = $q.defer();

            var query = "SELECT * FROM tasks t WHERE t.clientId = ?";
            var queryErrorCallback = function (err) {
                console.error(err);
                d.resolve(err);
            }
            var querySuccessCallback = function (tx, res) {
                console.log("select statement for tasks of single client succeeded");
                console.log("tasks count " + res.rows.length);
                console.log(res);

                var taskList = [];

                for (var k = 0; k < res.rows.length; k++) {
                    taskList.push(res.rows.item(k));
                }

                d.resolve(taskList);

                //            selectedClient.tasks = [];
                //            for (var n = 0; n < res.rows.length; n++) {
                //                selectedClient.tasks.push(res.rows.item(n));
                //            }
                //console.log(selectedClient.tasks);
            };
            dbService.executeStatement(query, [clientId], querySuccessCallback, queryErrorCallback);

            return d.promise;
        }
    }
}]);