import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const UserInfo = () => {
  const navigate = useNavigate();
  const { patientInfo, setPatientInfo } = useAppContext();
  const [formData, setFormData] = useState(patientInfo);
  const [errors, setErrors] = useState({ name: '', age: '', email: '' });

  const validateForm = () => {
    const newErrors = { name: '', age: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setPatientInfo(formData);
      toast.success('Information saved successfully!');
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <StepIndicator currentStep={1} totalSteps={4} stepLabel="Patient Information" />

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-border animate-scale-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Let's Get Started
            </h2>
            <p className="text-muted-foreground mb-8">
              Please provide your basic information to continue with the screening process.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`h-12 ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-foreground font-medium">
                  Age <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="35"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={`h-12 ${errors.age ? 'border-destructive' : ''}`}
                />
                {errors.age && (
                  <p className="text-sm text-destructive mt-1">{errors.age}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  className="w-full"
                >
                  Next: Questionnaire
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
