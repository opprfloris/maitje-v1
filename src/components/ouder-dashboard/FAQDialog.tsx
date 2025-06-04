
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface FAQDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQDialog = ({ isOpen, onClose }: FAQDialogProps) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "Hoe werkt mAItje precies?",
      answer: "mAItje is een AI-gestuurde leer-app die gepersonaliseerde oefeningen genereert voor uw kind. De app past zich aan het niveau van uw kind aan en gebruikt interessante thema's om leren leuker te maken. Elk kind krijgt zijn eigen mAItje hulpje dat tips en aanmoediging geeft tijdens het leren."
    },
    {
      question: "Voor welke leeftijd is mAItje geschikt?",
      answer: "mAItje is ontworpen voor kinderen van 6-12 jaar (groep 3 t/m 8 van de basisschool). De app past automatisch de moeilijkheidsgraad aan op basis van het niveau van uw kind."
    },
    {
      question: "Welke vakken behandelt mAItje?",
      answer: "Momenteel richt mAItje zich op drie hoofdvakken: Rekenen (tafels, hoofdrekenen, getalbegrip), Lezen (begrijpend lezen, woordenschat), en Engels (basis woordenschat, zinnen). We werken aan uitbreiding naar andere vakken."
    },
    {
      question: "Hoe vaak moet mijn kind oefenen?",
      answer: "We raden 15-20 minuten per dag aan, verdeeld over 3-5 korte sessies. De app houdt bij hoeveel tijd uw kind besteedt en geeft aanbevelingen voor een gezond leerritme."
    },
    {
      question: "Hoe stelt mAItje het niveau van mijn kind vast?",
      answer: "Bij de eerste keer gebruik doet uw kind een korte level-test per vak. Daarna past de app continu het niveau aan op basis van de prestaties en voortgang. U kunt het startniveau ook handmatig instellen."
    },
    {
      question: "Wat gebeurt er met de gegevens van mijn kind?",
      answer: "We nemen privacy zeer serieus. Alle gegevens worden veilig en versleuteld opgeslagen. We delen nooit persoonlijke informatie met derden en u kunt altijd uw gegevens inzien of laten verwijderen. Zie ons Privacy Beleid voor meer details."
    },
    {
      question: "Kan ik meerdere kinderen toevoegen?",
      answer: "Momenteel ondersteunt één account één kind-profiel. Voor meerdere kinderen heeft u afzonderlijke accounts nodig. We werken aan een familie-account functie."
    },
    {
      question: "Wat kost mAItje?",
      answer: "mAItje biedt een gratis proefperiode van 2 weken. Daarna kunt u kiezen uit verschillende abonnementen: Basis (€9,99/maand), Familie (€16,99/maand voor 3 kinderen), of Jaarlijks (€89,99/jaar - 2 maanden gratis)."
    },
    {
      question: "Werkt mAItje offline?",
      answer: "Voor sommige oefeningen is een internetverbinding nodig (vooral voor AI-gegenereerde content). Veel basis-oefeningen werken ook offline. We werken aan betere offline-functionaliteit."
    },
    {
      question: "Kan ik de voortgang van mijn kind volgen?",
      answer: "Ja! In het Ouder Dashboard ziet u gedetailleerde statistieken, voortgangsgrafieken, en krijgt u wekelijkse rapporten. U kunt ook specifieke sterke en zwakke punten inzien."
    },
    {
      question: "Hoe kan ik thema's en interessegebieden instellen?",
      answer: "In het 'Kind & Instellingen' tabblad kunt u interessegebieden zoals 'Dinosaurussen', 'Ruimtevaart', of 'Sport' toevoegen. mAItje gebruikt deze om oefeningen interessanter te maken voor uw kind."
    },
    {
      question: "Wat zijn de mAItje hulpjes?",
      answer: "Dit zijn AI-assistenten met verschillende persoonlijkheden: Uli (vriendelijk en geduldig), Kiki (speels en energiek), Barry (grappig en enthousiast), en meer. Elk hulpje heeft zijn eigen aanpak om kinderen te motiveren."
    },
    {
      question: "Mijn kind vindt een oefening te moeilijk/makkelijk. Wat nu?",
      answer: "U kunt de moeilijkheidsgraad aanpassen in het Lesprogramma tabblad (Makkelijker/Op niveau/Uitdagend). De app leert ook automatisch van de prestaties en past zich aan."
    },
    {
      question: "Kan ik eigen oefeningen toevoegen?",
      answer: "Momenteel niet, maar we werken aan een functie waarmee ouders en leraren eigen content kunnen uploaden of voorstellen voor de AI om te gebruiken."
    },
    {
      question: "Werkt mAItje samen met school?",
      answer: "mAItje volgt het Nederlandse curriculum en kan een goede aanvulling zijn op schoolwerk. We werken aan integraties met populaire leermethoden."
    },
    {
      question: "Ik heb een technisch probleem. Wat nu?",
      answer: "Probeer eerst de app opnieuw te starten. Voor andere problemen kunt u een bug-rapport sturen via de 'Bug Rapporteren' knop in Tool & AI Instellingen, of mail naar support@maitje.nl."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="w-6 h-6 text-purple-600" />
            Veelgestelde Vragen (FAQ)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
            <p className="text-purple-800">
              💡 Vind snel antwoorden op de meest gestelde vragen over mAItje. Staat uw vraag er niet tussen? 
              Neem contact op via support@maitje.nl
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-800 pr-4">{item.question}</span>
                  {openItems.includes(index) ? (
                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <h4 className="font-semibold text-blue-800 mb-2">Nog meer vragen?</h4>
            <p className="text-sm text-blue-700">
              Ons support team helpt u graag verder! Stuur een e-mail naar{' '}
              <a href="mailto:support@maitje.nl" className="font-semibold hover:underline">
                support@maitje.nl
              </a>{' '}
              of gebruik de contact-functie in de app.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FAQDialog;
