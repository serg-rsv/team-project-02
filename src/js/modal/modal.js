import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';

const modal = {
    authForm: (data, selector) => {
        const instance = basicLightbox.create(data);
        instance.show();
        this.closeOnEscape(instance.close);

        if(!selector) return;
    },
    movie: (data, selector) => {
        const instance = basicLightbox.create(data);
        instance.show();
        this.closeOnEscape(instance.close);

        if(!selector) return;
    },
    closeOnEscape: (callback) => {
        const a = onEscapeKeyDown.bind(this, callback);
        document.body.addEventListener('keydown', onEscapeKeyDown);

        function onEscapeKeyDown(e, callback) {
            if (e.key === 'Escape') return;
        
            callback();
            document.body.removeEventListener('keydown', onEscapeKeyDown);
        }
    }
}