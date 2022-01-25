const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const https=require("https")
const config=require(__dirname+"/config.js");
//const request=require("request");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


app.get("/",function(req,res){
	res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){

	const fn=req.body.fn;
	const ln=req.body.ln;
	const email=req.body.email;


	const url="https://us5.api.mailchimp.com/3.0/lists/88f97ae0ce"
	const data={
		members:[
			{
				email_address:email,
				status:"subscribed",
				merge_fields:{
					FNAME:fn,
					LNAME:ln
				}
			}
		]
	};
	const jsondata=JSON.stringify(data);
	const options={
		method:"POST",
		auth:config.token
	}
	

	const request=https.request(url,options,function(response){
		if(response.statusCode===200)
			res.sendFile(__dirname+"/success.html");
		else
			res.sendFile(__dirname+"/failure.html");

	});

	request.write(jsondata);
	request.end();
});

app.post("/failure",function(req,res){
	res.redirect("/");
});

app.listen(process.env.PORT||3000 ,function(){
	console.log("Server is running on port 3000");
});


