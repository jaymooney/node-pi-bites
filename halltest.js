var Gpio = require("onoff").Gpio;

var pins = {}

pins.switch = new Gpio(25, "in", "both");
pins.red = new Gpio(18, "high");
pins.green = new Gpio(22, "high");
pins.blue = new Gpio(23, "high");
pins.hall = new Gpio(24, "in", "both");

var recording = false;
var trips = 0;

pins.hall.watch(function(err, value) {
	if (err) throw err;
	if (value) {
		pins.green.write(1);
		pins.blue.write(0);
	} else {
if (recording) {
	trips++;
	console.log("tripped " + trips + " times");
}
		pins.green.write(0);
		pins.blue.write(1);
	}
});

pins.switch.watch(function(err, value) {
	if (err) throw err;
	if (value) {
console.log("start recording");
		trips = 0;
		recording = true;
	} else {
console.log("stopped recording");
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
