import hbs from 'htmlbars-inline-precompile';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {render} from '@ember/test-helpers';
import {setupRenderingTest} from 'ember-mocha';

describe('Integration | Component | gh-language-select', function () {
    setupRenderingTest();

    it('renders', async function () {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<GhLanguageSelect />`);

        expect(this.element.textContent.trim()).to.equal('');

        // Template block usage:
        await render(hbs`
      <GhLanguageSelect>
        template block text
      </GhLanguageSelect>
    `);

        expect(this.element.textContent.trim()).to.equal('template block text');
    });
});
