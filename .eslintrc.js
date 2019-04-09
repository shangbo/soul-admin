/* eslint-env node */
module.exports = {
    root: true,
    plugins: [
        'ghost'
    ],
    extends: [
        'plugin:ghost/ember'
    ],
    rules: {
        "no-console": "off", 
        // disable linting of `this.get` until there's a reliable autofix
        'ghost/ember/use-ember-get-and-set': 'off'
    }
};
