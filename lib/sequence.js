/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



/**
 * KarmiaDatabaseAdapterMemorySequence
 *
 * @class
 */
class KarmiaDatabaseAdapterMemorySequence {
    /**
     * Constructor
     *
     * @param {Object} connection
     * @param {string} key
     * @param {Object} options
     * @constructs KarmiaDatabaseAdapterMemorySequence
     */
    constructor(connection, key, options) {
        const self = this;
        self.config = options || {};

        self.connection = connection;
        self.key = key;

        self.name = self.config.name || 'sequence';
    }

    /**
     * Get storage
     *
     * @param {Function} callback
     */
    model(callback) {
        const self = this;
        self.table = self.table || {};

        return (callback) ? callback(null, self.table) : Promise.resolve(self.table);
    }

    /**
     * Get sequence value
     *
     * @param {Object} options
     * @param {Function} callback
     */
    get(options, callback) {
        if (options instanceof Function) {
            callback = options;
        }

        const self = this;
        self.table = self.table || {};
        self.table[self.key] = (self.table[self.key] || 0) + 1;

        return (callback) ? callback(null, self.table[self.key]) : Promise.resolve(self.table[self.key]);
    }
}


// Export module
module.exports = function (connection, key, options) {
    return new KarmiaDatabaseAdapterMemorySequence(connection, key, options || {});
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
