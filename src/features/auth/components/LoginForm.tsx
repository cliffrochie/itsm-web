import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Logo from '@/assets/images/logo.svg';
import { loginSchema, type LoginSchemaType } from '../schemas';
import { login } from '../api/login';
import { getCurrentUser } from '../api/get-current-user';
import { toast } from 'sonner';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await login(data);
      const user = await getCurrentUser();

      toast.success('Signed in successfully.');

      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'staff') {
        navigate('/service-engineer');
      } else {
        navigate('/client');
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Invalid username or password.';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[500px] py-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-center">
          <div className="flex justify-center items-center mb-4">
            <img src={Logo} width="80" height="80" alt="ITSM Logo" />
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            NIA ITSM
          </div>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Information Technology Service Management
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-md p-3 mb-4">
            {errorMsg}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      autoComplete="username"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
