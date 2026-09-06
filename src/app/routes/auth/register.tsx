import { RegisterForm } from '@/features/auth';
import { AuthLayout } from '@/components/layouts';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
