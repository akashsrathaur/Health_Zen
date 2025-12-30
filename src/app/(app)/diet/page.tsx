'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ChefHat, Flame, Utensils, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateDietPlanAction } from '@/actions/ai-diet'; // I will create this next.

import { motion } from 'framer-motion';

export default function DietPlannerPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [dietPlan, setDietPlan] = useState<any>(null);

    const [formData, setFormData] = useState({
        age: 30,
        weight: 70,
        height: 170,
        gender: 'Male',
        goal: 'healthy_living',
        activityLevel: 'moderate',
        dietaryRestrictions: '',
        cuisinePreferences: ''
    });

    const handleGenerate = async () => {
        setLoading(true);
        setDietPlan(null);
        try {
            // Logic to call the server action
            const result = await generateDietPlanAction(formData);
            if (result) {
                setDietPlan(result);
                toast({
                    title: "Plan Generated",
                    description: "Your personalized diet plan is ready!"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Generation Failed",
                description: "Could not generate diet plan. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">AI Diet Planner</h1>
                <p className="text-muted-foreground text-lg">
                    Get a scientifically backed, personalized meal plan instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Input Form */}
                <Card className="md:col-span-1 h-fit glass-panel border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Your Stats</CardTitle>
                        <CardDescription>Tell us about yourself</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Age</Label>
                                <Input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select value={formData.gender} onValueChange={v => setFormData({ ...formData, gender: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Weight (kg)</Label>
                                <Input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Height (cm)</Label>
                                <Input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Activity Level</Label>
                            <Select value={formData.activityLevel} onValueChange={v => setFormData({ ...formData, activityLevel: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedentary">Sedentary (Office job)</SelectItem>
                                    <SelectItem value="light">Lightly Active (1-3 days/week)</SelectItem>
                                    <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                                    <SelectItem value="very_active">Very Active (Physical job)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Goal</Label>
                            <Select value={formData.goal} onValueChange={v => setFormData({ ...formData, goal: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                                    <SelectItem value="healthy_living">Healthy Living</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Dietary Restrictions</Label>
                            <Input placeholder="e.g. Vegan, Nut Allergy" value={formData.dietaryRestrictions} onChange={e => setFormData({ ...formData, dietaryRestrictions: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Cuisine Preferences</Label>
                            <Input placeholder="e.g. Italian, Indian" value={formData.cuisinePreferences} onChange={e => setFormData({ ...formData, cuisinePreferences: e.target.value })} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full glass-button" onClick={handleGenerate} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChefHat className="mr-2 h-4 w-4" />}
                            Generate Plan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Results Display */}
                <div className="md:col-span-2">
                    {!dietPlan && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl p-12">
                            <Utensils className="h-12 w-12 mb-4 opacity-20" />
                            <p>Enter your details and click generate to see your plan.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-12">
                            <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
                            <p>AI is crafting your perfect meal plan...</p>
                        </div>
                    )}

                    {dietPlan && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {/* Summary Card */}
                            <Card className="glass-panel border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Flame className="h-5 w-5 text-primary" />
                                        Daily Target: {dietPlan.dailyCalories} kcal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <p className="text-sm font-semibold text-primary">{dietPlan.macros.protein}</p>
                                            <p className="text-xs text-muted-foreground">Protein</p>
                                        </div>
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <p className="text-sm font-semibold text-primary">{dietPlan.macros.carbs}</p>
                                            <p className="text-xs text-muted-foreground">Carbs</p>
                                        </div>
                                        <div className="p-3 bg-secondary/50 rounded-lg">
                                            <p className="text-sm font-semibold text-primary">{dietPlan.macros.fats}</p>
                                            <p className="text-xs text-muted-foreground">Fats</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meals */}
                            <div className="space-y-4">
                                {dietPlan.meals.map((meal: any, idx: number) => (
                                    <motion.div key={idx} variants={itemVariants}>
                                        <Card className="overflow-hidden hover:shadow-md transition-all">
                                            <div className="p-1 h-full w-2 bg-primary absolute left-0 top-0 bottom-0" />
                                            <CardHeader className="pb-2 pl-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{meal.type}</p>
                                                        <CardTitle className="text-lg">{meal.name}</CardTitle>
                                                    </div>
                                                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">{meal.calories} kcal</span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pl-6 space-y-3">
                                                <p className="text-sm text-foreground/80">{meal.description}</p>
                                                <div>
                                                    <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                                                        <Leaf className="h-3 w-3" /> Ingredients:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {meal.ingredients.map((ing: string, i: number) => (
                                                            <span key={i} className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground">{ing}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
