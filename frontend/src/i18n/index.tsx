import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "mr";
export type UnitSystem = "tonnes_ha" | "quintals_acre";

interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const translations: TranslationDictionary = {
  // Navigation (Clean Farmer-First Navbar)
  navMyFarm: { en: "My Farm", hi: "मेरा खेत", mr: "माझे शेत" },
  navMyCrop: { en: "My Crop", hi: "मेरी फसल", mr: "माझे पीक" },
  navWhatShouldIDo: { en: "What Should I Do?", hi: "मुझे क्या करना चाहिए?", mr: "मी काय करावे?" },
  navPastRecords: { en: "Past Records", hi: "पिछला रिकॉर्ड", mr: "मागील नोंदी" },
  navWhatIf: { en: "What If?", hi: "अगर ऐसा करें तो?", mr: "असे केल्यास काय होईल?" },
  navOpenMyFarm: { en: "Open My Farm", hi: "मेरा खेत खोलें", mr: "माझे शेत उघडा" },
  
  // Auth & Profile Navigation
  authLogin: { en: "Login", hi: "लॉग इन", mr: "लॉग इन" },
  authSignUp: { en: "Sign Up", hi: "साइन अप", mr: "साइन अप" },
  myProfile: { en: "My Profile", hi: "मेरी प्रोफ़ाइल", mr: "माझी प्रोफाइल" },
  myFarm: { en: "My Farm", hi: "मेरा खेत", mr: "माझे शेत" },
  farmSettings: { en: "Farm Settings", hi: "खेत की जानकारी", mr: "शेताची माहिती" },
  logOut: { en: "Log out", hi: "लॉग आउट", mr: "लॉग आउट" },
  exploreDemoFarm: { en: "Explore Demo Farm", hi: "डेमो खेत देखें", mr: "डेमो शेत पाहा" },
  completeProfile: { en: "Complete Profile", hi: "प्रोफ़ाइल पूरी करें", mr: "प्रोफाइल पूर्ण करा" },
  edit: { en: "Edit", hi: "बदलें", mr: "संपादित करा" },
  saveChanges: { en: "Save Changes", hi: "बदलाव सहेजें", mr: "बदल जतन करा" },
  finishSetup: { en: "Finish Setup", hi: "सेटअप पूरा करें", mr: "सेटअप पूर्ण करा" },
  back: { en: "Back", hi: "पीछे", mr: "मागे" },
  continue: { en: "Continue", hi: "आगे बढ़ें", mr: "पुढे जा" },
  welcomeBack: { en: "Welcome back", hi: "स्वागत है", mr: "पुन्हा स्वागत आहे" },
  signInSubtitle: { en: "Sign in to continue to your farm.", hi: "अपने खेत को देखने के लिए साइन इन करें।", mr: "तुमच्या शेतामध्ये सुरू ठेवण्यासाठी साइन इन करा." },
  createAccount: { en: "Create your farm account", hi: "अपना किसान खाता बनाएं", mr: "तुमचे शेतकरी खाते तयार करा" },
  createAccountSubtitle: { en: "Set up your profile to start managing your farm.", hi: "अपने खेत का डिजिटल ट्विन शुरू करने के लिए प्रोफ़ाइल सेट करें।", mr: "आपल्या शेताचे व्यवस्थापन सुरू करण्यासाठी प्रोफाइल सेट करा." },
  
  // Dashboard & Farmer Greetings
  greetingMorning: { en: "Good morning", hi: "नमस्ते", mr: "नमस्कार" },
  howIsCropToday: { en: "How is your sugarcane today?", hi: "आज आपकी गन्ने की फसल कैसी है?", mr: "आज तुमच्या उसाचे पीक कसे आहे?" },
  demoBadge: { en: "Demo Farm — Maharashtra", hi: "डेमो शेत — महाराष्ट्र", mr: "डेमो शेती — महाराष्ट्र" },
  farmerLocation: { en: "Kasba Bawada, Karveer, Kolhapur", hi: "कसबा बावडा, करवीर, कोल्हापूर", mr: "कसबा बावडा, करवीर, कोल्हापूर" },
  
  // Core Farmer Cards
  cardCropStatus: { en: "Crop Condition", hi: "फसल की स्थिति", mr: "पिकाची स्थिती" },
  cardWaterStatus: { en: "Water", hi: "पानी", mr: "पाणी" },
  cardSoilStatus: { en: "My Soil", hi: "मेरी मिट्टी", mr: "माझी माती" },
  cardExpectedCrop: { en: "Expected Crop", hi: "अनुमानित उपज", mr: "अंदाजे उत्पादन" },
  cardThingsToCheck: { en: "Things to Check", hi: "ध्यान देने वाली बातें", mr: "लक्ष देण्याच्या गोष्टी" },
  basedOnFarmInfo: { en: "Based on farm inputs", hi: "खेत की जानकारी पर आधारित", mr: "शेताच्या माहितीवर आधारित" },
  whatShouldIDoSubtitle: { en: "Simple actions you can take right now.", hi: "सीधे काम जो आप अभी कर सकते हैं।", mr: "तुम्ही आत्ता करू शकता अशा सोप्या कृती." },
  
  // Simple Values
  valGood: { en: "Good", hi: "अच्छी", mr: "उत्तम" },
  valAdequate: { en: "Adequate", hi: "पर्याप्त", mr: "पुरेसे" },
  valCheck: { en: "Check", hi: "जाँचें", mr: "तपासा" },
  valNeedsAttention: { en: "Needs Attention", hi: "ध्यान दें", mr: "लक्ष द्या" },
  valLowRisk: { en: "Normal", hi: "सामान्य", mr: "सामान्य" },
  valModerateRisk: { en: "Check", hi: "जाँच करें", mr: "तपासा" },
  
  // Section Headers
  sectionWhatShouldIDo: { en: "What Should I Do?", hi: "मुझे क्या करना चाहिए?", mr: "मी काय करावे?" },
  sectionThingsToCheck: { en: "Things to Check", hi: "ध्यान देने वाली बातें", mr: "लक्ष देण्याच्या गोष्टी" },
  sectionFarmDetails: { en: "Your Sugarcane Plots", hi: "आपके गन्ने के खेत", mr: "तुमचे उसाचे प्लॉट" },
  
  // My Crop (Crop Health Page)
  myCropTitle: { en: "How is My Crop?", hi: "मेरी फसल कैसी है?", mr: "माझे पीक कसे आहे?" },
  myCropSubtitle: { en: "Simple overview of your sugarcane growth, greenness and water.", hi: "आपकी गन्ने की बढ़त, हरियाली और पानी की सीधी जानकारी।", mr: "तुमच्या उसाची वाढ, हिरवेपणा आणि पाण्याची माहिती." },
  cropGreenness: { en: "Crop Greenness", hi: "फसल की हरियाली", mr: "पिकाचा हिरवेपणा" },
  cropGrowth: { en: "Crop Growth", hi: "फसल की बढ़त", mr: "पिकाची वाढ" },
  waterCondition: { en: "Water Condition", hi: "पानी की स्थिति", mr: "पाण्याची स्थिती" },
  sunlightWeather: { en: "Sunlight & Weather", hi: "धूप और मौसम", mr: "ऊन आणि हवामान" },
  cropStage: { en: "Crop Stage", hi: "फसल की अवस्था", mr: "पिकाची अवस्था" },
  
  stageGrandGrowth: { en: "Grand Growth (Stalk forming)", hi: "तेज बढ़त (गन्ना बनने की अवस्था)", mr: "मोठी वाढ (कांड्या भरण्याची अवस्था)" },
  stageTillering: { en: "Tillering (Shoots emerging)", hi: "कल्ले फूटने की अवस्था", mr: "फुटवे फुटण्याची अवस्था" },
  stageGermination: { en: "Germination (Sprouting)", hi: "अंकुरण अवस्था", mr: "उगवण अवस्था" },
  stageRipening: { en: "Ripening (Sugar building)", hi: "पकाई व मिठास अवस्था", mr: "पक्वता व साखर भरण्याची अवस्था" },

  // Expected Crop (Yield Page)
  expectedCropTitle: { en: "Expected Crop", hi: "अनुमानित उपज", mr: "अंदाजे उत्पादन" },
  expectedCropSubtitle: { en: "Based on the information you entered for your sugarcane farm.", hi: "आपके खेत की जानकारी के आधार पर अनुमान।", mr: "तुमच्या शेतीच्या माहितीवर आधारित अंदाज." },
  whyEstimateChanging: { en: "Why is this estimate changing?", hi: "यह अनुमान किस आधार पर है?", mr: "हा अंदाज कशावर आधारित आहे?" },
  notAGuarantee: { en: "This is a model estimate based on your inputs, not a guarantee.", hi: "यह आपकी जानकारी पर आधारित एक अनुमान है, पक्की गारंटी नहीं।", mr: "हा तुमच्या माहितीवर आधारित अंदाज आहे, पक्की हमी नाही." },
  
  factorRain: { en: "Rain", hi: "बारिश", mr: "पाऊस" },
  factorWater: { en: "Water Schedule", hi: "पानी देने का समय", mr: "पाणी देण्याची वेळ" },
  factorSoil: { en: "Soil Nutrients", hi: "मिट्टी के पोषक तत्व", mr: "मातीतील खते" },
  factorTemp: { en: "Temperature", hi: "तापमान", mr: "तापमान" },
  factorPest: { en: "Pest Control", hi: "कीट नियंत्रण", mr: "कीड नियंत्रण" },
  factorVariety: { en: "Sugarcane Variety", hi: "गन्ने की किस्म", mr: "उसाचा वाण" },

  // What-If Screen
  whatIfTitle: { en: "What If?", hi: "अगर ऐसा करें तो?", mr: "असे केल्यास काय होईल?" },
  whatIfSubtitle: { en: "See what may happen if you change something on your farm.", hi: "कुछ बदलकर देखें कि मॉडल क्या अनुमान देता है।", mr: "काही बदलून मॉडेल काय अंदाज देते ते पहा." },
  whatToChange: { en: "WHAT DO YOU WANT TO CHANGE?", hi: "आप क्या बदलना चाहते हैं?", mr: "तुम्हाला काय बदलायचे आहे?" },
  
  optWater: { en: "💧 Water", hi: "💧 पानी", mr: "💧 पाणी" },
  optRain: { en: "🌧 Rain", hi: "🌧 बारिश", mr: "🌧 पाऊस" },
  optSoil: { en: "🌱 Soil", hi: "🌱 मिट्टी", mr: "🌱 माती" },
  optDuration: { en: "🌾 Crop Duration", hi: "🌾 फसल की अवधि", mr: "🌾 पिकाचा कालावधी" },
  optPest: { en: "🐛 Pest Control", hi: "🐛 कीट नियंत्रण", mr: "🐛 कीड नियंत्रण" },
  optTemp: { en: "🌡 Temperature", hi: "🌡 तापमान", mr: "🌡 तापमान" },
  optSunlight: { en: "☀️ Sunlight", hi: "☀️ धूप", mr: "☀️ सूर्यप्रकाश" },
  
  currentEstimate: { en: "CURRENT ESTIMATE", hi: "वर्तमान अनुमान", mr: "सध्याचा अंदाज" },
  newEstimate: { en: "NEW ESTIMATE", hi: "नया अनुमान", mr: "नवीन अंदाज" },
  changeLabel: { en: "CHANGE", hi: "बदलाव", mr: "बदल" },
  seeResult: { en: "See Result", hi: "परिणाम देखें", mr: "निकाल पहा" },
  tryAnotherOption: { en: "Try Another Option", hi: "दूसरा विकल्प देखें", mr: "दुसरा पर्याय पहा" },
  modelEstimateNote: { en: "The model estimates a change in your expected crop based on this setting.", hi: "मॉडल के अनुसार इस बदलाव से आपकी अनुमानित उपज बदल सकती है।", mr: "मॉडेलनुसार या बदलामुळे अंदाजे उत्पादनात फरक पडू शकतो." },
  
  // Water What-If Options
  waterTimes1: { en: "1 time a week", hi: "हफ्ते में 1 बार", mr: "आठवड्यातून १ वेळा" },
  waterTimes2: { en: "2 times a week", hi: "हफ्ते में 2 बार", mr: "आठवड्यातून २ वेळा" },
  waterTimes3: { en: "3 times a week", hi: "हफ्ते में 3 बार", mr: "आठवड्यातून ३ वेळा" },
  waterDailyDrip: { en: "Daily Drip", hi: "रोज ड्रिप से", mr: "दररोज ठिबक" },

  // Soil Explanations
  soilNitrogen: { en: "Nitrogen", hi: "नाइट्रोजन", mr: "नायट्रोजन" },
  soilNitrogenDesc: { en: "Helps the crop grow green and tall.", hi: "फसल की बढ़त और हरियाली में मदद करता है।", mr: "उसाची वाढ आणि हिरवेपणा वाढवण्यास मदत करते." },
  soilPhosphorus: { en: "Phosphorus", hi: "फास्फोरस", mr: "फॉस्फरस" },
  soilPhosphorusDesc: { en: "Helps roots stay deep and strong.", hi: "जड़ों को मजबूत और गहरा बनाने में मदद करता है।", mr: "मुळे मजबूत आणि खोल रुजण्यास मदत करते." },
  soilPotassium: { en: "Potassium", hi: "पोटाश", mr: "पोटॅश" },
  soilPotassiumDesc: { en: "Helps the sugarcane stay thick and sweet.", hi: "गन्ने को मोटा, मजबूत और मीठा रखने में मदद करता है।", mr: "ऊस जाड, मजबूत आणि रसाळ ठेवण्यास मदत करते." },

  // What Should I Do (Action Cards)
  actionWaterTitle: { en: "Check your water schedule.", hi: "पानी देने का समय जाँचें।", mr: "पाणी देण्याची वेळ तपासा." },
  actionWaterWhy: { en: "Soil moisture is dipping below optimal level in Plot 4.", hi: "प्लॉट 4 में मिट्टी की नमी कम हो रही है।", mr: "प्लॉट 4 मध्ये मातीतील ओलावा कमी होत आहे." },
  actionWaterCheck: { en: "Inspect drip lines and check if 2-3 weekly rounds are needed.", hi: "ड्रिप पाइप देखें और हफ्ते में 2-3 बार पानी दें।", mr: "ठिबक सिंचन तपासा आणि आठवड्यातून २-३ वेळा पाणी द्या." },
  
  actionSoilTitle: { en: "Check your soil nutrients.", hi: "मिट्टी के पोषक तत्व जाँचें।", mr: "मातीतील खते तपासा." },
  actionSoilWhy: { en: "Nitrogen is slightly low for the fast-growing Grand Growth stage.", hi: "तेज बढ़त अवस्था के लिए नाइट्रोजन थोड़ा कम है।", mr: "मोठ्या वाढीच्या टप्प्यासाठी नायट्रोजन थोडे कमी आहे." },
  actionSoilCheck: { en: "Consult your local sugar factory or Krishi Kendra for nitrogen top-dressing.", hi: "स्थानीय चीनी मिल या कृषि केंद्र से यूरिया/नाइट्रोजन के बारे में सलाह लें।", mr: "स्थानिक साखर कारखाना किंवा कृषी केंद्राकडून युरिया/खताबाबत सल्ला घ्या." },
  
  actionPestTitle: { en: "Check crop for pests.", hi: "फसल में कीट तो नहीं हैं, देखें।", mr: "पिकावर कीड आहे का ते पहा." },
  actionPestWhy: { en: "Humid weather may increase risk of early shoot borer or white grubs.", hi: "नमी वाले मौसम में तना छेदक कीट या सफेद लट का असर हो सकता है।", mr: "दमट हवेत खोड कीड किंवा हुमणीचा प्रादुर्भाव होऊ शकतो." },
  actionPestCheck: { en: "Inspect lower stalks and leaf undersides for any sign of pest activity.", hi: "पौधों के निचले तने और पत्तियों के नीचे ध्यान से देखें।", mr: "खोडाचा खालचा भाग आणि पानांखाली काळजीपूर्वक तपासा." },

  actionWhyLabel: { en: "WHY?", hi: "क्यों?", mr: "का?" },
  actionCheckLabel: { en: "WHAT TO CHECK?", hi: "क्या जाँचें?", mr: "काय तपासावे?" },

  // Past Records
  pastRecordsTitle: { en: "Past Records", hi: "पिछला रिकॉर्ड", mr: "मागील नोंदी" },
  pastRecordsSubtitle: { en: "Track previous crop estimates and changes over time.", hi: "समय के साथ अपने खेत में हुए बदलाव और उपज का रिकॉर्ड।", mr: "काळानुरूप शेतीतील बदल आणि उत्पादनाचा इतिहास." },
  demoRecordsNotice: { en: "Demo Records (Kolhapur Sugar Belt)", hi: "डेमो रिकॉर्ड (कोल्हापूर)", mr: "डेमो नोंदी (कोल्हापूर)" },

  // Common UI Actions
  btnSave: { en: "Save", hi: "सेव करें", mr: "जतन करा" },
  btnNext: { en: "Next", hi: "आगे", mr: "पुढे" },
  btnBack: { en: "Back", hi: "पीछे", mr: "मागे" },
  btnChange: { en: "Change", hi: "बदलें", mr: "बदला" },
  btnCheck: { en: "Check", hi: "जाँचें", mr: "तपासा" },
  btnRecalculate: { en: "Check Again", hi: "दोबारा जाँचें", mr: "पुन्हा तपासा" },
  btnSeeMore: { en: "See More", hi: "और देखें", mr: "अधिक पहा" },

  // Units
  tonnesPerHa: { en: "tonnes/ha", hi: "टन/हेक्टर", mr: "टन/हेक्टर" },
  quintalsPerAcre: { en: "quintals/acre", hi: "क्विंटल/एकड़", mr: "क्विंटल/एकर" },
  acres: { en: "Acres", hi: "एकड़", mr: "एकर" },
  hectares: { en: "Hectares", hi: "हेक्टर", mr: "हेक्टर" },

  // Map & Field Labels
  fieldStatusHealthy: { en: "Healthy", hi: "अच्छी स्थिति", mr: "चांगली स्थिती" },
  fieldStatusGood: { en: "Good", hi: "उत्कृष्ट", mr: "उत्तम" },
  fieldStatusAttention: { en: "Needs Attention", hi: "ध्यान दें", mr: "लक्ष द्या" },
  fieldLabel: { en: "Field", hi: "खेत", mr: "शेत" },
  plotLabel: { en: "Plot", hi: "प्लॉट", mr: "प्लॉट" },
  sugarcaneCrop: { en: "Sugarcane", hi: "गन्ना", mr: "ऊस" },
  standardPlotLegend: { en: "Standard Plot", hi: "सामान्य खेत", mr: "सामान्य शेत" },
  attentionPlotLegend: { en: "Attention Plot", hi: "ध्यान देने योग्य खेत", mr: "लक्ष देण्यासारखे शेत" },
  demoFarmMaharashtra: { en: "Demo Farm — Maharashtra", hi: "डेमो खेत — महाराष्ट्र", mr: "डेमो शेत — महाराष्ट्र" },
  demoFieldBoundaries: { en: "Demo field boundaries", hi: "डेमो खेत की सीमाएं", mr: "डेमो शेताच्या सीमा" },
  changeFarmInfoBtn: { en: "Change Farm Information", hi: "खेत की जानकारी बदलें", mr: "शेताची माहिती बदला" },
  mapLayersLabel: { en: "Map Layer", hi: "नक्शा परत", mr: "नकाशा स्तर" },
  layerSugarcanePlots: { en: "Sugarcane Plots", hi: "गन्ने के खेत", mr: "उसाचे शेत" },
  layerGreenness: { en: "Greenness", hi: "हरियाली", mr: "हिरवेपणा" },
  layerRootMoisture: { en: "Root Moisture", hi: "जड़ों की नमी", mr: "मुळांमधील ओलावा" },
  layerExpectedYield: { en: "Expected Yield", hi: "अनुमानित उपज", mr: "अंदाजे उत्पादन" },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  unit: UnitSystem;
  setUnit: (u: UnitSystem) => void;
  t: (key: string) => string;
  formatYield: (tonnesHa: number, qAcre?: number) => { primary: string; secondary: string; unitLabel: string };
  formatArea: (ha: number, acres?: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("agritwin_lang") as Language) || "en";
  });

  const [unit, setUnit] = useState<UnitSystem>(() => {
    return (localStorage.getItem("agritwin_unit") as UnitSystem) || "quintals_acre";
  });

  useEffect(() => {
    localStorage.setItem("agritwin_lang", language);
    // Apply font family attribute to document
    if (language === "hi" || language === "mr") {
      document.documentElement.lang = language;
      document.body.style.fontFamily = "'Noto Sans Devanagari', 'Inter', sans-serif";
    } else {
      document.documentElement.lang = "en";
      document.body.style.fontFamily = "'Inter', sans-serif";
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem("agritwin_unit", unit);
  }, [unit]);

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  const formatYield = (tonnesHa: number, qAcre?: number) => {
    const qValue = qAcre !== undefined ? qAcre : Number((tonnesHa / 0.247105).toFixed(1));
    const tValue = Number(tonnesHa.toFixed(1));

    if (unit === "quintals_acre") {
      return {
        primary: `${qValue} ${t("quintalsPerAcre")}`,
        secondary: `(${tValue} ${t("tonnesPerHa")})`,
        unitLabel: t("quintalsPerAcre")
      };
    } else {
      return {
        primary: `${tValue} ${t("tonnesPerHa")}`,
        secondary: `(${qValue} ${t("quintalsPerAcre")})`,
        unitLabel: t("tonnesPerHa")
      };
    }
  };

  const formatArea = (ha: number, acres?: number) => {
    const acreVal = acres !== undefined ? acres : Number((ha * 2.47105).toFixed(1));
    if (unit === "quintals_acre") {
      return `${acreVal} ${t("acres")}`;
    }
    return `${ha.toFixed(1)} ${t("hectares")}`;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, unit, setUnit, t, formatYield, formatArea }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
