import EmberObject from '@ember/object';
import ValidationEngine from 'soul-admin/mixins/validation-engine';
import {computed} from '@ember/object';
import {isBlank} from '@ember/utils';

export default EmberObject.extend(ValidationEngine, {
    // values entered here will act as defaults
    url: '',
    username: '',

    validationType: 'slackIntegration',

    isActive: computed('url', function () {
        let url = this.url;
        return !isBlank(url);
    })
});
