/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
const converter = require('./converter'),
    table = require('./table'),
    sequence = require('./sequence'),
    suite = require('./suite');


/**
 * KarmiaDatabaseAdapterMemory
 *
 * @class
 */
class KarmiaDatabaseAdapterMemory {
    /**
     * Constructor
     *
     * @param {Object} options
     * @constructs KarmiaDatabaseAdapterMemory
     */
    constructor(options) {
        const self = this;
        self.config = options || {};
        self.converters = converter(self.config.converter || {});
    }

    /**
     * Get connection
     *
     * @returns {Object}
     */
    getConnection() {
        const self = this;

        return self.connection;
    }

    /**
     * Connect to database
     *
     * @param   {Function} callback
     */
    connect(callback) {
        const self = this;
        if (self.connection) {
            return (callback) ? callback() : Promise.resolve();
        }

        self.connection = {};

        return (callback) ? callback() : Promise.resolve();
    }

    /**
     * Disconnect from database
     *
     * @param {Function} callback
     */
    disconnect(callback) {
        const self = this;
        self.connection = {};

        return (callback) ? callback() : Promise.resolve();
    }

    /**
     * Define schemas
     *
     * @param   {string} name
     * @param   {Object} schema
     * @returns {Object}
     */
    define(name, schema) {
        const self = this;
        self.schemas = self.schemas || {};
        self.schemas[name] = schema;

        return self;
    }

    /**
     * Configure
     *
     * @param callback
     */
    sync(callback) {
        const self = this;
        self.tables = self.tables || {};

        return (self.connection ? Promise.resolve() : self.connect()).then(function () {
            self.connection.schemas = self.connection.schemas || {};
            self.connection.models = self.connection.models || {};
            Object.keys(self.schemas).forEach(function (key) {
                if (self.tables[key]) {
                    return;
                }

                const validation = self.converters.validator.convert(self.schemas[key]);

                self.connection.schemas[key] = self.converters.schema.convert(self.schemas[key]);
                self.connection.models[key] = table(self.connection, [], validation);
                self.tables[key] = self.connection.models[key];
            });

            return (callback) ? callback() : Promise.resolve();
        });
    }

    /**
     * Get table
     *
     * @param   {string} name
     * @returns {Object}
     */
    table(name) {
        const self = this;
        self.table = self.table || {};

        return self.tables[name];
    }

    /**
     * Get sequence
     *
     * @param   {string} key
     * @param   {Object} options
     * @returns {Object}
     */
    sequence(key, options) {
        const self = this;
        self.sequence = self.sequence || {};
        self.sequence[key] = self.sequence[key] || sequence(self.connection, key, options);

        return self.sequence[key];
    }

    /**
     * Get table suite
     *
     * @param   {string} name
     * @param   {Array} tables
     * @param   {number|string} id
     * @returns {Object}
     */
    suite(name, tables, id) {
        const self = this;

        return suite(self, name, tables, id);
    }
}


// Export module
module.exports = function (options) {
    return new KarmiaDatabaseAdapterMemory(options || {});
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

