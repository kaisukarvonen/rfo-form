import * as axios from 'axios';
import baseUrl from '../config';

function sendMail(action) {
  const promise =
    axios.post(`${baseUrl}/mail`)
      .then(response => response)
      .catch(error => error);
  return promise;
}

export default sendMail;
