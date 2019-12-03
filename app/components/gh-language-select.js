import Component from '@ember/component';
// import {computed} from '@ember/object';

export default Component.extend({
    languageClass: 'language-absolute',
    classNameBindings: ['languageClass'],
    // selectableLanguages: '1 2',
    avaliableLanguages: '',

    update: () => {},
    
    init(){
        this._super(...arguments);
        this.avaliableLanguages = Object.keys(this.languagesMap);
    },

    actions: {
        updateLanguage(language) {
            this.update(language);
        }
    }
});
