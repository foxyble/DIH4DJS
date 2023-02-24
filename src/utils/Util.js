'use strict';

const path = require("node:path");

function getRootPath() {
    return path.dirname(require.main.filename);
}

module.exports = {
    getRootPath
}