var https = require('https');
var config = require('./config.json');
var Q = require('q');
var request = require('request');
var querystring = require('querystring');
xml2js = require('xml2js');

module.exports = function ncapi(command, args) {
  var deferred = Q.defer();
  if(args === undefined) {
    args = {};
  }
  args.ApiUser = config.user;
  args.ApiKey = config.apikey;
  if(args.UserName === undefined) {
    args.UserName = config.user;
  }
  if(args.ClientIP === undefined) {
    args.ClientIP = "127.0.0.1";
  }
  args.Command = command;

  var URL = "https://" + config.domain + "/xml.response?" + querystring.stringify(args);

  var parser = new xml2js.Parser();
  request(URL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parser.parseString(body, function (err, result) {
          deferred.resolve(result);
      });
    }
  });
  return deferred.promise;
};
