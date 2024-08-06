import axios from 'axios';

const API_KEY = 'AIzaSyCCByGPiiZeWhXSjnL_O9MUYqGF4lhcFh0';

async function authenticate(mode, data) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, data);
  console.log(JSON.stringify(response.data));

  return response.data;
}

export function createUser(email, password) {
  return authenticate('signUp', { email, password, returnSecureToken: true });
}

export function login(email, password) {
  return authenticate('signInWithPassword', { email, password, returnSecureToken: true });
}


// Get user data
export function getUserInfo(token) {
  return authenticate('lookup', { idToken: token });
}



export function resetPassword(email) {
  return authenticate('sendOobCode', { requestType: 'PASSWORD_RESET', email });
}



// export function sendPasswordResetEmail(email) {
//   const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
//    return axios.post(url, {
//     requestType: 'PASSWORD_RESET',
//     email: email,
//   });
// }