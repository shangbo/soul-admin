import hljs from 'highlight.js';
import {helper} from '@ember/component/helper';
import {htmlSafe} from '@ember/string';

export function codeHighlight(params, nameArg) {
    let code = nameArg.code;
    let language = nameArg.language;
    let markUpCode = '';
    if (language !== null && language !== '' && language !== undefined){
        markUpCode = hljs.highlight(language,code); 
    } else {
        markUpCode = hljs.highlightAuto(code);  
    }
    return htmlSafe(markUpCode.value);
}

export default helper(codeHighlight);
