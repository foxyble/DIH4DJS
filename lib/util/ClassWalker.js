'use strict';

const fs = require('node:fs/promises');

class ClassWalker {
    #packageName;

    /**
     * 
     * @param {string} pkg the package you want to perform operations on.
     */
    constructor(pkg) {
        this.#packageName = pkg;
    }

    /**
     * Gets all classes within a base directory.
     * @returns {Promise<Set<class>>}
     */
    async getAllClasses() {
        const classes = new Set();
        const basePath = path.join(getRootPath(), this.#packageName);
        for (const file of await fs.readdir(basePath)) {
            const filePath = path.join(basePath, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) this.registerCommandsAndOrComponenets(path.join(pkg, file));
            if (file.endsWith('.js') || file.endsWith('.ts'))
                classes.add(await import('file://' + filePath))
        }
        return classes;
    }
}

module.exports = ClassWalker;