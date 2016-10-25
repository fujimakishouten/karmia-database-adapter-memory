/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



/**
 * KarmiaDatabaseAdapterMemoryConverterSchema
 *
 * @class
 */
class KarmiaDatabaseAdapterMemoryConverterSchema {
    /**
     * Constructor
     *
     * @constructs KarmiaDatabaseAdapterMemoryConverterSchema
     */
    constructor() {
        const self = this;

        self.convert = KarmiaDatabaseAdapterMemoryConverterSchema.convert;
    }

    /**
     * Convert schema
     *
     * @param   {Object} schemas
     * @returns {Object}
     */
    static convert(schemas) {
        return schemas;
    }
}


// Export module
module.exports = function () {
    return new KarmiaDatabaseAdapterMemoryConverterSchema();
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
