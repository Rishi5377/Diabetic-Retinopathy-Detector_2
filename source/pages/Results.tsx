import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { FileDown, RotateCcw, AlertTriangle, CheckCircle2, AlertCircle, Pill } from 'lucide-react';
import { toast } from 'sonner';

const Results = () => {
  const navigate = useNavigate();
  const { analysisResult, resetApp } = useAppContext();

  if (!analysisResult) {
    navigate('/');
    return null;
  }

  const { diagnosis, confidence, riskLevel, recommendations } = analysisResult;

  const riskConfig = {
    low: {
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      label: 'Low Risk',
      emoji: '✅',
    },
    moderate: {
      icon: AlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      label: 'Moderate Risk',
      emoji: '⚠️',
    },
    high: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      label: 'High Risk',
      emoji: '🚨',
    },
  };

  const currentRisk = riskConfig[riskLevel];
  const RiskIcon = currentRisk.icon;

  const prescriptions = {
    low: [
      'Maintain blood sugar levels within target range (HbA1c < 7%)',
      'Schedule annual comprehensive eye examinations',
      'Follow a balanced diet rich in leafy greens and omega-3 fatty acids',
      'Exercise regularly (30 minutes daily, 5 days per week)',
      'Monitor blood pressure and keep it below 130/80 mmHg',
    ],
    moderate: [
      'Intensify blood glucose monitoring - check levels 3-4 times daily',
      'Schedule eye exams every 6 months with retinal imaging',
      'Consider medication adjustment with your endocrinologist',
      'Implement strict dietary control with a certified diabetes educator',
      'Start anti-VEGF therapy if recommended by ophthalmologist',
    ],
    high: [
      'Immediate consultation with retinal specialist required',
      'Consider laser photocoagulation or intravitreal injections',
      'Aggressive blood sugar control with insulin therapy optimization',
      'Monthly eye examinations and OCT scans',
      'Coordinate care between endocrinologist, ophthalmologist, and primary care',
    ],
  };

  const handleDownloadReport = () => {
    toast.success('PDF report download started!');
    // In a real app, this would generate and download a PDF
  };

  const handleStartOver = () => {
    resetApp();
    toast.info('Starting a new scan...');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <StepIndicator currentStep={4} totalSteps={4} stepLabel="Analysis Results" />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Results Card */}
          <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-border animate-scale-in">
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${currentRisk.bgColor} mb-4 animate-pulse-slow`}
              >
                <RiskIcon className={`w-10 h-10 ${currentRisk.color}`} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Analysis Complete
              </h2>
              <p className="text-muted-foreground">
                AI-powered diagnosis based on your retina scan
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Diagnosis */}
              <div className="p-6 bg-background rounded-xl border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Diagnosis
                </h3>
                <p className="text-lg font-semibold text-foreground">{diagnosis}</p>
              </div>

              {/* Confidence */}
              <div className="p-6 bg-background rounded-xl border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  AI Confidence
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-primary h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    {confidence.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div
              className={`p-6 rounded-xl border-2 ${currentRisk.borderColor} ${currentRisk.bgColor} mb-8 animate-fade-in`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="text-3xl">{currentRisk.emoji}</div>
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${currentRisk.color} mb-2`}>
                    Risk Level: {currentRisk.label}
                  </h3>
                  <p className="text-foreground/90 leading-relaxed">{recommendations}</p>
                </div>
              </div>
            </div>

            {/* Medical Recommendations */}
            <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Important Medical Notice
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This AI analysis is intended for screening purposes only and should not replace
                professional medical advice. Please consult with a qualified ophthalmologist or
                healthcare provider for a comprehensive diagnosis and treatment plan. Early detection
                and proper management are key to preserving your vision.
              </p>
            </div>
          </div>

          {/* Prescription Section */}
          <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 border border-border animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Recommended Management Plan
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tailored recommendations for {currentRisk.label.toLowerCase()} diabetic retinopathy
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {prescriptions[riskLevel].map((prescription, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-foreground leading-relaxed flex-1 pt-1">
                    {prescription}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-warning/5 rounded-lg border border-warning/20">
              <p className="text-sm text-muted-foreground italic">
                <strong className="text-warning">Note:</strong> These recommendations are general guidelines. 
                Always follow your healthcare provider's specific instructions and treatment plan.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadReport}
              className="w-full"
            >
              <FileDown className="mr-2 w-5 h-5" />
              Download PDF Report
            </Button>
            <Button
              variant="cta"
              size="lg"
              onClick={handleStartOver}
              className="w-full"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
