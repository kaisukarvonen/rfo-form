import * as axios from 'axios';
import baseUrl from '../config';

function sendMail(action) {
  const promise =
    axios.post(`${baseUrl}/mail`, { email: action.email, html: action.html })
      .then(response => response)
      .catch(error => error);
  return promise;
}

export default sendMail;
