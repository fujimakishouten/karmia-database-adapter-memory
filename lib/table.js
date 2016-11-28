/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



/**
 * Test value
 *
 * @param {*} conditions
 * @param {Array} value
 * @returns {boolean}
 */
function test(conditions, value) {
    return Object.keys(conditions || {}).reduce(function (result, key) {
        if (!result) {
            return result;
        }

        if (Object.getPrototypeOf(conditions) === Object.prototype) {
            if (Array.isArray(conditions[key])) {
                return (-1 < conditions[key].indexOf(value[key]));
            }

            if (Array.isArray(conditions[key].$in)) {
                return (-1 < conditions[key].$in.indexOf(value[key]));
            }

            return (conditions[key] === value[key]);
        }

        return (conditions === value);
    }, true);
}


// Variables
const jsonschema = require('jsonschema');


/**
 * KarmiaDatabaseAdapterMemoryTable
 *
 * @class
 */
class KarmiaDatabaseAdapterMemoryTable {
    /**
     * Constructor
     *
     * @param {Object} connection
     * @param {Object} model
     * @param {Object} validation
     * @constructs KarmiaDatabaseAdapterMemoryTable
     */
    constructor(connection, model, validation) {
        const self = this;

        self.connection = connection;
        self.model = model;
        self.validation = validation;

        self.key = Array.isArray(validation.key) ? validation.key : [validation.key];
        self.fields = Object.keys(validation.properties);
    }

    /**
     * Validate data
     *
     * @param {Object} data
     * @param {Function} callback
     */
    validate(data, callback) {
        const self = this,
            result = jsonschema.validate(data, self.validation);
        if (result.errors.length) {
            return (callback) ? callback(result.errors) : Promise.reject(result.errors);
        }

        return (callback) ? callback(null, data) : Promise.resolve(data);
    }

    /**
     * Count items
     *
     * @param   {Object} conditions
     * @param   {Function} callback
     */
    count(conditions, callback) {
        if (conditions instanceof Function) {
            callback = conditions;
            conditions = {};
        }

        const self = this;
        conditions = conditions || {};

        return self.find(conditions).then(function (result) {
            return (callback) ? callback(null, result.length) : Promise.resolve(result.length);
        }).catch(function (error) {
            return (callback) ? callback(error) : Promise.reject(error);
        });
    }

    /**
     * Save item
     *
     * @param {Object} data
     * @param {Object} options
     * @param {Function} callback
     */
    set(data, options, callback) {
        options = options || {};
        if (options instanceof Function) {
            callback = options;
        }

        const self = this,
            key = data[self.key[0]];

        return self.model.get(key).then(function (result) {
            const values = Object.assign(result || {}, data);

            return self.model.set(key, values, callback);
        });
    }

    /**
     * Find item
     *
     * @param   {Object} conditions
     * @param   {Object} projection
     * @param   {Object} options
     * @param   {Function} callback
     */
    get(conditions, projection, options, callback) {
        if (conditions instanceof Function) {
            callback = conditions;
            conditions = {};
            projection = {};
            options = {};
        }

        if (projection instanceof Function) {
            callback = projection;
            projection = {};
            options = {};
        }

        if (options instanceof Function) {
            callback = options;
            options = {};
        }

        conditions = conditions || {};
        projection = projection || {};
        options = options || {};

        const self = this,
            keys = Object.keys(projection);
        if (!Object.keys(conditions).length) {
            return (callback) ? callback(null, null) : Promise.resolve(null);
        }

        return self.find(conditions).then(function (items) {
            items = items.map(function (item) {
                if (keys.length && Object.getPrototypeOf(item) === Object.prototype) {
                    return keys.reduce(function (collection, key) {
                        if (key in item) {
                            collection[key] = item[key];
                        }

                        return collection;
                    }, {});
                }

                return item;
            });

            const result = (items.length) ? items[0] : null;

            return (callback) ? callback(null, result) : Promise.resolve(result);
        });
    }

    /**
     * Find items
     *
     * @param   {Object} conditions
     * @param   {Object} projection
     * @param   {Object} options
     * @param   {Function} callback
     */
    find(conditions, projection, options, callback) {
        if (conditions instanceof Function) {
            callback = conditions;
            conditions = {};
            projection = {};
            options = {};
        }

        if (projection instanceof Function) {
            callback = projection;
            projection = {};
            options = {};
        }

        if (options instanceof Function) {
            callback = options;
            options = {};
        }

        conditions = conditions || {};
        projection = projection || {};
        options = options || {};

        const self = this,
            keys = Object.keys(projection),
            is_object = (conditions instanceof Object),
            result = self.model.buffer.reduce(function (collection, data) {
                const value = data.value,
                    condition = !conditions || ((is_object) ? test(conditions, value) : (conditions === value));
                if (!condition) {
                    return collection;
                }

                if (keys.length && Object.getPrototypeOf(value) === Object.prototype) {
                    collection.push(keys.reduce(function (col, key) {
                        if (key in value) {
                            col[key] = value[key];
                        }

                        return col;
                    }, {}));

                    return collection;
                }

                collection.push(value);

                return collection;
            }, []);

        return (callback) ? callback(null, result) : Promise.resolve(result);
    }

    /**
     * Remove item
     *
     * @param   {Object} conditions
     * @param   {Object} options
     * @param   {Function} callback
     */
    remove(conditions, options, callback) {
        if (conditions instanceof Function) {
            callback = conditions;
            conditions = {};
            options = {};
        }

        if (options instanceof Function) {
            callback = options;
        }

        const self = this,
            is_object = (conditions instanceof Object),
            keys = self.model.buffer.reduce(function (collection, data) {
                if (!conditions) {
                    collection.push(data.key);

                    return collection;
                }

                if ((is_object) ? test(conditions, data.value) : (conditions === data.value)) {
                    collection.push(data.key);
                }

                return collection;
            }, []);

        return self.model.remove(keys[0], callback);
    }
}


// Export module
module.exports = function (connection, model, schema) {
    return new KarmiaDatabaseAdapterMemoryTable(connection, model, schema);
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

