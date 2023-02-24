const { DIH4DJSLogger } = require('../lib');

class TestLogger extends DIH4DJSLogger {
    constructor() {
        setFormat("[something]");
    }

    info(message) {

    }
}