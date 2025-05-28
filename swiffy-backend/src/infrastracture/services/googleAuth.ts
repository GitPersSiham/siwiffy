import { google } from 'googleapis';

import * as serviceAccount from './credentials.json'; // chemin selon ton projet

export const getGoogleAuth = () => {
  return new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
};
