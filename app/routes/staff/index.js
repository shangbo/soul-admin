import AuthenticatedRoute from 'soul-admin/routes/authenticated';
import CurrentUserSettings from 'soul-admin/mixins/current-user-settings';
import {inject as service} from '@ember/service';

export default AuthenticatedRoute.extend(CurrentUserSettings, {
    infinity: service(),
    session: service(),

    model() {
        return this.session.user;
    },

    setupController(controller) {
        this._super(...arguments);
        controller.backgroundUpdate.perform();
    },

    actions: {
        reload() {
            this.controller.backgroundUpdate.perform();
        }
    },

    buildRouteInfoMetadata() {
        return {
            titleToken: 'Staff'
        };
    }
});
