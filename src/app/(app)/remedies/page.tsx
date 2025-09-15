import Image from 'next/image';
import { Balancer } from 'react-wrap-balancer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { remedyCategories, remedies, type Remedy } from '@/lib/data';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function RemedyCard({ remedy }: { remedy: Remedy }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={remedy.imageUrl}
          alt={remedy.title}
          fill
          className="object-cover"
          data-ai-hint={remedy.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle>{remedy.title}</CardTitle>
        <CardDescription>{remedy.benefits}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Ingredients</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {remedy.ingredients.map((ing) => (
                <li key={ing} className="flex items-start">
                  <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Instructions</h4>
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              {remedy.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RemediesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Remedies & Ayurveda
        </h1>
        <p className="text-muted-foreground">
          <Balancer>
            Explore a library of modern and Ayurvedic remedies for a healthier
            life.
          </Balancer>
        </p>
      </div>

      <Tabs defaultValue={remedyCategories[0].id}>
        <div className="overflow-x-auto pb-2">
            <TabsList>
            {remedyCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                {category.name}
                </TabsTrigger>
            ))}
            </TabsList>
        </div>
        {remedyCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remedies
                .filter((r) => r.category === category.id)
                .map((remedy) => (
                  <RemedyCard key={remedy.id} remedy={remedy} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
