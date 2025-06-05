
import React from 'react';

interface PincodeModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  pincode: string;
  onPincodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  tipText: string;
}

const PincodeModal: React.FC<PincodeModalProps> = ({
  isOpen,
  title,
  description,
  pincode,
  onPincodeChange,
  onSubmit,
  onClose,
  tipText
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-nunito font-bold text-gray-800 mb-4">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        <form onSubmit={onSubmit}>
          <input
            type="password"
            value={pincode}
            onChange={(e) => onPincodeChange(e.target.value)}
            placeholder="Voer pincode in"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-center text-xl tracking-widest"
            maxLength={4}
            autoFocus
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex-1 p-3 bg-maitje-blue text-white rounded-lg hover:bg-maitje-blue/90"
            >
              Toegang
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">
          {tipText}
        </p>
      </div>
    </div>
  );
};

export default PincodeModal;
