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
<<<<<<< HEAD
        "no-console": "off", 
=======
>>>>>>> ded09fd15179dceab8ad76d0279b74c5832cdd5e
        // disable linting of `this.get` until there's a reliable autofix
        'ghost/ember/use-ember-get-and-set': 'off'
    }
};
