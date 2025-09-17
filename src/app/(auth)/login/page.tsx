import { AnimatedLogin } from "@/components/animated-login";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <AnimatedLogin />
       <div className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Button variant="link" asChild className="p-0">
            <Link href="/signup">
                Sign Up <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
        </Button>
      </div>
    </div>
  );
}
