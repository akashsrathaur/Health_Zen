'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  doshaQuestions, 
  doshaDescriptions, 
  calculateDoshaResult, 
  type DoshaType, 
  type DoshaResult 
} from '@/lib/dosha-quiz';
import { cn } from '@/lib/utils';

interface DoshaQuizProps {
  onComplete: (result: DoshaResult) => void;
  onBack?: () => void;
}

export default function DoshaQuiz({ onComplete, onBack }: DoshaQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<DoshaType[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<DoshaResult | null>(null);

  const totalQuestions = doshaQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (selectedDosha: DoshaType) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedDosha;
    setAnswers(newAnswers);

    // Move to next question or show results
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate and show result
      const quizResult = calculateDoshaResult(newAnswers);
      setResult(quizResult);
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    if (result) {
      onComplete(result);
    }
  };

  const currentQ = doshaQuestions[currentQuestion];
  const hasAnswered = answers[currentQuestion] !== undefined;

  if (showResult && result) {
    const { primary, scores, isBalanced, description } = result;
    const doshaInfo = doshaDescriptions[primary];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card className="text-center shadow-lg border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              🕉️ Your Dosha Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Primary Dosha Display */}
            <div 
              className="rounded-lg p-6 text-white shadow-lg"
              style={{ backgroundColor: doshaInfo.bgColor }}
            >
              <h3 className="text-xl font-bold mb-2 text-white">{doshaInfo.name}</h3>
              <p className="mb-2 text-white/90">{doshaInfo.characteristics}</p>
              {isBalanced && (
                <div className="text-yellow-100 text-sm font-medium">
                  ✨ Balanced Constitution
                </div>
              )}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(scores).map(([dosha, score]) => (
                <div key={dosha} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: doshaDescriptions[dosha as DoshaType].bgColor }}
                  >
                    {score}
                  </div>
                  <p className="text-sm font-medium text-foreground">{dosha}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-muted/30 border p-4 rounded-lg">
              <p className="text-sm text-foreground font-medium leading-relaxed">{description}</p>
            </div>

            {/* Physical & Mental Traits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-2 text-foreground">Physical Traits</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{doshaInfo.physical}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-2 text-foreground">Mental Traits</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{doshaInfo.mental}</p>
              </div>
            </div>

            <Button onClick={handleComplete} size="lg" className="w-full">
              <CheckCircle className="mr-2 h-5 w-5" />
              Complete Profile Setup
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">🕉️ Discover Your Dosha</h2>
        <p className="text-muted-foreground">
          Answer 6 questions to discover your Ayurvedic body type for personalized wellness advice
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = answers[currentQuestion] === option.dosha;
                const doshaColor = doshaDescriptions[option.dosha].color;
                
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "w-full text-left justify-start h-auto p-4 transition-all duration-200",
                      isSelected && doshaColor && "text-white hover:opacity-90"
                    )}
                    onClick={() => handleAnswer(option.dosha)}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className={cn(
                          "w-3 h-3 rounded-full mt-1 flex-shrink-0",
                          isSelected && "bg-white"
                        )}
                        style={!isSelected ? { backgroundColor: doshaDescriptions[option.dosha].bgColor } : {}}
                      />
                      <div className="space-y-1">
                        <p className={cn(
                          "font-medium",
                          isSelected ? "text-white" : "text-foreground"
                        )}>{option.text}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          isSelected ? "text-white/80" : "text-muted-foreground opacity-75"
                        )}>
                          {option.dosha} characteristic
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentQuestion === 0 ? onBack : handlePrevious}
          disabled={!onBack && currentQuestion === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentQuestion === 0 ? 'Back' : 'Previous'}
        </Button>
        
        <div className="text-sm text-muted-foreground flex items-center">
          {hasAnswered ? (
            <span className="flex items-center text-green-600">
              <CheckCircle className="mr-1 h-4 w-4" />
              Answered
            </span>
          ) : (
            "Select an answer to continue"
          )}
        </div>
      </div>
    </div>
  );
}