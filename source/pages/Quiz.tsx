import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import questions from '@/data/quiz';

const Quiz = () => {
  const navigate = useNavigate();
  const { quizAnswers, setQuizAnswers } = useAppContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>(
    quizAnswers.length === questions.length
      ? quizAnswers.map((a) => a.answer)
      : new Array(questions.length).fill(false)
  );
  const [hasAnswered, setHasAnswered] = useState<boolean[]>(
    new Array(questions.length).fill(quizAnswers.length === questions.length)
  );

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    const newHasAnswered = [...hasAnswered];
    newHasAnswered[currentQuestion] = true;
    setHasAnswered(newHasAnswered);

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (!hasAnswered[currentQuestion]) {
      toast.error('Please answer the current question before proceeding');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save answers and navigate to upload
      const formattedAnswers = questions.map((q, i) => ({
        question: q,
        answer: answers[i],
      }));
      setQuizAnswers(formattedAnswers);
      toast.success('Questionnaire completed!');
      navigate('/upload');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <StepIndicator currentStep={2} totalSteps={4} stepLabel="Health Questionnaire" />

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-border animate-scale-in">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="min-h-[200px] flex items-center justify-center mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center text-foreground animate-fade-in">
                {questions[currentQuestion]}
              </h2>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button
                variant={hasAnswered[currentQuestion] && answers[currentQuestion] ? 'success' : 'outline'}
                size="lg"
                onClick={() => handleAnswer(true)}
                className="h-20 text-lg font-semibold"
              >
                <Check className="mr-2 w-6 h-6" />
                Yes
              </Button>
              <Button
                variant={hasAnswered[currentQuestion] && !answers[currentQuestion] ? 'warning' : 'outline'}
                size="lg"
                onClick={() => handleAnswer(false)}
                className="h-20 text-lg font-semibold"
              >
                <X className="mr-2 w-6 h-6" />
                No
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="flex-1 sm:flex-none"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>

              <Button
                variant="cta"
                onClick={handleNext}
                disabled={!hasAnswered[currentQuestion]}
                className="flex-1 sm:flex-none"
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    Next: Upload Scan
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => hasAnswered[index] && setCurrentQuestion(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentQuestion
                    ? 'bg-primary w-8'
                    : hasAnswered[index]
                      ? 'bg-primary/50'
                      : 'bg-muted'
                    }`}
                  disabled={!hasAnswered[index]}
                />
              ))}
            </div>

            {/* Build/version stamp for cache-busting verification */}
            <div className="mt-6 text-center text-xs text-muted-foreground">
              Build: {import.meta.env.VITE_BUILD_ID ? String(import.meta.env.VITE_BUILD_ID).slice(0, 7) : 'dev'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
