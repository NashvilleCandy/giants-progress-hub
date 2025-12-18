import React, { useState } from 'react';
import { getDocuments } from '@/data/ghlClientData';
import { format } from 'date-fns';
import { 
  FileText, 
  Download, 
  Search,
  Filter,
  Eye,
  File,
  FileImage,
  FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// GHL Data - document URLs come from {{contact.doc_xxx_url}} when deployed
const allDocuments = getDocuments();

const Documents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredDocs = allDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'chapter':
        return FileText;
      case 'proof':
      case 'layout':
        return FileImage;
      case 'contract':
        return FileCheck;
      default:
        return File;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'chapter':
        return 'bg-blue-500/10 text-blue-600';
      case 'proof':
        return 'bg-gold/10 text-gold-dark';
      case 'layout':
        return 'bg-purple-500/10 text-purple-600';
      case 'contract':
        return 'bg-giants-red/10 text-giants-red';
      case 'final':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleDownload = (doc: typeof allDocuments[0]) => {
    toast({
      title: "Downloading",
      description: `Starting download for ${doc.name}`,
    });
  };

  const handlePreview = (doc: typeof allDocuments[0]) => {
    toast({
      title: "Preview",
      description: `Opening preview for ${doc.name}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          My Documents
        </h1>
        <p className="text-muted-foreground">
          Access all your book-related documents. Download or view files shared by the GIANTS team.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="chapter">Chapters</SelectItem>
            <SelectItem value="proof">Proofs</SelectItem>
            <SelectItem value="layout">Layout</SelectItem>
            <SelectItem value="contract">Contracts</SelectItem>
            <SelectItem value="final">Final Files</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents list */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredDocs.map((doc) => {
              const Icon = getFileIcon(doc.type);
              return (
                <div 
                  key={doc.id}
                  className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  {/* Icon */}
                  <div className="p-3 rounded-lg bg-muted">
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full capitalize',
                        getTypeBadgeColor(doc.type)
                      )}>
                        {doc.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(doc.uploadedAt, 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {doc.fileSize}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        From: {doc.uploadedBy === 'admin' ? 'GIANTS Team' : 'You'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handlePreview(doc)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Storage info */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Storage Used</span>
          <span className="text-sm font-medium text-foreground">6.5 MB of 500 MB</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gold h-2 rounded-full"
            style={{ width: '1.3%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Documents;
