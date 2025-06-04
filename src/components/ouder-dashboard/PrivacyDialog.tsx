import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Eye, Database, Lock, UserCheck } from 'lucide-react';

interface PrivacyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyDialog = ({ isOpen, onClose }: PrivacyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="w-6 h-6 text-green-600" />
            Privacy & Dataverzameling Beleid
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-gray-700 bg-white">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <p className="font-semibold text-green-800">
              🔒 mAItje respecteert de privacy van uw kind en uw gezin. Deze informatie legt uit hoe we data verzamelen en gebruiken.
            </p>
          </div>

          {/* Welke data verzamelen we */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Welke Data Verzamelen We?</h3>
            </div>
            <div className="space-y-3 ml-7">
              <div>
                <h4 className="font-semibold text-gray-800">Accountgegevens:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>E-mailadres ouder/verzorger</li>
                  <li>Naam van het kind (alleen voornaam)</li>
                  <li>Schoolniveau (bijv. "Groep 5")</li>
                  <li>Leeftijdscategorie (geen exacte geboortedatum)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Leerdata:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Voortgang in oefeningen (scores, tijd besteed)</li>
                  <li>Moeilijkheidsgraad en aanpassingen</li>
                  <li>Interessegebieden en thema-voorkeuren</li>
                  <li>Interacties met mAItje hulpjes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Technische data:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>App-gebruik statistieken (anoniem)</li>
                  <li>Foutrapportages voor verbetering</li>
                  <li>Apparaat compatibiliteit informatie</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hoe gebruiken we data */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">Hoe Gebruiken We Uw Data?</h3>
            </div>
            <div className="space-y-3 ml-7">
              <div>
                <h4 className="font-semibold text-gray-800">Personalisatie:</h4>
                <p className="text-sm">We gebruiken leerdata om oefeningen aan te passen aan het niveau en de interesses van uw kind.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Voortgang Tracking:</h4>
                <p className="text-sm">We houden de leervorderingen bij om ouders inzicht te geven en het curriculum te optimaliseren.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">AI Verbetering:</h4>
                <p className="text-sm">Geanonimiseerde data helpt ons de AI-assistenten effectiever te maken voor alle kinderen.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Communicatie:</h4>
                <p className="text-sm">We gebruiken uw e-mailadres alleen voor belangrijke updates over uw kind's voortgang en app-verbeteringen.</p>
              </div>
            </div>
          </div>

          {/* Data beveiliging */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-bold text-gray-800">Hoe Beveiligen We Uw Data?</h3>
            </div>
            <div className="space-y-2 ml-7 text-sm">
              <p>🔐 <strong>Versleuteling:</strong> Alle data wordt versleuteld opgeslagen en verzonden</p>
              <p>🏰 <strong>Beveiligde servers:</strong> We gebruiken Supabase met enterprise-grade beveiliging</p>
              <p>🚫 <strong>Geen verkoop:</strong> We verkopen nooit persoonlijke data aan derden</p>
              <p>👥 <strong>Beperkte toegang:</strong> Alleen geautoriseerd personeel heeft toegang tot data</p>
              <p>🗑️ <strong>Data retentie:</strong> Inactieve accounts worden na 2 jaar automatisch verwijderd</p>
            </div>
          </div>

          {/* Uw rechten */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Uw Rechten (AVG/GDPR)</h3>
            </div>
            <div className="space-y-2 ml-7 text-sm">
              <p>📧 <strong>Inzage:</strong> Vraag een overzicht van al uw opgeslagen data</p>
              <p>✏️ <strong>Correctie:</strong> Laat onjuiste informatie corrigeren</p>
              <p>🗑️ <strong>Verwijdering:</strong> Verzoek volledige verwijdering van uw account en data</p>
              <p>📦 <strong>Data export:</strong> Download al uw data in een leesbaar formaat</p>
              <p>⏸️ <strong>Beperking:</strong> Beperk het gebruik van uw data voor bepaalde doeleinden</p>
              <p>🚫 <strong>Bezwaar:</strong> Maak bezwaar tegen bepaalde verwerkingen</p>
            </div>
          </div>

          {/* Contact voor privacy */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Privacy Vragen?</h4>
            <p className="text-sm text-blue-700">
              Voor vragen over privacy, data-inzage verzoeken, of het uitoefenen van uw rechten, 
              neem contact op via{' '}
              <a href="mailto:privacy@maitje.nl" className="font-semibold hover:underline">
                privacy@maitje.nl
              </a>
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Laatste update: 4 juni 2025 • Versie 1.0
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyDialog;
