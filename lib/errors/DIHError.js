"use strict";

class DIHError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = DIHError;