import * as axios from 'axios';
import { baseUrl } from '../../config';

const sendMail = (action) => {
  return axios
    .post(`${baseUrl}/mail`, { email: action.email, title: action.title, html: action.html })
    .then((response) => response)
    .catch((error) => error);
};

function sendMailCopyToCustomer(action) {
  return axios
    .post(`${baseUrl}/mail/copy`, { email: action.email, title: 'Kopio lähettämästäsi tarjouspyynnöstä', html: action.html })
    .then((response) => response)
    .catch((error) => error);
}

export { sendMail, sendMailCopyToCustomer };
