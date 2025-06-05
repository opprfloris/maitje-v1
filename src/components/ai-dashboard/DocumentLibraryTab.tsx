
import React, { useState } from 'react';
import { Upload, FileText, Search, Download, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const DocumentLibraryTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  // Mock documents data
  const [documents] = useState([
    {
      id: '1',
      name: 'Nederlandse Curriculum Richtlijnen.pdf',
      type: 'curriculum',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Rekenen Methode Groep 5.pdf',
      type: 'methode',
      size: '5.1 MB',
      uploadDate: '2024-01-12',
      status: 'active'
    },
    {
      id: '3',
      name: 'Begrijpend Lezen Voorbeelden.docx',
      type: 'voorbeelden',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
      status: 'draft'
    }
  ]);

  const handleFileUpload = async () => {
    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Document succesvol geüpload');
    } catch (error) {
      toast.error('Fout bij uploaden document');
    } finally {
      setUploading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'curriculum': return 'bg-blue-100 text-blue-800';
      case 'methode': return 'bg-green-100 text-green-800';
      case 'voorbeelden': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-maitje-green rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-nunito font-bold text-gray-800">Document Library</h2>
            <p className="text-gray-600">Beheer documenten die gebruikt worden voor AI context</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Zoek documenten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleFileUpload}
            disabled={uploading}
            className="maitje-button flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Document Toevoegen
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status === 'active' ? 'Actief' : 'Concept'}
                      </Badge>
                      <span className="text-xs text-gray-500">{doc.size}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{doc.uploadDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Geen documenten gevonden</p>
            <p className="text-sm text-gray-500">Upload documenten om te beginnen</p>
          </div>
        )}
      </div>

      <div className="maitje-card">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-maitje-blue" />
          Ondersteunde Bestandstypen
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl mb-2">📄</div>
            <p className="text-sm font-semibold text-blue-800">PDF</p>
            <p className="text-xs text-blue-600">Lesmateriaal</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm font-semibold text-green-800">DOCX</p>
            <p className="text-xs text-green-600">Documenten</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-semibold text-purple-800">XLSX</p>
            <p className="text-xs text-purple-600">Spreadsheets</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm font-semibold text-orange-800">TXT</p>
            <p className="text-xs text-orange-600">Tekst bestanden</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentLibraryTab;
