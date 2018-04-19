//USES CODE FROM https://backendless.com/docs/js/doc.html#dynanchor1

$(document).on("pageinit","#main",accountInit);
$(document).on("pageshow","#leaderboard",loadLeaderboard);
$(document).on("click","#login",loginUser);
$(document).on("click","#logout",logoutUser);
$(document).on("click","#register",registerScreen);
$(document).on("click","#registerConfirm",registerUser);
$(document).on("click","#cancelRegister",function(){
    checkUser(null);
});
var user;

function accountInit(){
    /*
    var userToken =Backendless.LocalCache.get("current-user-id");
    if(userToken != null){
        console.log("User Logged In with ID: "+userToken);
        var userObject = Backendless.UserService.getCurrentUser();
        console.log(userObject);
        console.log(user);
    }else{
        console.log("User not logged in");
        
    }*/
    
    Backendless.UserService.getCurrentUser().then(checkUser).catch(error);
    
}

function registerUser(){
    var name = $("#name").val();
    var email = $("#email").val();
    var pass = $("#password").val();
    
    var newUser = new Backendless.User();
    newUser.email=email;
    newUser.password=pass;
    newUser.name=name;
    
    Backendless.UserService.register(newUser).then(registered).catch(error);
}

function loginUser(){
    var email = $("#email").val();
    var pass = $("#password").val();
    
    Backendless.UserService.login(email,pass,true).then(loggedIn).catch(error);
    
}

function logoutUser(){
    Backendless.UserService.logout().then(loggedOut).catch(error); 
}

function loggedIn(account){
    user= account;
    console.log("User logged in");
    console.log(user);
    //ADD PROFILE PAGE
    $('#accountDiv').empty();
    $('#accountDiv').append("<span><div id='points'>"+user.points+"<a class='ui-btn ui-shadow ui-corner-all ui-icon-star ui-btn-icon-notext ui-btn-b ui-btn-inline'></a></div>");
    $('#accountDiv').append("<div id='sidePoints'><h4>Welcome back "+user.name+"</h4><button id='logout' class='ui-btn ui-btn-inline'>Log out</button></div></span>");
    $('#accountDiv').trigger("create");
}

function loggedOut(){
    console.log("User logged out");
    checkUser(null);
}

function registered(){
    console.log("New User Registered");
    loginUser();
    
}

function checkUser(account){
    if(account==null){
        console.log("User not logged in");
        //ADD LOGIN/REGISTER OPTIONS
        $('#accountDiv').empty();
        $('#accountDiv').append("<h3 style='text-align: center; margin: 0px;'>Welcome</h3><p>Please log in to access all the features.</p>");
        $('#accountDiv').append("<label for='email'>Email:</label><input name='email' id='email' value='' type='text'>");
        $('#accountDiv').append("<label for='password'>Password:</label><input name='password' id='password' value='' type='password'>");                
        $('#accountDiv').append("<button id='login'>Log In</button><p style='text-align: center; margin: 0px;'>OR</p><button id='register'>Register</button>");
        $('#accountDiv').trigger("create");
    }else{
        loggedIn(account);     
    }    
    
}

function registerScreen(){
    var email = $("#email").val();
    var pass = $("#password").val();
    //ADD REGISTER SCREEN
    $('#accountDiv').empty();
    $('#accountDiv').append("<h3 style='text-align: center; margin: 0px;'>Please enter your details</h3>");
    $('#accountDiv').append("<label for='email'>Email*:</label><input name='email' id='email' value='"+email+"' type='text' required>");
    $('#accountDiv').append("<label for='name'>Name:</label><input name='name' id='name' value='' type='text'>");
    $('#accountDiv').append("<label for='password'>Password*:</label><input name='password' id='password' value='"+pass+"' type='password'>");    
    $('#accountDiv').append("<button id='registerConfirm'>Register</button><button id='cancelRegister'>Cancel</button>");
    $('#accountDiv').trigger("create");   
}

function addPoints(pts){
    user.points=user.points+pts;
    Backendless.UserService.update(user).then(userUpdated).catch(error);
}

function userUpdated(){
    console.log("User updated");
}

function loadLeaderboard(){
    
}