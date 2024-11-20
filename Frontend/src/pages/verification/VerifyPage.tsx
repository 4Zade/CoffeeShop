import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function VerifyPage() {
const {checkAuth, user} = useAuth();
const navigate = useNavigate();

useEffect(() => {
  const loadPage = async () => {
    try {
      await checkAuth() 
    } 
    catch (error) {
      console.log(error)
    }
    finally {
      console.log(user?.roles)
      if (user?.roles.includes("user")) {
        navigate("/")
      }
    }
  } 
  
  loadPage()
}, [])
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      console.log(user?.email)
      await axios.post('/api/v1/auth/resend-verify', { email: user?.email }, { withCredentials: true });
    } catch (error) {
      console.error('Error resending verification email:', error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline text-black">Email verification sent.</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Click here to resend email.
        </button>
      </form>
    </>
  );
}