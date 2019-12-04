/* global CodeMirror */
import Component from '@ember/component';
import boundOneWay from 'soul-admin/utils/bound-one-way';
import {assign} from '@ember/polyfills';
import {bind, once, scheduleOnce} from '@ember/runloop';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import {task} from 'ember-concurrency';

const CmEditorComponent = Component.extend({
    lazyLoader: service(),

    classNameBindings: ['isFocused:focus'],

    textareaClass: '',
    isFocused: false,

    // options for the editor
    autofocus: false,
    indentUnit: 4,
    lineNumbers: true,
    smartIndent: true,
    lineWrapping: false,
    loader: null,
    mode: 'htmlmixed',
    theme: 'xq-light',
    _editor: null, // reference to CodeMirror editor

    // Allowed actions
    'focus-in': () => {},
    update: () => {},

    _value: boundOneWay('value'), 
    assetLocation: computed('', function () {
        return {
            python: 'assets/codemirror/mode/python/python.js',
            clike: 'assets/codemirror/mode/clike/clike.js',
            cmake: 'assets/codemirror/mode/cmake/cmake.js',
            css: 'assets/codemirror/mode/css/css.js',
            coffeescript: 'assets/codemirror/mode/coffeescript/coffeescript.js',
            go: 'assets/codemirror/mode/go/go.js',
            groovy: 'assets/codemirror/mode/groovy/groovy.js',
            xml: 'assets/codemirror/mode/xml/xml.js',
            http: 'assets/codemirror/mode/http/http.js',
            javascript: 'assets/codemirror/mode/javascript/javascript.js',
            lua: 'assets/codemirror/mode/lua/lua.js',
            markdown: 'assets/codemirror/mode/markdown/markdown.js',
            nginx: 'assets/codemirror/mode/nginx/nginx.js',
            perl: 'assets/codemirror/mode/perl/perl.js',
            php: 'assets/codemirror/mode/php/php.js',
            ruby: 'assets/codemirror/mode/ruby/ruby.js',
            shell: 'assets/codemirror/mode/shell/shell.js',
            sql: 'assets/codemirror/mode/sql/sql.js',
            vue: 'assets/codemirror/mode/vue/vue.js',
            hbs: 'assets/codemirror/mode/hbs/hbs.js'
        };
    }),

    // make sure a value exists

    didReceiveAttrs() {
        if (this._value === null || undefined) {
            this.set('_value', '');
        }
        // if (this.mode !== this._lastMode && this._editor) {
        if (this._editor) {
            this.changeMode.perform();
        }
        this._lastMode = this.mode;
    },

    didInsertElement() {
        this._super(...arguments);
        this.initCodeMirror.perform();
    },

    willDestroyElement() {
        this._super(...arguments);

        // Ensure the editor exists before trying to destroy it. This fixes
        // an error that occurs if codemirror hasn't finished loading before
        // the component is destroyed.
        if (this._editor) {
            let editor = this._editor.getWrapperElement();
            editor.parentNode.removeChild(editor);
            this._editor = null;
        }
    },

    actions: {
        updateFromTextarea(value) {
            this.update(value);
        }
    },

    initCodeMirror: task(function* () {
        this.loader = this.lazyLoader;
        let jsPath = 'assets/codemirror/codemirror.js';
        let cssPath = 'assets/codemirror/codemirror-style.css';
        yield this.loader.loadScript('codemirror', jsPath);
        yield this.loader.loadStyle('codemirror', cssPath);
        if (this.mode){
            let modePath = this.assetLocation[this.mode];
            yield this.loader.loadScript('codemirror-mode-' + this.mode, modePath, 'after');
        }
        scheduleOnce('afterRender', this, this._initCodeMirror);
    }),

    changeMode: task(function* (){
        if (this.mode && this.mode !== this._lastMode){
            // this._destroyEditor();
            let modePath = this.assetLocation[this.mode];
            yield this.loader.loadScript('codemirror-mode-' + this.mode, modePath, 'after');
            scheduleOnce('afterRender', this, this._changeMode);
        }
    }),

    _changeMode(){
        if (this._editor){
            this._editor.setOption('mode',this.mode);
        }
    },

    _initCodeMirror() {
        let options = this.getProperties('lineNumbers', 'lineWrapping', 'indentUnit', 'mode', 'theme', 'autofocus','smartIndent');
        assign(options, {value: this._value});
        let textarea = this.element.querySelector('textarea');
        if (textarea && textarea === document.activeElement) {
            options.autofocus = true;
        }
        // textarea.value = this._value;
        this._editor = new CodeMirror.fromTextArea(textarea, options);

        // by default CodeMirror will place the cursor at the beginning of the
        // content, it makes more sense for the cursor to be at the end
        if (options.autofocus) {
            this._editor.setCursor(this._editor.lineCount(), 0);
        }

        // events
        this._setupCodeMirrorEventHandler('focus', this, this._focus);
        this._setupCodeMirrorEventHandler('blur', this, this._blur);
        this._setupCodeMirrorEventHandler('change', this, this._update);

        // this._editor.setOption('mode', this.mode);
    },

    _setupCodeMirrorEventHandler(event, target, method) {
        let callback = bind(target, method);

        this._editor.on(event, callback);

        this.one('willDestroyElement', this, function () {
            this._editor.off(event, callback);
        });
    },

    _update(codeMirror, changeObj) {
        once(this, this.update, codeMirror.getValue(), codeMirror, changeObj);
    },

    _focus(codeMirror, event) {
        this.set('isFocused', true);
        once(this, this['focus-in'], codeMirror.getValue(), codeMirror, event);
    },

    _blur(/* codeMirror, event */) {
        this.set('isFocused', false);
    }
   
});

CmEditorComponent.reopenClass({
    positionalParams: ['value']
});

export default CmEditorComponent;
