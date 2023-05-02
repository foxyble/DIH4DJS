const path = require("path");
const getDataPath = (d = require.main.filename) => {
    return path.dirname(d);
}

module.exports = {
    getDataPath
}