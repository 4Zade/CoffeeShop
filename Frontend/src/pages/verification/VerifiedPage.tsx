import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function VerifiedPage() {
    const { token } = useParams();
    const [verify, setVerify] = useState(false);
    const hasFetched = useRef(false);

    async function getEmail() {
        try {
            const response = await axios.post(`/api/v1/auth/verify/${token}`, { withCredentials: true });

            if(response.status === 200){
                setVerify(true);
            }
        } catch (error) {
            console.error('Error fetching user status:', error);
        }
    }

    useEffect(() => {
        if (!hasFetched.current) {
            getEmail();
            hasFetched.current = true;
        }
    }, []);

    return (
        verify &&
        <h1 className="text-3xl font-bold underline text-black">
            Email verified.
        </h1>
    );
}