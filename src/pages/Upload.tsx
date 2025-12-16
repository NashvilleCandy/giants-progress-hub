import React, { useState } from 'react';
import { mockProgressSteps } from '@/data/mockData';
import { 
  Upload as UploadIcon, 
  FileText, 
  Link as LinkIcon,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type SubmissionType = 'file' | 'text' | 'link';

const Upload: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<string>('');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('file');
  const [textContent, setTextContent] = useState('');
  const [linkContent, setLinkContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const pendingSteps = mockProgressSteps.filter(
    s => s.status === 'in-progress' || s.status === 'pending' || s.status === 'overdue'
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStep) {
      toast({
        title: "Error",
        description: "Please select a step to submit to.",
        variant: "destructive",
      });
      return;
    }

    if (submissionType === 'file' && !selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (submissionType === 'text' && !textContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter text content.",
        variant: "destructive",
      });
      return;
    }

    if (submissionType === 'link' && !linkContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a link.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    
    toast({
      title: "Submission Successful",
      description: "Your materials have been submitted for review.",
    });

    // Reset form
    setSelectedFile(null);
    setTextContent('');
    setLinkContent('');
    setSelectedStep('');
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Upload Materials
        </h1>
        <p className="text-muted-foreground">
          Submit files, text, or links for any step in your book journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Selection */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">1. Select Step</h2>
            <Select value={selectedStep} onValueChange={setSelectedStep}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a step to submit to..." />
              </SelectTrigger>
              <SelectContent>
                {pendingSteps.map((step) => (
                  <SelectItem key={step.id} value={step.id}>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'w-2 h-2 rounded-full',
                        step.status === 'in-progress' && 'bg-gold',
                        step.status === 'overdue' && 'bg-destructive',
                        step.status === 'pending' && 'bg-muted-foreground'
                      )} />
                      {step.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submission Type */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">2. Choose Submission Type</h2>
            <div className="flex gap-3">
              <Button
                variant={submissionType === 'file' ? 'default' : 'outline'}
                onClick={() => setSubmissionType('file')}
                className={cn(submissionType === 'file' && 'bg-gradient-premium')}
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                File Upload
              </Button>
              <Button
                variant={submissionType === 'text' ? 'default' : 'outline'}
                onClick={() => setSubmissionType('text')}
                className={cn(submissionType === 'text' && 'bg-gradient-premium')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Text
              </Button>
              <Button
                variant={submissionType === 'link' ? 'default' : 'outline'}
                onClick={() => setSubmissionType('link')}
                className={cn(submissionType === 'link' && 'bg-gradient-premium')}
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Link
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">3. Add Content</h2>

            {submissionType === 'file' && (
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                  dragActive ? 'border-gold bg-gold/5' : 'border-border',
                  selectedFile && 'border-success bg-success/5'
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <Check className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFile}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-1">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
            )}

            {submissionType === 'text' && (
              <Textarea
                placeholder="Enter your content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[200px]"
              />
            )}

            {submissionType === 'link' && (
              <Input
                type="url"
                placeholder="https://..."
                value={linkContent}
                onChange={(e) => setLinkContent(e.target.value)}
              />
            )}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isUploading}
            className="w-full bg-gradient-premium hover:opacity-90 h-12 text-lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5 mr-2" />
                Submit Materials
              </>
            )}
          </Button>
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">Accepted Formats</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Documents: PDF, DOCX, DOC</li>
              <li>• Images: JPG, PNG, HEIC</li>
              <li>• Audio: MP3, WAV, M4A</li>
              <li>• Archives: ZIP</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">Submission Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use high-resolution images (300 DPI minimum)</li>
              <li>• Name files clearly (e.g., "Chapter1_Draft.docx")</li>
              <li>• Double-check content before submitting</li>
              <li>• Allow 24-48 hours for review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
