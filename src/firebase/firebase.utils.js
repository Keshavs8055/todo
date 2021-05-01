import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const {
  REACT_APP_APIKEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_DATABASE_URL,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_SENDER_ID,
  REACT_APP_APP_ID,
  REACT_APP_M_ID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_APIKEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  databaseURL: REACT_APP_DATABASE_URL,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_SENDER_ID,
  appId: REACT_APP_APP_ID,
  measurementId: REACT_APP_M_ID,
};
export const createUserDoc = async (userAuth, data) => {
  if (!userAuth) {
    return;
  }
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
      });
    } catch (err) {
      alert('Error:' + err.message);
    }
  }
  return userRef;
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () =>
  auth.signInWithPopup(provider).catch((err) => alert(err.message));

export const getTasks = async (id) => {
  let data = await firestore
    .collection('users')
    .doc(id)
    .collection('tasks')
    .get()
    .catch((err) => alert(err.message));
  let docs = [];
  data.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });

  return docs;
};
