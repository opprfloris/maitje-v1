
import React, { useState } from 'react';
import { Upload, FileText, Image, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';

interface FileUploaderProps {
  subject: string;
  onAnalysisComplete: (exercises: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ subject, onAnalysisComplete }) => {
  const { uploading, analyzing, uploadFile, analyzeWithAI } = useFileUpload();
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [exerciseLength, setExerciseLength] = useState(10);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Alleen PDF en JPG bestanden zijn toegestaan');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Bestand is te groot. Maximaal 10MB toegestaan.');
      return;
    }

    const result = await uploadFile(file, subject);
    if (result) {
      setUploadedFile(result);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    const exercises = await analyzeWithAI(uploadedFile.id, exerciseLength);
    if (exercises.length > 0) {
      onAnalysisComplete(exercises);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-nunito font-bold text-gray-800 mb-2">
          Upload Voorbeeldoefening
        </h3>
        <p className="text-gray-600">
          Upload een PDF of JPG bestand en laat AI een vergelijkbare oefening maken
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-maitje-blue bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-maitje-blue animate-spin mb-4" />
            <p className="text-gray-600">Bestand uploaden...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center">
            {uploadedFile.file_type.includes('pdf') ? (
              <FileText className="w-12 h-12 text-red-500 mb-4" />
            ) : (
              <Image className="w-12 h-12 text-blue-500 mb-4" />
            )}
            <p className="font-semibold text-gray-800">{uploadedFile.file_name}</p>
            <p className="text-sm text-gray-600">Bestand geüpload!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Sleep een bestand hierheen of klik om te selecteren
            </p>
            <p className="text-sm text-gray-500">
              PDF of JPG, max 10MB
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="mt-4 bg-maitje-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Selecteer Bestand
            </label>
          </div>
        )}
      </div>

      {/* Exercise Length Settings */}
      {uploadedFile && (
        <div className="bg-gray-50 p-6 rounded-xl">
          <h4 className="font-nunito font-bold text-gray-800 mb-4">Oefening Instellingen</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aantal vragen: {exerciseLength}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={exerciseLength}
              onChange={(e) => setExerciseLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 vragen</span>
              <span>30 vragen</span>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI analyseert bestand...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Genereer Vergelijkbare Oefening
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
