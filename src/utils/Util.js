'use strict';

const path = require("node:path");

function getRootPath() {
    const main = path.resolve(__dirname);
    if (main !== undefined && main.includes("node_modules")) {
        return main.split("/node_modules")[0]
    } else {
        return path.dirname(require.main.filename);
    }
}

module.exports = {
    getRootPath
}