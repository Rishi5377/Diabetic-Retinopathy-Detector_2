import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { FileDown, RotateCcw, AlertTriangle, CheckCircle2, AlertCircle, Pill } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
      'Diet — Use a low–glycemic plate: 1/2 non‑starchy vegetables, 1/4 lean protein, 1/4 whole grains; include omega‑3 sources (fatty fish, flaxseed, walnuts).',
      'Diet — Keep consistent meal timing; don’t skip meals; limit sugary drinks and juices; hydrate 2–3 L/day unless your clinician advises otherwise.',
      'Sleep — Aim for 7–8 hours nightly with a fixed sleep/wake schedule; limit caffeine after 2 pm; screen‑off time 60 minutes before bed.',
      'Activity — At least 150 min/week of moderate activity (e.g., brisk walk 30 min × 5 days); add light strength training 2 days/week.',
      'Activity — Reduce eye strain: 20‑20‑20 rule during screens, brief stretch/mobility breaks every hour.',
    ],
    moderate: [
      'Diet — Work with a dietitian for carb counting and portions; target 25–35 g fiber/day; cut refined carbs/ultra‑processed foods.',
      'Diet — Heart‑healthy, lower‑sodium meals (DASH‑style); include leafy greens (lutein/zeaxanthin) and omega‑3 fats.',
      'Sleep — 7–9 hours nightly on a consistent schedule; dim lights 60–90 minutes before bed; discuss evaluation for sleep apnea if snoring or daytime sleepiness.',
      'Activity — 30 minutes/day low‑ to moderate‑intensity aerobic exercise; add 2 non‑consecutive days of light resistance; avoid breath‑holding/straining (no Valsalva).',
      'Activity — Post‑meal walks (10–20 minutes) to blunt glucose spikes; wear supportive footwear; stop if visual symptoms worsen.',
    ],
    high: [
      'Diet — Supervised medical nutrition therapy: small, frequent, balanced meals; minimize refined sugars; emphasize whole foods; restrict sodium if hypertensive.',
      'Diet — Keep carbohydrate intake consistent per meal and coordinate with insulin/meds to prevent highs/lows; avoid alcohol until cleared by your clinician.',
      'Sleep — Strict 7–9 hours nightly; fixed schedule; evaluate and treat sleep apnea if suspected; avoid heavy late‑night meals.',
      'Activity — Gentle, clinician‑cleared movement only (e.g., easy walking 10–20 minutes after meals); avoid high‑impact exercise, heavy lifting, inverted postures, and activities that raise intraocular pressure.',
      'Activity — Daily light mobility and balance work to prevent falls; stop activity if you notice new floaters, flashes, or visual dark spots.',
    ],
  };

  const handleDownloadReport = async () => {
    try {
      toast.loading('Generating PDF report...');

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Header
      pdf.setFillColor(37, 99, 235); // Primary blue
      pdf.rect(0, 0, pageWidth, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Diabetic Retinopathy Analysis Report', pageWidth / 2, 20, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Retinal Scan Analysis', pageWidth / 2, 30, { align: 'center' });

      yPosition = 50;

      // Report Date
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.text(`Report Generated: ${reportDate}`, margin, yPosition);
      yPosition += 15;

      // Diagnosis Section
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DIAGNOSIS', margin + 5, yPosition + 8);

      pdf.setFontSize(16);
      pdf.setTextColor(37, 99, 235);
      pdf.text(diagnosis, margin + 5, yPosition + 18);

      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Model Confidence: ${confidence.toFixed(1)}%`, margin + 5, yPosition + 28);

      yPosition += 45;

      // Risk Level Section
      const riskColors = {
        low: [34, 197, 94] as [number, number, number],     // Green
        moderate: [234, 179, 8] as [number, number, number], // Yellow
        high: [239, 68, 68] as [number, number, number]      // Red
      };
      const riskColor = riskColors[riskLevel];

      pdf.setFillColor(...riskColor);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`RISK LEVEL: ${currentRisk.label.toUpperCase()}`, margin + 5, yPosition + 8);

      yPosition += 20;

      // Recommendations
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const splitRecommendations = pdf.splitTextToSize(recommendations, pageWidth - 2 * margin - 10);
      pdf.text(splitRecommendations, margin + 5, yPosition);
      yPosition += splitRecommendations.length * 6 + 10;

      // Management Plan
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text('RECOMMENDED MANAGEMENT PLAN', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);

      prescriptions[riskLevel].forEach((prescription, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }

        // Numbering circle
        pdf.setFillColor(37, 99, 235);
        pdf.circle(margin + 3, yPosition + 2, 3, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text(`${index + 1}`, margin + 3, yPosition + 3, { align: 'center' });

        // Prescription text
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        const splitPrescription = pdf.splitTextToSize(prescription, pageWidth - 2 * margin - 15);
        pdf.text(splitPrescription, margin + 10, yPosition + 3);

        yPosition += Math.max(splitPrescription.length * 5, 8) + 3;
      });

      // Medical Disclaimer
      yPosition += 10;
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFillColor(255, 243, 224);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F');

      pdf.setTextColor(146, 64, 14);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('IMPORTANT MEDICAL NOTICE', margin + 5, yPosition + 8);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const disclaimer = 'This AI analysis is intended for screening purposes only and should not replace professional medical advice. Please consult with a qualified ophthalmologist or healthcare provider for a comprehensive diagnosis and treatment plan. Early detection and proper management are key to preserving your vision.';
      const splitDisclaimer = pdf.splitTextToSize(disclaimer, pageWidth - 2 * margin - 10);
      pdf.text(splitDisclaimer, margin + 5, yPosition + 16);

      // Footer
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.text('Retina Scan AI - Diabetic Retinopathy Detection System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('This report is confidential and intended for the patient and healthcare provider only.', pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Save PDF
      const fileName = `Retina_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.dismiss();
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF report. Please try again.');
    }
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
