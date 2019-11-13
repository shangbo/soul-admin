import ModalComponent from 'soul-admin/components/modal-base';
import RSVP from 'rsvp';

export default ModalComponent.extend({
    actions: {
        confirm() {
            this.confirm().finally(() => {
                if (!this.isDestroyed && !this.isDestroying) {
                    this.send('closeModal');
                }
            });
        }
    },

    // Allowed actions
    confirm: () => RSVP.resolve()
});
