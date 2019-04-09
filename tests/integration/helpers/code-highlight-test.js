import hbs from 'htmlbars-inline-precompile';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {render} from '@ember/test-helpers';
import {setupRenderingTest} from 'ember-mocha';

describe('Integration | Helper | code-highlight', function () {
    setupRenderingTest();

    // Replace this with your real tests.
    it('renders', async function () {
        this.set('inputValue', '1234');

        await render(hbs`{{code-highlight inputValue}}`);

        expect(this.element.textContent.trim()).to.equal('1234');
    });
});
