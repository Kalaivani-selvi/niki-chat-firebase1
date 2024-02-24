import React, { useRef, useState } from 'react';
import './App.css';

// Import the specific Firebase services you need from the Modular SDK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp ,orderBy ,query} from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import { useCollectionData } from 'react-firebase-hooks/firestore'; // Import useCollectionData
// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLJp1Pz2S2WCZNMK48wBEW65is3GxlNy4",
  authDomain: "kalai-firebase1.firebaseapp.com",
  projectId: "kalai-firebase1",
  storageBucket: "kalai-firebase1.appspot.com",
  messagingSenderId: "948871949639",
  appId: "1:948871949639:web:90016d01fa66ab5badb062",
  measurementId: "G-2DYYK40YWQ"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => signOut(auth)}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');

  const [messages] = useCollectionData(
    query(messagesRef, orderBy('createdAt')),
    { idField: 'id' }
  );

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
        <button type="submit" disabled={!formValue}>🕊️</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="User Avatar" />
      <p>{text}</p>
    </div>
  )
}

export default App;

