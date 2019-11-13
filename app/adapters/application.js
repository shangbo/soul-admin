import EmbeddedRelationAdapter from 'soul-admin/adapters/embedded-relation-adapter';

export default EmbeddedRelationAdapter.extend({

    shouldBackgroundReloadRecord() {
        return false;
    }

});
