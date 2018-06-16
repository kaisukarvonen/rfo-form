import * as axios from 'axios';
import baseUrl from '../config';

function fetch() {
  const promise =
    axios.get(`${baseUrl}/fields`)
      .then(response => response)
      .catch(error => error);
  return promise;
}

export default fetch;
