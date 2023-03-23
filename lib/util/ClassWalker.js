/*
 * Copyright 2023 OoP1nk
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const fs = require('node:fs/promises');

/**
 * A class that provides you with the ability to get all classes
 * within a specified directory.
 * TODO: Rework walking to get sub-classes
 * @since v1.3.0
 */
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
     * @returns {Promise<Set>}
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