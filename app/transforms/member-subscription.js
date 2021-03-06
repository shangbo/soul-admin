import MemberSubscription from 'soul-admin/models/member-subscription';
import Transform from 'ember-data/transform';
import {A as emberA, isArray as isEmberArray} from '@ember/array';

export default Transform.extend({
    deserialize(serialized) {
        let subscriptions, subscriptionArray;

        subscriptionArray = serialized.subscriptions || [];

        subscriptions = subscriptionArray.map(itemDetails => MemberSubscription.create(itemDetails));

        return emberA(subscriptions);
    },

    serialize(deserialized) {
        let subscriptionArray;

        if (isEmberArray(deserialized)) {
            subscriptionArray = deserialized.map((item) => {
                return item;
            }).compact();
        } else {
            subscriptionArray = [];
        }

        return {
            subscriptions: subscriptionArray
        };
    }
});
