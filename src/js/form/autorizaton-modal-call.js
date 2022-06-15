import { modalCall } from '../modal/modalCall';
import formTpl from '~/templates/form.hbs';

export const autorisationFormCall = () => modalCall(formTpl(), '.form_close-button');
