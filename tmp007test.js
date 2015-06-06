var TMP007 = {
	I2CADDR: 0x40,
	DEVID: 0x1F,
	VOBJ: 0x00,
	TDIE: 0x01,
	CONFIG: 0x02,
	TOBJ: 0x03,
	STATUS: 0x04,
	STATMASK: 0x05,

	CFG_RESET: 0x8000,
	CFG_MODEON: 0x1000,
	CFG_1SAMPLE: 0x0000,
	CFG_2SAMPLE: 0x0200,
	CFG_4SAMPLE: 0x0400,
	CFG_8SAMPLE: 0x0600,
	CFG_16SAMPLE: 0x0800,
	CFG_ALERTEN: 0x0100,
	CFG_ALERTF: 0x0080,
	CFG_TRANSC: 0x0040,

	STAT_ALERTEN: 0x8000,
	STAT_CRTEN: 0x4000
};

var buf = new Buffer(2);
buf.writeUIntLE(TMP007.CFG_MODEON | TMP007.CFG_TRANSC | TMP007.CFG_8SAMPLE, 0, 2);
var defaultConfig = buf.readUIntBE(0, 2);

buf = new Buffer(2)
buf.writeUIntLE(TMP007.STAT_ALERTEN, TMP007.STAT_CRTEN, 0, 2);
var defaultStat = buf.readUIntBE(0, 2);

var Gpio = require("onoff").Gpio;
var i2c = require("i2c-bus");
var i2c1 = i2c.open(1, setupTMP007);

function setupTMP007(err) {
	if (err) throw err;
	i2c1.writeWord(TMP007.I2CADDR, TMP007.CONFIG, defaultConfig, aok);
	i2c1.writeWord(TMP007.I2CADDR, TMP007.STATMASK, defaultStat, aok);
	setInterval(readTemp, 2000);
}

function readTemp() {
	i2c1.readWord(TMP007.I2CADDR, TMP007.TDIE, function(err, val) {
		if (err) throw err;
		var buf = new Buffer(2);
		buf.writeUIntBE(val, 0, 2);
		var celsius = rawToC(buf.readUIntLE(0, 2));
		var temp = CtoF(celsius);
		console.log("die temp: " + temp + " F");
	});
	i2c1.readWord(TMP007.I2CADDR, TMP007.TOBJ, function(err, val) {
		if (err) throw err;
		var buf = new Buffer(2);
		buf.writeUIntBE(val, 0, 2);
		var celsius = rawToC(buf.readUIntLE(0, 2));
		var temp = CtoF(celsius);
		console.log("obj temp: " + temp + " F");
	});
}

function aok(err) {
	if (err) throw err;
}
function rawToC(raw) {
	console.log(raw);
	return (raw >> 2) * 0.03125;
}

function CtoF(celsius) {
	return celsius * 1.8 + 32;
}

function exit() {
	i2c1.close(process.exit);
}

process.on("SIGINT", exit);
