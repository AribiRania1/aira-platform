import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function History() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/doctor/reports');
  }, []);
  return null;
}
