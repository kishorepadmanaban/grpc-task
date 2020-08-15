var PROTO_PATH = './age.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(PROTO_PATH,{
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
 });
var agePackage = grpc.loadPackageDefinition(packageDefinition).agePackage;
const express = require('express')
const app = express()
const port = 3000
function main() {
  var client = new agePackage.Age('grpc-server:8080', grpc.credentials.createInsecure());
  
  app.get ("/", function (req,res) {
    res.render ( "age.ejs" );	
  } );
  
  app.get('/get_age', function (req, res) {
    let date = {
      year: parseInt(req.query.year, 10),
      month: parseInt(req.query.month, 10)
    };
    client.getAge(date, function(err, response) {
      if(err){
        console.log(err)
      }
      res.send(response);
    });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
main();