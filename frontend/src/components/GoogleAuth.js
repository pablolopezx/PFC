import  { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';

const GoogleAuth = () => {
    const { setUser } = useContext(AuthContext);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error.message);
        }
    };

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    );
};

export default GoogleAuth;
