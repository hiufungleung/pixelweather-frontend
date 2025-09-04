import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function LogsScreen() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/viewed');
    }, []);
    
    return null;
}
