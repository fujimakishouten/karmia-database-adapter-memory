/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



/**
 * KarmiaDatabaseAdapterMemoryConverterValidator
 *
 * @class
 */
class KarmiaDatabaseAdapterMemoryConverterValidator {
    /**
     * Constructor
     *
     * @constructs KarmiaDatabaseAdapterMemoryConverterValidator
     */
    constructor() {
        const self = this;

        self.convert = KarmiaDatabaseAdapterMemoryConverterValidator.convert;
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
    return new KarmiaDatabaseAdapterMemoryConverterValidator();
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
