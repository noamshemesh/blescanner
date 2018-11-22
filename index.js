var Bleacon = require('bleacon');
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1883')
var lastTime = new Date()

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      Bleacon.startScanning();
      Bleacon.on('discover', function(event) {
        if (event.uuid === 'beaconuuid') {
          lastTime = new Date()
        }
      });
    }
  })
})

setInterval(function () {  
  if ((new Date() - lastTime) <= 30000) {
    client.publish('localtion/brian', 'home')
    console.log('Brian is home')
  } else {
    client.publish('localtion/brian', 'not_home')
    console.log('Brian is away')
  }
}, 10000)
