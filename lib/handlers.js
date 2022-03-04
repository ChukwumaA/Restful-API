/*
 * Request Handlers
*/

//Dependencies
var _data = require('./data');
var helpers = require('./helpers');

//Define the handlers
var handlers = {};

//Users
handlers.users = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    }
    else {
        callback(405);
    }
};

//Container for the users submethods
handlers._users = {};

//Users - post
//Required data: firstName, lastName, phone, password, tosAgreement
//Optional data: none
handlers._users.post = function(data, callback){
    //Check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.password) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement){
        //Make sure tha the user doesn't already exist
        _data.read('users', phone, function(err,_data){
            if(err){
                //Hash the password
                var hashedPassword = helpers.hash(password);

                //Create the user object
                if(hashedPassword){
                    var userObject = { 
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    };
    
                        //Store the user
                        _data.create('users',phone,userObject,function(err){
                            if(!err){
                                callback(200);
                            }else {
                                console.log(err);
                                callback(500, {'Error' : 'Could not create the new user'});
                            }
                        });
                } else {
                    callback(500,{'Error' : 'Could not hash the user\'s password'});
                }
                
            } else{
                //User already exists
                callback(400,{'Error' : 'A user with that phone number already exist'});
            }
        });
    } else{
        callback(400,{'Error' : 'Missing required fields'});
    }
};

//Users - get
handlers._users.get = function(_data, _callback){

};

//Users - put
handlers._users.put = function(_data, _callback){

};

//Users - delete
handlers._users.delete = function(_data, _callback){

};

//Ping handlers
handlers.ping = function(_data,callback){
    callback(200);
};

//Notfound handler
handlers.notFound = function (_data, callback) {
    callback(404);
};

//Export the module
module.exports = handlers