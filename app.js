console.log("Nodejs running");

var http = require('http');
var express     =    require('express');
var formidable = require('formidable');
var mysql = require('mysql');
var uuid = require('uuid');

var app  = express();
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "messageBox"
});

var response = {
  status  : 200,
  data : 'Updated Successfully'
}

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to SQL DB!");

});

app.get('/',function(req,res){
  res.sendFile("index.html");
});

app.post('/onRegister',function(req,res){

  var form = new formidable.IncomingForm();
  form.parse(req, function(err, values) {

    console.log(values.name);
    var sqlinsert = "INSERT INTO inbox (id, title, message) VALUES (UUID(),'"+values.name+"','"+values.message+"');";

    console.log('>>>>>>>>>'+sqlinsert);
    con.query(sqlinsert, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.redirect("/view");
    });

  });

});

app.get('/ondelete', function(req, res) {
  console.log(req.query.id);
  var deletesql = "delete from inbox where id = '"+req.query.id+"'";

  console.log('>>>>>>>>>'+deletesql);
  con.query(deletesql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted"+result);
    res.redirect("/view");
  })

});

app.get('/update', function(req,res){
  console.log(req.query.name);

  var updatesql= 'UPDATE inbox SET title="'+req.query.name+'",message="'+req.query.message+'" where id="'+req.query.id+'"';
  //var updatesql = "UPDATE inbox SET title='"+req.query.name+"','message ='"+req.query.message+"where id ='"+req.query.id+"'";

  console.log('>>>>>>>>>'+updatesql);
  con.query(updatesql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    res.redirect("/view");
  })

});


app.get('/load',function(req,res){

  con.query("SELECT * FROM inbox", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    return res.send(result);
  });
});

app.get('/view',function(req,res){
  res.sendFile("view.html");
});

app.listen(8080,function(){
  console.log("Working on port 8080");
});
