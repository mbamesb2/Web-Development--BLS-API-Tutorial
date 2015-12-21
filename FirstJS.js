
var APIKey = '1130327d6b22446da4a3da5a35dae238';
var payload = 'LAUCN281070000000003';
  

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);


app.get('/',function(req,res,next){
  var context = {};
  request('http://api.bls.gov/publicAPI/v2/timeseries/data/' + payload, function(err, response, body){
    if(!err && response.statusCode < 400){
      context.body = body;
      var params = [];
      for (var i in body.Results.series[0].data) {
        params.push({'year':body.Results.series[0].data[i].year, 'periodName':body.Results.series[0].data[i].periodName, 'value': body.Results.series[0].data[i].value});
      }
      context.dataList = params;
      res.render('home',context);
    } else {
      console.log(err);
      if(response){
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

