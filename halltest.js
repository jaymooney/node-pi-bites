var Gpio = require("onoff").Gpio;

var pins = {}

pins.switch = new Gpio(18, "in", "both");
pins.red = new Gpio(15, "low");
pins.green = new Gpio(14, "low");
pins.hall = new Gpio(4, "in", "both");

var recording = false;
var trips = 0;
var lasttrip;

pins.hall.watch(function(err, value) {
	if (err) throw err;
	if (value) {
	//	pins.green.write(1);
	} else {
if (recording) {
	trips++;
	var now = new Date().getTime();
	var diff = now - lasttrip;
	lasttrip = now;
	var rpm = 60000 / diff;
	console.log("tripped " + trips + " times, " + rpm + "rpm");
}
	//	pins.green.write(0);
	}
});

pins.switch.watch(function(err, value) {
	if (err) throw err;
	if (value) {
console.log("start recording");
pins.red.write(1);
		trips = 0;
		recording = true;
		lastrip = new Date().getTime();
	} else {
console.log("stopped recording");
pins.red.write(0);
		recording = false;
	}
});

function exit() {
	for (var k in pins) {
		pins[k].unexport();
	}
	process.exit();
}

process.on("SIGINT", exit);
