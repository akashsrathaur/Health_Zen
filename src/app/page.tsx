import { redirect } from 'next/navigation';

export default function RootPage() {
  // Let AuthGuard handle the proper redirection based on auth state
  redirect('/dashboard');
}
