var Gpio = require("onoff").Gpio;

var pins = {}

pins.button = new Gpio(25, "in", "both");
pins.red = new Gpio(18, "high");
pins.green = new Gpio(22, "high");
pins.blue = new Gpio(23, "high");

var color = 0;

pins.button.watch(function(err, value) {
	if (err) throw err;
	if (!value) return;
	color = (color + 1 ) % 3
	console.log("color" + color);
	// really? passing true or false doesn't work
	pins.red.write(color === 0 ? 0 : 1);
	pins.green.write(color === 1 ? 0 : 1);
	pins.blue.write(color === 2 ? 0 : 1);
});

function exit() {
	for (var k in pins) {
		pins[k].unexport();
	}
	process.exit();
}

process.on("SIGINT", exit);
