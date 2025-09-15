import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 2v10l-4 4"/><path d="m12 12 8-4"/><path d="m12 12 4 8"/><path d="M12 12 4 4"/></svg>
    )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side: Form */}
      <div className="relative flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4 md:p-8">
        <div className="w-full max-w-md space-y-8 py-16">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Icons.logo className="h-16 w-16" />
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">
              Welcome to HealthZen
            </h1>
            <p className="text-lg text-muted-foreground">
              Your daily dose of wellness, gamified.
            </p>
          </div>

          <div className="animate-pop-in space-y-4" style={{ animationDelay: '0.3s' }}>
            <Link href="/dashboard" className="block">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
              </Button>
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Google
              </Button>
              <Button variant="outline">
                <LinkedInIcon className="mr-2 h-5 w-5" />
                LinkedIn
              </Button>
            </div>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground animate-pop-in" style={{ animationDelay: '0.5s' }}>
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      </div>

      {/* Right side: Image */}
      <div className="hidden md:block md:w-1/2 lg:w-3/5 relative">
        <Image
          src="https://picsum.photos/seed/loginhero/1200/800"
          alt="Zen garden"
          fill
          className="object-cover"
          data-ai-hint="zen garden"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
    </div>
  );
}
