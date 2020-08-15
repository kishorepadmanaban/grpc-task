const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("age.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
 });
const grpcObject = grpc.loadPackageDefinition(packageDef);
const agePackage = grpcObject.agePackage;

const server = new grpc.Server();
server.bind("0.0.0.0:8080",
 grpc.ServerCredentials.createInsecure());

server.addService(agePackage.Age.service,
    {
        "getAge": getAge,
    });
server.start();

function getAge (call, callback) {
    let date = call.request
    if(date.month.toString().length === 1){
      date.month = `0${date.month}`
    }
    const request = `${date.month}/01/${date.year}`;
    const response = calcAge(request)
    callback(null, response);
}

function calcAge(dateString) {
  var now = new Date();

  var yearNow = now.getYear();
  var monthNow = now.getMonth();
  var dateNow = now.getDate();
  var dob = new Date(dateString.substring(6,10),
                     dateString.substring(0,2)-1,                   
                     dateString.substring(3,5)                  
                     );

  var yearDob = dob.getYear();
  var monthDob = dob.getMonth();
  var dateDob = dob.getDate();


  yearAge = yearNow - yearDob;

  if (monthNow >= monthDob)
    var monthAge = monthNow - monthDob;
  else {
    yearAge--;
    var monthAge = 12 + monthNow -monthDob;
  }

  if (dateNow >= dateDob)
    var dateAge = dateNow - dateDob;
  else {
    monthAge--;
    var dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }
  const response = {
    "age_years": parseInt(yearAge, 10),
    "age_months": parseInt(monthAge, 10)
  }
  return response;
}
