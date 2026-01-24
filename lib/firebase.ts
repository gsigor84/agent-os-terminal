import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Connect to emulator if running locally
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Prevent multiple connections
    // @ts-ignore
    if (!auth.emulatorConfig) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        console.log('Connected to Auth Emulator');
    }
}

export { auth };
