const express		= require('express'),
	apk 			= express(),
	bodyParser		= require('body-parser'),
	methodOveride	= require('method-override'),
	flash 			= require('connect-flash');

	var Courses = [
		{
			id: "CSE1003",
			name: "Digital Logic and Design",
			content: `Expected Course Outcome:<br>
			1. Comprehend the different types of number system.<br>
			2. Evaluate and simplify logic functions using Boolean Algebra and K-map.<br>
			3. Design minimal combinational logic circuits.<br>
			4. Analyze the operation of medium complexity standard combinational circuits like the encoder, decoder, multiplexer, demultiplexer.<br>
			5. Analyze and Design the Basic Sequential Logic Circuits<br>
			6. Outline the construction of Basic Arithmetic and Logic Circuits<br>
			7. Acquire design thinking capability, ability to design a component with realistic constraints, to solve real world engineering problems and analyze the results.<br>`
		},
		{
			id: "CSE1004",
			name: "Network and Communication",
			content: `Expected Course Outcome:<br>
			1. Interpret the different building blocks of Communication network and its architecture.<br>
			2. Contrast different types of switching networks and analyze the performance of network<br>
			3. Identify and analyze error and flow control mechanisms in data link layer<br>
			4. Design subnetting and analyze the performance of network layer<br>
			5. Construct and examine various routing protocols<br>
			6. Compare various congestion control mechanisms and identify appropriate Transport layer	protocol for real time applications<br>
			7. Identify the suitable Application layer protocols for specific applications and its respective security mechanisms<br>`
		},
		{
			id: "	CSE1007",
			name: "Java Programming",
			content: `Expected Course Outcome:<br>
			1. Comprehend Java Virtual Machine architecture and Java Programming Fundamentals.<br>
			2. Design applications involving Object Oriented Programming concepts such as inheritance, association, aggregation, composition, polymorphism, abstract classes and interfaces.<br>
			3. Design and build multi-threaded Java Applications.<br>
			4. Build software using concepts such as files, collection frameworks and containers.<br>
			5. Design and implement Java Applications for real world problems involving Database Connectivity.<br>
			6. Design Graphical User Interface using JavaFX.<br>
			7. Design, Develop and Deploy dynamic web applications using Servlets and Java Server Pages.<br>`
		}
	]

	var StudentInfo = [
		["Student1", "password1"],
		["Student2", "password2"],
		["Student3", "password3"]
	];


	var FacultyInfo = [
		["Faculty1", "password1"],
		["Faculty2", "password2"],
		["Faculty3", "password3"]
	];

apk.set("view engine", "ejs");
apk.use(bodyParser.urlencoded({extended: true}));
apk.use(express.static(__dirname+"/public"));

apk.use(require("express-session")({
	secret:"This is a sectert code",
	resave:false,
	saveUninitialized:false
}));
apk.use(flash());
apk.use((request,respond,next)=>{
	respond.locals.currentUser = "";
	respond.locals.isFac = false;
	respond.locals.error = request.flash("error");
	respond.locals.success =request.flash("success");
	next();
});

var auth= false;
var isFac= false;
var currentUser = {};
apk.get("/",function(request,respond){
	if(!auth)
		respond.render("landing");
	else{
		respond.render("course/index",{ list:Courses, currentUser:currentUser});
	}
});

apk.get("/studentLogin",function(request,respond){
	respond.render("loginS");
});
apk.get("/facultyLogin",function(request,respond){
	respond.render("loginF");
});

apk.get("/studentSignup",function(request,respond){
	respond.render("registerS");
});
apk.get("/facultySignup",function(request,respond){
	respond.render("registerF");
});
apk.get("/logout",function(request,respond){
	auth = false;
	isFac = false;
	currentUser = "";
	respond.redirect("/");
});


apk.post("/studentSignup",function(request,respond){
	var userName = request.body.username;
	var password = request.body.password;
	var found = false;
	StudentInfo.forEach(function(i){
		if(i[0]===userName){
			request.flash("error","User alrady exists!");
			found = true;
			return respond.redirect("studentLogin");
		}
	});
	if(!found){
		let tempInfo = [];
		tempInfo.push(userName);
		tempInfo.push(password);
		StudentInfo.push(tempInfo);
		request.flash("success","You Have created a account");
	 	auth = true;
		isFac = false;
		currentUser.username = userName;
		currentUser.isFac = false;
		respond.redirect("/");
	}
});
apk.post("/studentLogin",function(request,respond){
	var userName = request.body.username;
	var password = request.body.password;
	var found = false;
	StudentInfo.forEach(function(i){
		if(i[0]===userName){
			found = true;
			if(i[1]==password){
				request.flash("success","Login Successfull!");
				auth = true
				isFac = false;
				currentUser.username = userName;
				currentUser.isFac = false;
				return respond.redirect("/");
			}else {
				request.flash("error","Wrong username or password!");
				return respond.redirect("studentLogin");
			}
		}
	});
	if(!found){
		request.flash("error","Wrong username or password!");
	 	auth = false;
		respond.redirect("studentLogin");
	}
});

apk.post("/facultySignup",function(request,respond){
	var userName = request.body.username;
	var password = request.body.password;
	var found = false;
	FacultyInfo.forEach(function(i){
		if(i[0]===userName){
			request.flash("error","User alrady exists!");
			found = true;
			return respond.redirect("facultyLogin");
		}
	});
	if(!found){
		let tempInfo = [];
		tempInfo.push(userName);
		tempInfo.push(password);
		FacultyInfo.push(tempInfo);
		request.flash("success","You Have created a account");
	 	auth = true;
		isFac = true;
		currentUser.username = userName;
		currentUser.isFac = true;
		respond.redirect("/");
	}
});
apk.post("/facultyLogin",function(request,respond){
	var userName = request.body.username;
	var password = request.body.password;
	var found = false;
	FacultyInfo.forEach(function(i){
		if(i[0]===userName){
			found = true;
			if(i[1]==password){
				request.flash("success","Login Successfull!");
				auth = true;
				isFac = true;
				currentUser.username = userName;
				currentUser.isFac = true;
				return respond.redirect("/");
			}else {
				request.flash("error","Wrong username or password!");
				return respond.redirect("facultyLogin");
			}
		}
	});
	if(!found){
		request.flash("error","Wrong username or password!");
	 	auth = false;
		respond.redirect("facultyLogin");
	}
});

apk.get("/course/:courseId",(request,respond)=>{
	var courseId = request.params.courseId;
	var found = false;
	Courses.forEach(function(i){
		if(i.id===courseId){
			found = true;
			respond.render("course/show",{ course:i, currentUser:currentUser});
		}
	});
	if(!found){
		request.flash("error","Course not found!");
		respond.redirect("/");
	}
});

apk.get("/new",(request,respond)=>{
	respond.render("course/new",{ currentUser:currentUser});
});
apk.post("/new",(request,respond)=>{
	var cName = request.body.cName;
	var cID = request.body.cID;
	var cContent = request.body.cContent;
	var tempCourse ={};
	tempCourse.name=cName;
	tempCourse.id=cID;
	tempCourse.content = cContent;
	Courses.push(tempCourse);
	request.flash("success","Course Content added Successfully!");
	respond.redirect("/");
});

apk.get("*",(request,respond)=>{
	respond.send("Use a Valid Url");
});
apk.listen(3000,()=>{
	console.log("Server running at port 3000");
});
