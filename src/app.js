var login = require("facebook-chat-api");
var ezlogger = require("ezlogger")();
var config = require("config");

var spawn = require('child_process').spawn;
var bash = spawn('bash');

login({email: config.get("email"), password: config.get("password")}, function callback (err, api) {
  if (err) return console.error(err);

  api.getFriendsList(function (err, data) {
    if (err) return console.error(err);

    var me = data[0].userID;

    bash.stdout.on('data', function (data) {
      console.log(data.toString());
      api.sendMessage(data.toString(), me);
    });

    bash.stderr.on('data', function (data) {
      console.error(data.toString());
      api.sendMessage("stderr: " + data.toString(), me);
    });

    bash.stdin.setEncoding('utf-8');

    api.listen(function callback (err, message) {
      if(me == message.threadID) {
        bash.stdin.write(message.body + "\n");
      }
    });
  });
});

console.log("fb-chat-ssh started his duty.");
