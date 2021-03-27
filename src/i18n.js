import i18n from 'i18next';
import LanguageDetector from "i18next-browser-languagedetector";

export let numberFormat;
const FALLBACK = 'en';

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          'New Cases': 'New Cases',
          'Confirmed Cases': 'Confirmed Cases',
          'Deaths': 'Deaths',
          'Recovered': 'Recovered',
          'Global': 'Global',
        },
      },
      es: {
        translations: {
          'Loading': 'Cargando',
          'Panel Setup': 'Configuración',
          'Your Digital Signage Panel URL': 'Su URL del panel de señalización digital',
          'Duration per Country/Place': 'Duración por país / lugar',
          'Seconds': 'Segundos',
          'this only applies if you select more than 1 country/place': 'esto solo se aplica si selecciona más de 1 país / lugar',
          'Countries/Places': 'Países/Lugares',
          'Select All': 'Seleccionar todo',
          'Select None': 'No seleccionar ninguno',
          'Copy to Clipboard': 'Copiar al Clipboard',
          'Open': 'Abrir',

          'New Cases': 'Nuevos Casos',
          'Confirmed Cases': 'Casos Confirmados',
          'Deaths': 'Muertes',
          'Recovered': 'Recuperados',
          'Global': 'Global',
        },
      },
      de: {
        translations: {
          'New Cases': 'Neue Fälle',
          'Confirmed Cases': 'Bestätigte Fälle',
          'Deaths': 'Todesfälle',
          'Recovered': 'Wiederhergestellt',
          'Global': 'Global',
        },
      },
      nl: {
        translations: {
          'New Cases': 'Nieuwe gevallen',
          'Confirmed Cases': 'Bevestigde gevallen',
          'Deaths': 'Sterfgevallen',
          'Recovered': 'Hersteld',
          'Global': 'Globaal',
        },
      },
      pt: {
        translations: {
          'Loading': 'Carregando',
          'Panel Setup': 'Configurações',
          'Your Digital Signage Panel URL': 'Sua URL para Sinalização Digital',
          'Duration per Country/Place': 'Duração por País/Local',
          'Seconds': 'Segundos',
          'this only applies if you select more than 1 country/place': 'somente aplicável se você selecionar mais de 1 país/local',
          'Countries/Places': 'Países/Locais',
          'Select All': 'Selecionar Todos',
          'Select None': 'Selecionar Nenhum',
          'Copy to Clipboard': 'Copiar para a Área de transferência',
          'Open': 'Abrir',
          'New Cases': 'Novos Casos',
          'Confirmed Cases': 'Casos Confirmados',
          'Deaths': 'Mortes',
          'Recovered': 'Recuperados',
          'Global': 'Global',
        },
      },
    },
    fallbackLng: FALLBACK,
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ",",
    },

    react: {
      wait: true
    },
  }, () => {
    const [language] = i18n.language.split('_');
    numberFormat = new Intl.NumberFormat(language || FALLBACK);
  });

export default i18n;