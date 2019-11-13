import AuthenticatedRoute from 'soul-admin/routes/authenticated';

export default AuthenticatedRoute.extend({
    beforeModel() {
        this._super(...arguments);
        this.replaceWith('editor.new', 'post');
    }
});
