import TextField from '@ember/component/text-field';
import TextInputMixin from 'soul-admin/mixins/text-input';

export default TextField.extend(TextInputMixin, {
    classNames: 'gh-input'
});
