import { Icons } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative flex-1 flex flex-col items-center justify-center bg-background p-4 md:p-8">
        <div className="absolute top-8 left-8">
            <Link href="/dashboard" className="flex items-center gap-2 text-foreground">
                <Icons.logo className="h-8 w-8" />
                <span className="font-semibold text-lg">HealthZen</span>
            </Link>
        </div>
        <div className="w-full max-w-md space-y-8 py-16">
            {children}
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 lg:w-3/5 relative">
        <Image
          src="https://picsum.photos/seed/loginhero/1200/800"
          alt="Zen garden"
          fill
          className="object-cover"
          data-ai-hint="zen garden"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
         <div className="absolute bottom-8 right-8 text-white p-4 rounded-lg bg-black/30 backdrop-blur-sm">
            <blockquote className="text-xl italic">
                “The greatest wealth is health.”
            </blockquote>
            <cite className="mt-2 block text-right not-italic">- Virgil</cite>
        </div>
      </div>
    </div>
  );
}
