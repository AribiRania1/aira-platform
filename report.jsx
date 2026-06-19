import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Report() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/doctor/results');
  }, []);
  return null;
}
