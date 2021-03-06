/* eslint-disable camelcase */
import AuthenticatedRoute from 'soul-admin/routes/authenticated';
import CurrentUserSettings from 'soul-admin/mixins/current-user-settings';

export default AuthenticatedRoute.extend(CurrentUserSettings, {
    model(params) {
        return this.store.queryRecord('user', {slug: params.user_slug, include: 'count.posts'});
    },

    afterModel(user) {
        this._super(...arguments);

        return this.get('session.user').then((currentUser) => {
            let isOwnProfile = user.get('id') === currentUser.get('id');
            let isAuthorOrContributor = currentUser.get('isAuthorOrContributor');
            let isEditor = currentUser.get('isEditor');

            if (isAuthorOrContributor && !isOwnProfile) {
                this.transitionTo('staff.user', currentUser);
            } else if (isEditor && !isOwnProfile && !user.get('isAuthorOrContributor')) {
                this.transitionTo('staff');
            }
        });
    },

    serialize(model) {
        return {user_slug: model.get('slug')};
    },

    actions: {
        didTransition() {
            this.modelFor('staff.user').get('errors').clear();
        },

        save() {
            this.get('controller.save').perform();
        },

        willTransition(transition) {
            let controller = this.controller;
            let user = controller.user;
            let dirtyAttributes = controller.dirtyAttributes;
            let modelIsDirty = user.get('hasDirtyAttributes');

            // always reset the password properties on the user model when leaving
            if (user) {
                user.set('password', '');
                user.set('newPassword', '');
                user.set('ne2Password', '');
            }

            if (modelIsDirty || dirtyAttributes) {
                transition.abort();
                controller.send('toggleLeaveSettingsModal', transition);
                return;
            }
        }
    },

    buildRouteInfoMetadata() {
        return {
            titleToken: 'Staff - User'
        };
    }
});
