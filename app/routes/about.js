import AuthenticatedRoute from 'soul-admin/routes/authenticated';

export default AuthenticatedRoute.extend({
    buildRouteInfoMetadata() {
        return {
            titleToken: 'About'
        };
    }
});
