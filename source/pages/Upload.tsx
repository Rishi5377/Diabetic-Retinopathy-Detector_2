import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { Upload as UploadIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Upload = () => {
  const navigate = useNavigate();
  const { uploadedImage, setUploadedImage, setAnalysisResult } = useAppContext();
  const [imagePreview, setImagePreview] = useState<string | null>(
    uploadedImage ? URL.createObjectURL(uploadedImage) : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG or JPEG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadedImage(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    toast.success('Image uploaded successfully!');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    try {
      // Convert image to base64
      const fileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file);
        });
      };
      const base64 = await fileToBase64(uploadedImage);
      // Call backend API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: base64,
          mime_type: uploadedImage.type,
          preprocessing_method: 'rescale_1_255',
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.detail || `Prediction failed with status ${response.status}`);
      }
      const data = await response.json();
      // Map backend riskLevel to frontend
      const riskMap = {
        Low: 'low',
        Medium: 'moderate',
        High: 'high',
        Critical: 'high',
        Unknown: 'moderate',
      };
      setAnalysisResult({
        diagnosis: data.diagnosis,
        confidence: data.confidence,
        riskLevel: riskMap[data.riskLevel] || 'moderate',
        recommendations: data.recommendations,
      });
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
      navigate('/results');
    } catch (_err) {
      setIsAnalyzing(false);
      toast.error('Analysis failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <StepIndicator currentStep={3} totalSteps={4} stepLabel="Upload Retina Scan" />

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-border animate-scale-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Upload Your Retina Scan
            </h2>
            <p className="text-muted-foreground mb-8">
              Please upload a clear fundus photograph or retina scan image for AI analysis.
            </p>

            {/* Upload Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
                  ? 'border-primary bg-primary/5 scale-105'
                  : imagePreview
                    ? 'border-success bg-success/5'
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
            >
              {imagePreview ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="relative max-w-md mx-auto rounded-xl overflow-hidden shadow-md">
                    <img
                      src={imagePreview}
                      alt="Uploaded retina scan"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-success">
                    <ImageIcon className="w-5 h-5" />
                    <span className="font-medium">Image uploaded successfully</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setUploadedImage(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-primary/10">
                    <UploadIcon className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Drag & drop your image here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (PNG, JPEG • Max 10MB)
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Analyze Button */}
            <div className="mt-8">
              <Button
                variant="cta"
                size="lg"
                className="w-full"
                disabled={!uploadedImage || isAnalyzing}
                onClick={analyzeImage}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Analyzing Scan...
                  </>
                ) : (
                  <>
                    Analyze Scan
                  </>
                )}
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Tip:</strong> For best results, ensure the image is:
                well-lit, in focus, and shows the entire retina clearly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
