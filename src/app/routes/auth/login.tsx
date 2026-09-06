import { LoginForm } from '@/features/auth';
import { AuthLayout } from '@/components/layouts';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
