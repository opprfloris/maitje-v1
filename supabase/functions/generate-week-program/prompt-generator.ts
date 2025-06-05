
import { formatTheme } from './theme-utils.ts';

interface PromptParams {
  kindGroep: number;
  moeilijkheidsgraad: string;
  timePerDay: number;
  subjects: Record<string, any>;
  theme?: string;
  isTestMode?: boolean;
}

export const generateSystemPrompt = (customPrompt: string | null, kindGroep: number, theme?: string): string => {
  const formattedTheme = formatTheme(theme || '');

  if (customPrompt) {
    return customPrompt;
  }

  return `Je bent een AI-assistent die weekprogramma's genereert voor Nederlandse basisschoolkinderen in groep ${kindGroep}. 

BELANGRIJKE TIJD REGELS:
- Elk onderdeel moet MINIMAAL 15 minuten duren
- Bereken aantal vragen op basis van tijd: ~2-3 minuten per vraag
- 15 min = 5-7 vragen, 30 min = 10-15 vragen, 45 min = 15-20 vragen

THEMA REGELS:
${formattedTheme ? `Het thema is: "${formattedTheme}"` : 'Geen specifiek thema'}

WELKE ONDERDELEN KRIJGEN THEMA:
✅ Thema toepassen op: Verhalen Rekenen, Begrijpend Lezen, Woordenschat, Engels Conversatie, Spelling in context
❌ GEEN thema op: Tafels, Breuken, Hoofdrekenen, Grammatica regels, Engels grammatica

ONDERWERPEN PER GROEP ${kindGroep}:
Rekenen: Tafels, Breuken, Hoofdrekenen, Verhalen Rekenen, Meetkunde
Taal: Begrijpend Lezen, Woordenschat, Spelling, Grammatica
Engels: Woordenschat, Conversatie, Luisteren

Genereer een weekprogramma (maandag t/m vrijdag) met realistische tijdsschattingen en juiste thema toepassing.`;
};

export const generateUserPrompt = (params: PromptParams): string => {
  const { kindGroep, moeilijkheidsgraad, timePerDay, subjects, theme, isTestMode } = params;
  const formattedTheme = formatTheme(theme || '');

  return `Genereer een weekprogramma voor groep ${kindGroep} met moeilijkheidsgraad "${moeilijkheidsgraad}".

Totale tijd per dag: ${timePerDay} minuten
Vakken: ${Object.entries(subjects).filter(([_, subject]) => subject.enabled).map(([key, _]) => key).join(', ')}
${formattedTheme ? `Thema: ${formattedTheme}` : ''}
${isTestMode ? '\n*** DIT IS EEN TEST GENERATIE - GEBRUIK EXTRA AANDACHT VOOR KWALITEIT ***' : ''}

Geef terug in deze exacte JSON structuur:
[
  {
    "dag": "Maandag",
    "oefeningen": [
      {
        "titel": "Titel van oefening",
        "type": "rekenen/taal/engels",
        "tijd": "15 min",
        "tijdInMinuten": 15,
        "beschrijving": "Korte beschrijving",
        "vragen": [
          {
            "vraag": "De vraag tekst",
            "antwoord": "Het juiste antwoord",
            "type": "multiple_choice/open/waar_onwaar",
            "opties": ["optie1", "optie2", "optie3", "optie4"] // alleen bij multiple_choice
          }
        ]
      }
    ]
  }
]

Zorg voor realistische tijdsschattingen en juiste thema toepassing!`;
};
