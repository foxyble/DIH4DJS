"use strict";

/**
 * Logger interface
 */
class DIH4DJSLogger {
    format = "";

    /**
     * Set a custom format for the logger
     * @param {string} format The format to follow
     * @private
     */
    setFormat(format) {
        this.format = format;
    }

    /**
     * @param {string} message The message to log
     */
    static info(message) { }
}