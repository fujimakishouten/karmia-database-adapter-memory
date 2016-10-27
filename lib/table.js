/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
const jsonschema = require('jsonschema');

/**
 * Test value
 *
 * @param {Object} conditions
 * @param {Object} value
 * @returns {boolean}
 */
function test(conditions, value) {
    return Object.keys(conditions || {}).reduce(function (result, key) {
        if (!result) {
            return result;
        }

        if (Array.isArray(conditions[key])) {
            return (-1 < conditions[key].indexOf(value[key]));
        }

        if (Array.isArray(conditions[key].$in)) {
            return (-1 < conditions[key].$in.indexOf(value[key]));
        }

        return (conditions[key] === value[key]);
    }, true);
}


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
        const self = this;
        if (conditions instanceof Function) {
            callback = conditions;
            conditions = {};
        }

        const result = self.model.filter(function (element) {
            return test(conditions, element);
        }).length;

        return (callback) ? callback(null, result) : Promise.resolve(result);
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
            keys = self.key.reduce(function (collection, key) {
                collection[key] = data[key];

                return collection;
            }, {}),
            index = self.model.findIndex(function (element) {
                return test(keys, element);
            });

        if (0 > index) {
            self.model.push(data);
        } else {
            data = Object.assign(self.model[index], data);
            self.model[index] = data;
        }

        return (callback) ? callback(null, data) : Promise.resolve(data);
    }

    /**
     * Find item
     *
     * @param   {Object} conditions
     * @param   {Object} options
     * @param   {Function} callback
     */
    get(conditions, options, callback) {
        conditions = conditions || {};
        options = options || {};
        if (conditions instanceof Function) {
            callback = conditions;
            conditions = {};
            options = {};
        }

        if (options instanceof Function) {
            callback = options;
        }

        if (!Object.keys(conditions).length) {
            return (callback) ? callback(null, null) : Promise.resolve(null);
        }

        const self = this,
            result = self.model.find(function (element) {
                return test(conditions, element);
            });

        return (callback) ? callback(null, result || null) : Promise.resolve(result || null);
    }

    /**
     * Find items
     *
     * @param   {Object} conditions
     * @param   {Object} options
     * @param   {Function} callback
     */
    find(conditions, options, callback) {
        conditions = conditions || {};
        options = options || {};
        if (conditions instanceof Function) {
            callback = conditions;
            conditions = {};
            options = {};
        }

        if (options instanceof Function) {
            callback = options;
        }

        const self = this,
            result = self.model.filter(function (element) {
                return test(conditions, element);
            });

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
        conditions = conditions || {};
        options = options || {};
        if (conditions instanceof Function) {
            callback = conditions;
            conditions = {};
            options = {};
        }

        if (options instanceof Function) {
            callback = options;
        }

        const self = this;
        self.model = self.model.filter(function (element) {
            return !test(conditions, element);
        });

        return (callback) ? callback() : Promise.resolve();
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

