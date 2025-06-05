
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AIDocument } from '@/types/database';
import { toast } from 'sonner';
import { Upload, FileText, Search, Tag, Trash2, Download } from 'lucide-react';

const DocumentLibraryTab = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AIDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('algemeen');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading documents:', error);
        toast.error('Fout bij laden documenten');
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Fout bij laden documenten');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !documentName || !user) {
      toast.error('Vul alle verplichte velden in');
      return;
    }

    setUploading(true);
    try {
      // For now, we'll just store the document metadata
      // In a real implementation, you'd upload the file to Supabase Storage
      const fileType = uploadFile.type || uploadFile.name.split('.').pop() || 'unknown';
      const filePath = `documents/${user.id}/${Date.now()}_${uploadFile.name}`;

      const { error } = await supabase
        .from('ai_documents')
        .insert({
          user_id: user.id,
          document_name: documentName,
          document_type: fileType,
          file_path: filePath,
          subject_category: category,
          description: description,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });

      if (error) {
        console.error('Error uploading document:', error);
        toast.error('Fout bij uploaden document');
        return;
      }

      toast.success('Document succesvol geüpload');
      
      // Reset form
      setUploadFile(null);
      setDocumentName('');
      setDescription('');
      setCategory('algemeen');
      setTags('');
      
      // Reload documents
      await loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Fout bij uploaden document');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Weet je zeker dat je dit document wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('ai_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Error deleting document:', error);
        toast.error('Fout bij verwijderen document');
        return;
      }

      toast.success('Document verwijderd');
      await loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Fout bij verwijderen document');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.subject_category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'algemeen', label: 'Algemeen' },
    { value: 'rekenen', label: 'Rekenen' },
    { value: 'taal', label: 'Taal' },
    { value: 'engels', label: 'Engels' }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Documenten laden...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-maitje-blue" />
            Document Uploaden
          </CardTitle>
          <CardDescription>
            Upload PDF's, Word documenten of tekstbestanden als inspiratie voor AI prompt generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Bestand *</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setUploadFile(file || null);
                  if (file && !documentName) {
                    setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-name">Document Naam *</Label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Bijv. Rekenen Groep 5 Werkbladen"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (komma gescheiden)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tafels, groep5, moeilijk"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschrijving</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Korte beschrijving van wat dit document bevat en hoe het gebruikt kan worden..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleFileUpload}
            disabled={uploading || !uploadFile || !documentName}
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploaden...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Document Uploaden
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Documents Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-maitje-blue" />
            Document Library ({filteredDocuments.length})
          </CardTitle>
          <CardDescription>
            Beheer je geüploade documenten die gebruikt worden voor AI inspiratie.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Zoek documenten..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Documents List */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Geen documenten gevonden</p>
              <p className="text-sm">Upload je eerste document om te beginnen</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate flex-1">
                        {doc.document_name}
                      </h3>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{doc.subject_category}</Badge>
                      <Badge variant="outline">{doc.document_type}</Badge>
                    </div>

                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {doc.description}
                      </p>
                    )}

                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Geüpload: {new Date(doc.created_at).toLocaleDateString('nl-NL')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentLibraryTab;
