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
const path = require('node:path');

/**
 * A class that provides you with the ability to get all classes
 * within a specified directory.
 * @since v1.3.0
 */
class ClassWalker {
    packageName;

    /**
     * Creates a new instance that allows you to perform reflective operations for the defined package.
     * @param {string} pkg the package you want to perform operations on.
     */
    constructor(pkg) {
        this.packageName = pkg;
    }

    /**
     * Gets all classes within a base directory.
     * @returns {Promise<Set>}
     */
    async getAllClasses() {
        const basePackage = path.join(path.dirname(require.main.filename), this.packageName);
        return await this._walk(basePackage);
    }

    /**
     * Walks through a specific directory and returns all classes within.
     * @param pkg The package/directory to walk
     * @private
     */
    async _walk(pkg) {
        const subClazzSet = new Set();
        for(const file of await fs.readdir(pkg)) {
            const subPath = path.join(pkg, file);
            const lstatSub = await fs.lstat(subPath);
            if(lstatSub.isDirectory()) await this._walk(subPath);
            if (file.endsWith('.js') || file.endsWith('.ts'))
                subClazzSet.add(require(subPath))
        }
        return subClazzSet;
    }
}

module.exports = ClassWalker;