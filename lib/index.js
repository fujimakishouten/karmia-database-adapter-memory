/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
const karmia_storage_adapter_memory = require('karmia-storage-adapter-memory'),
    converter = require('./converter'),
    sequence = require('./sequence'),
    suite = require('./suite'),
    table = require('./table');


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
     * @param {Object} connection
     * @constructs KarmiaDatabaseAdapterMemory
     */
    constructor(options, connection) {
        const self = this;
        self.config = options || {};

        self.converters = converter(self.config.converter || {});

        if (connection) {
            self.connection = connection;
        }
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
        self.connection = self.connection || self;

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
        const self = this,
            options = self.config.storage || self.config;
        self.tables = self.tables || {};

        return (self.connection ? Promise.resolve() : self.connect()).then(function () {
            self.connection.schemas = self.connection.schemas || {};
            self.connection.models = self.connection.models || {};
            Object.keys(self.schemas).forEach(function (key) {
                if (self.tables[key]) {
                    return;
                }

                const validation = self.converters.validator.convert(self.schemas[key]),
                    storage = karmia_storage_adapter_memory(self.config);

                self.connection.schemas[key] = self.converters.schema.convert(self.schemas[key]);
                self.connection.models[key] = table(self.connection, storage.storage(key, options), validation);
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
module.exports = function (options, connection) {
    return new KarmiaDatabaseAdapterMemory(options || {}, connection);
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

