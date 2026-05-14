import { Suspense } from 'react';
import { CompleteProfileForm } from '@/components/auth/CompleteProfileForm';

export default function CompleteProfilePage() {
  return (
    <Suspense>
      <CompleteProfileForm />
    </Suspense>
  );
}
