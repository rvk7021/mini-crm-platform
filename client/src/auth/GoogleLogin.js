import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from './api';
import {useNavigate} from 'react-router-dom';

export default function GoogleOAuth() {
  const navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    try {
      if(authResult['code']){
        const result = await googleAuth(authResult['code']);
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }
  
  const gogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  })

  return (
    <div className="App">
      <button
        onClick={gogleLogin}
      >
        login with google
      </button>
    </div>
  )
}
