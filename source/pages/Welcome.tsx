import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, ClipboardList, Upload, FileText } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: ClipboardList,
      title: 'Patient Information',
      description: 'Share your basic details',
    },
    {
      icon: Eye,
      title: 'Health Questionnaire',
      description: 'Answer quick vision & diabetes questions',
    },
    {
      icon: Upload,
      title: 'Upload Retina Scan',
      description: 'Submit your fundus image',
    },
    {
      icon: FileText,
      title: 'Get Results',
      description: 'Receive AI-powered diagnosis',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 animate-scale-in shadow-glow">
          <Eye className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          <span className="text-primary">Diabetic Retinopathy</span>
          <br />
          Detection
          <span className="text-xs text-muted-foreground ml-2">(v2025-10-22)</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-delay">
          Early detection of diabetic retinopathy using advanced AI analysis.
          Get your results in minutes with our professional diagnostic system.
        </p>

        {/* 4-Step Process */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 animate-scale-in">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-12 animate-slide-up">
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate('/user-info')}
            className="text-lg px-12"
          >
            Get Started
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto mt-8 pt-8 border-t border-border animate-fade-in-delay">
          <strong>Medical Disclaimer:</strong> This tool is for educational and screening purposes only.
          Always consult with a qualified healthcare professional for diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
