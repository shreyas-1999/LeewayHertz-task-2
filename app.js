var express = require("express"),
    bodyParser = require("body-parser"),
	mongoose = require("mongoose");
var app = express();


mongoose.connect("mongodb://localhost/task_1");
var userSchema = new mongoose.Schema({
	"_Id": Object,
	firstName: String,
	lastName: String,
	email : String,
	password: String
});

var User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
	res.render("landing.ejs");
});

app.get('/users', function (req, res) {
	User.find({}, function(err,allUsers){
		if(err){
			console.log(err);
		} else {
			res.render("index",{users:allUsers});
		}
	});
});

app.post("/users", function(req, res){
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var password = req.body.password;
	var passCheck = req.body.passCheck;
	var newUser = {firstName: firstName, lastName: lastName, email: email, password: password};
	if(passCheck == password){
		User.create(newUser, function(err,newEntry){
			if(err){
				console.log(err);
			} else {
				console.log("Newly created user:");
				console.log(newEntry);
				res.redirect("/users");
			}
		});
	} else {
		res.send("Error: Password and confirm password do not match");
	}
});

app.get("/users/new", function(req,res){
	res.render("home.ejs");
});

app.get("/users/update/:id", function(req,res){
	//find campground with provided ID
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			res.render("update", {user: foundUser});
		}
	});
});

app.post("/userUpdate/:id", function(req, res){
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var password = req.body.password;
	var passCheck = req.body.passCheck;
	var updatedUser = {firstName: firstName, lastName: lastName, password: password};
	if(passCheck == password){
		User.findByIdAndUpdate(req.params.id, updatedUser, function(err,newEntry){
			if(err){
				console.log(err);
			} else {
				console.log("Updated user:");
				console.log(newEntry);
				res.redirect("/users");
			}
		});
	} else {
		res.send("Error: Password and confirm password do not match");
	}
});

app.get("/users/delete/:id", function(req,res){
	//find campground with provided ID
	User.findByIdAndRemove(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		} else {
			//render update template for that User
			console.log("deleted user: "+foundUser.firstName+foundUser.lastName);
			res.redirect("/users");
		}
	});
});

app.listen(3000, function(){
	console.log("Server is listening on port: 3000")
}); 