'use client'
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginInput = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginInput,
    validators: {
      onSubmit: LoginSchema,
      onChange: LoginSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email({
        email: value.email,
        password: value.password,
      }, {
        onSuccess: () => {
          router.push('/');
        },
        onError: (error) => {
          setResult(`Login failed: ${error.error.message}`);
        },
        onRequest: () => {
          setPending(true);
          setResult(null);
        }
      });
    },
  });

  return (
    <Card className="w-full max-w-md rounded-xl shadow-xl">
      <CardContent className="py-8 px-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Field name="email">
            {(field) => (
              <div>
                <Label htmlFor={field.name} className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  type="email"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1"
                  placeholder="you@example.com"
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-xs text-red-500 mt-1">
                    {field.state.meta.errors[0].message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div>
                <Label htmlFor={field.name} className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  type="password"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-xs text-red-500 mt-1">
                    {field.state.meta.errors[0].message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex flex-row gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={pending}
            >
              Reset
            </Button>
          </div>
        </form>

        {result && (
          <p className="mt-4 text-sm text-red-500 text-center">{result}</p>
        )}
      </CardContent>
    </Card>
  );
}
