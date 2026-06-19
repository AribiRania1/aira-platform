import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Analyze() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/doctor/analyze');
  }, []);
  return null;
}
