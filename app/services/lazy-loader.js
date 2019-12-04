import RSVP from 'rsvp';
import Service, {inject as service} from '@ember/service';
import config from 'soul-admin/config/environment';

export default Service.extend({
    ajax: service(),
    ghostPaths: service(),

    // This is needed so we can disable it in unit tests
    testing: undefined,

    scriptPromises: null,

    init() {
        this._super(...arguments);
        this.scriptPromises = {};

        if (this.testing === undefined) {
            this.testing = config.environment === 'test';
        }
    },

    loadScript(key, url, position = 'before') {
        console.log(url);
        console.log(key);
        if (this.testing) {
            console.log(1);
            return RSVP.resolve();
        }
        if (this.scriptPromises[key]) {
            console.log(2);
            return this.scriptPromises[key];
        }
        let scriptPromise = new RSVP.Promise((resolve, reject) => {
            let {adminRoot} = this.ghostPaths;
            console.log(3);
            console.log(adminRoot);
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = `${adminRoot}${url}`;

            let el = document.getElementsByTagName('script')[0];
            if (position === 'before'){
                el.parentNode.insertBefore(script, el);
            }
            if (position === 'after'){
                let parent = el.parentNode;
                if (parent.lastChild === el) {
                    // 如果最后的节点是目标元素，则直接添加。因为默认是最后
                    parent.appendChild(script);
                } else {
                    parent.insertBefore(script, el.nextSibling);
                    //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
                }
            }

            script.addEventListener('load', () => {
                resolve();
            });

            script.addEventListener('error', () => {
                reject(new Error(`${url} failed to load`));
            });
        });

        this.scriptPromises[key] = scriptPromise;

        return scriptPromise;
    },

    loadStyle(key, url, alternate = false) {
        if (this.testing || document.querySelector(`#${key}-styles`)) {
            return RSVP.resolve();
        }

        return new RSVP.Promise((resolve, reject) => {
            let link = document.createElement('link');
            link.id = `${key}-styles`;
            link.rel = alternate ? 'alternate stylesheet' : 'stylesheet';
            link.href = `${this.ghostPaths.adminRoot}${url}`;
            link.onload = () => {
                link.onload = null;
                if (alternate) {
                    // If stylesheet is alternate and we disable the stylesheet before injecting into the DOM,
                    // the onload handler never gets called. Thus, we should disable the link after it has finished loading
                    link.disabled = true;
                }
                resolve();
            };
            link.onerror = reject;

            if (alternate) {
                link.title = key;
            }

            document.querySelector('head').appendChild(link);
        });
    }
});
