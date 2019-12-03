import Component from '@ember/component';
// import Ember from 'ember';
import hljs from 'highlight.js';
import layout from '../templates/components/koenig-card-code';
import {computed} from '@ember/object';
import {utils as ghostHelperUtils} from '@tryghost/helpers';
import {htmlSafe} from '@ember/string';
import {isBlank} from '@ember/utils';
import {run} from '@ember/runloop';
import {inject as service} from '@ember/service';
import {set} from '@ember/object';

// const {Handlebars} = Ember;
const {countWords} = ghostHelperUtils;

export default Component.extend({
    feature: service(),
    layout,

    // attrs
    payload: null,
    isSelected: false,
    isEditing: false,
    headerOffset: 0,
    showLanguageInput: true,

    // closure actions
    editCard() {},
    saveCard() {},
    selectCard() {},
    deselectCard() {},
    deleteCard() {},
    registerComponent() {},
    moveCursorToNextSection() {},
    moveCursorToPrevSection() {},
    addParagraphAfterCard() {},

    modeMap: computed('',function () {  
        return {
            python: 'python',
            c: 'clike',
            'c++': 'clike',
            'c#': 'clike',
            cmake: 'cmake',
            css: 'css',
            coffeescript: 'coffeescript',
            go: 'go',
            groovy: 'groovy',
            html: 'xml',
            jsp: 'xml',
            http: 'http',
            java: 'clike',
            javascript: 'javascript',
            lua: 'lua',
            markdown: 'markdown',
            nginx: 'nginx',
            perl: 'perl',
            php: 'php',
            ruby: 'ruby',
            shell: 'shell',
            sql: 'sql',
            vue: 'vue',
            xml: 'xml',
            xhtml: 'xml',
            hbs: 'handlebars',
            js: 'javascript',
            nodejs: 'javascript'
        };
    }),

    counts: computed('payload.code', function () {
        return {wordCount: countWords(this.payload.code)};
    }),

    toolbar: computed('isEditing', function () {
        if (this.isEditing) {
            return false;
        }

        return {
            items: [{
                buttonClass: 'fw4 flex items-center white',
                icon: 'koenig/kg-edit',
                iconClass: 'fill-white',
                title: 'Edit',
                text: '',
                action: run.bind(this, this.editCard)
            }]
        };
    }),

    escapedCode: computed('payload.code', function () {
        // let escapedCode = Handlebars.Utils.escapeExpression(this.payload.code);
        let markUpCode = hljs.highlightAuto(this.payload.code); 
        return htmlSafe(markUpCode.value);
    }),

    cmMode: computed('payload.language', function () {
        let {language} = this.payload;
        return this.modeMap[language] || language;
    }),

    cardStyle: computed('this.isEditing', function () {
        let style = this.isEditing ? 'background-color: #f4f8fb; border-color: #f4f8fb' : '';
        return htmlSafe(style);    
    }),

    cmTheme: computed('this.feature.nightShift', function () {
        let theme = this.feature.nightShift ? 'material' : 'xq-light';
        return theme;
    }),

    languageInputStyle: computed('showLanguageInput', function () {
        let styles = ['top: 4px', 'right: 15px'];
        if (!this.showLanguageInput) {
            styles.push('opacity: 0');
        }
        return htmlSafe(styles.join('; '));
    }),

    languageInputStyleClass: computed('showLanguageInput', function () {
        let className = ['language-absolute','absolute w-20', 'pa1', 'b--whitegrey', 'br2', 'f8', 'tracked-2', 'fw4', 'z-999', 'outline-0', 'anim-normal'];
        if (!this.showLanguageInput) {
            className.push('language-opacity');
        }
        return htmlSafe(className.join(' '));
    }),

    init() {
        this._super(...arguments);
        let payload = this.payload || {};

        // CodeMirror errors on a `null` or `undefined` value
        if (!payload.code) {
            set(payload, 'code', '');
        }

        this.set('payload', payload);

        this.registerComponent(this);
    },

    actions: {
        updateCode(code) {
            this._hideLanguageInput();
            this._updatePayloadAttr('code', code);
        },

        updateCaption(caption) {
            this._updatePayloadAttr('caption', caption);
        },

        enterEditMode() {
            this._addMousemoveHandler();
        },

        leaveEditMode() {
            this._removeMousemoveHandler();

            if (isBlank(this.payload.code)) {
                // afterRender is required to avoid double modification of `isSelected`
                // TODO: see if there's a way to avoid afterRender
                run.scheduleOnce('afterRender', this, function () {
                    this.deleteCard();
                });
            }
        },
        updateLanguage(language) {
            this._updatePayloadAttr('language',language);
        }
    },

    _updatePayloadAttr(attr, value) {
        let payload = this.payload;
        let save = this.saveCard;

        set(payload, attr, value);
        // update the mobiledoc and stay in edit mode
        save(payload, false);
    },

    _hideLanguageInput() {
        this.set('showLanguageInput', false);
    },

    _showLanguageInput() {
        this.set('showLanguageInput', true);
    },

    _addMousemoveHandler() {
        this._mousemoveHandler = run.bind(this, this._showLanguageInput);
        window.addEventListener('mousemove', this._mousemoveHandler);
    },

    _removeMousemoveHandler() {
        window.removeEventListener('mousemove', this._mousemoveHandler);
    }
});
