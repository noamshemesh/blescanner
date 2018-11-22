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
    client.publish('location/brian', 'home')
    console.log('Brian is home')
  } else {
    client.publish('location/brian', 'not_home')
    console.log('Brian is away')
  }
}, 10000)
