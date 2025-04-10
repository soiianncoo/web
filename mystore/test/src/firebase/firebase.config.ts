import * as admin from 'firebase-admin';
import * as serviceAccount from './mystore-54146-firebase-adminsdk-fbsvc-cd156b1bb8.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
export const firebaseProjectId = (serviceAccount as any).project_id;
export default admin;
