const logging = require('@tryghost/logging');
const tpl = require('@tryghost/tpl');

const _ = require('lodash');

const messages = {
    invalidAttribute: 'Invalid or no attribute given to has_tag_starting_with helper'
};

module.exports = function hasTagStartingWith(...attrs) {
    if (_.isEmpty(attrs)) {
        logging.warn(tpl(messages.invalidAttribute));
        return;
    }

    if (!_.isArray(this.tags)) {
        logging.warn(tpl(messages.invalidAttribute));
        return;
    }

    const [word, options] = attrs;

    if (typeof word !== 'string') {
        logging.warn(tpl(messages.invalidAttribute));
        return;
    }

    const isBlock = _.has(options, 'fn');

    const result = this.tags.some(tag => tag.name.startsWith(word));

    // If we're in block mode, return the outcome from the fn/inverse functions
    if (isBlock) {
        if (result) {
            return options.fn(this);
        }
    
        return options.inverse(this);
    }

    // So it can be used together with {{#if}}
    return result;
};
