const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;

  const data = {
    members : [
      {
        email_address : email,
        status : "subscribed",
        merge_fields : {
          FNAME : firstName,
          LNAME : lastName,
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  //const api_key = "08f1097cbf6a926554d16bd26293e41f-us10";
  //const list_id = "d01a5b0dad";
  const url = "https://us10.api.mailchimp.com/3.0/lists/d01a5b0dad";
  const options = {
    method : "POST",
    auth : "abhijeet:08f1097cbf6a926554d16bd26293e41f-us1"
  };
  const request = https.request(url,options,function(response){
    var statusCode = response.statusCode;
    if(statusCode=='200'){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("Server started");
});

//API Key
//
