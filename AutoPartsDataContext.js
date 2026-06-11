import React, { createContext, useContext, useState } from 'react';

// ==========================================================
// 1. COMPREHENSIVE CAR MAKES, MODELS, GENERATIONS & ENGINES
// ==========================================================
export const CAR_MAKES = [
  {
    id: "toyota",
    name: "Toyota",
    models: [
      {
        id: "camry",
        name: "Camry",
        generations: [
          { 
            id: "xv20", name: "XV20", startYear: 1996, endYear: 2001, displayYears: "1996 - 2001",
            engines: [
              { code: "5S-FE", volume: "2.2", power: 131, fuel: "Бензин" },
              { code: "1MZ-FE", volume: "3.0", power: 190, fuel: "Бензин" }
            ]
          },
          { 
            id: "xv30", name: "XV30", startYear: 2001, endYear: 2006, displayYears: "2001 - 2006",
            engines: [
              { code: "2AZ-FE", volume: "2.4", power: 152, fuel: "Бензин" },
              { code: "1MZ-FE", volume: "3.0", power: 186, fuel: "Бензин" }
            ]
          },
          { 
            id: "xv40", name: "XV40", startYear: 2006, endYear: 2011, displayYears: "2006 - 2011",
            engines: [
              { code: "2AZ-FE", volume: "2.4", power: 167, fuel: "Бензин" },
              { code: "2GR-FE", volume: "3.5", power: 277, fuel: "Бензин" }
            ]
          },
          { 
            id: "xv50", name: "XV50", startYear: 2011, endYear: 2014, displayYears: "2011 - 2014",
            engines: [
              { code: "1AZ-FE", volume: "2.0", power: 148, fuel: "Бензин" },
              { code: "2AR-FE", volume: "2.5", power: 181, fuel: "Бензин" },
              { code: "2GR-FE", volume: "3.5", power: 249, fuel: "Бензин" }
            ]
          },
          { 
            id: "xv55", name: "XV55 (Facelift)", startYear: 2014, endYear: 2017, displayYears: "2014 - 2017",
            engines: [
              { code: "6AR-FSE", volume: "2.0", power: 150, fuel: "Бензин" },
              { code: "2AR-FE", volume: "2.5", power: 181, fuel: "Бензин" },
              { code: "2GR-FE", volume: "3.5", power: 249, fuel: "Бензин" }
            ]
          },
          { 
            id: "xv70", name: "XV70", startYear: 2017, endYear: 2024, displayYears: "2017 - 2024",
            engines: [
              { code: "M20A-FKS", volume: "2.0", power: 150, fuel: "Бензин" },
              { code: "A25A-FKS", volume: "2.5", power: 200, fuel: "Бензин" },
              { code: "2GR-FKS", volume: "3.5", power: 249, fuel: "Бензин" }
            ]
          },
          { 
            id: "xv80", name: "XV80", startYear: 2024, endYear: null, displayYears: "2024 - наст. время",
            engines: [
              { code: "A25A-FXS", volume: "2.5 Hybrid", power: 225, fuel: "Гибрид" }
            ]
          }
        ]
      },
      {
        id: "corolla",
        name: "Corolla",
        generations: [
          { id: "e110", name: "E110", startYear: 1997, endYear: 2002, displayYears: "1997 - 2002", engines: [{ code: "4A-FE", volume: "1.6", power: 110, fuel: "Бензин" }] },
          { id: "e120", name: "E120", startYear: 2000, endYear: 2007, displayYears: "2000 - 2007", engines: [{ code: "3ZZ-FE", volume: "1.6", power: 110, fuel: "Бензин" }] },
          { id: "e150", name: "E150", startYear: 2006, endYear: 2013, displayYears: "2006 - 2013", engines: [{ code: "1ZR-FE", volume: "1.6", power: 124, fuel: "Бензин" }] },
          { id: "e180", name: "E180", startYear: 2013, endYear: 2019, displayYears: "2013 - 2019", engines: [{ code: "1ZR-FAE", volume: "1.6", power: 122, fuel: "Бензин" }] },
          { id: "e210", name: "E210", startYear: 2019, endYear: null, displayYears: "2019 - наст. время", engines: [{ code: "M15A-FKS", volume: "1.5", power: 125, fuel: "Бензин" }] }
        ]
      },
      {
        id: "rav4",
        name: "RAV4",
        generations: [
          { id: "xa10", name: "XA10", startYear: 1994, endYear: 2000, displayYears: "1994 - 2000", engines: [{ code: "3S-FE", volume: "2.0", power: 129, fuel: "Бензин" }] },
          { id: "xa20", name: "XA20", startYear: 2000, endYear: 2005, displayYears: "2000 - 2005", engines: [{ code: "1AZ-FE", volume: "2.0", power: 150, fuel: "Бензин" }] },
          { id: "xa30", name: "XA30", startYear: 2005, endYear: 2012, displayYears: "2005 - 2012", engines: [{ code: "2AZ-FE", volume: "2.4", power: 170, fuel: "Бензин" }] },
          { id: "xa40", name: "XA40", startYear: 2012, endYear: 2018, displayYears: "2012 - 2018", engines: [{ code: "2AR-FE", volume: "2.5", power: 180, fuel: "Бензин" }] },
          { id: "xa50", name: "XA50", startYear: 2018, endYear: null, displayYears: "2018 - наст. время", engines: [{ code: "A25A-FKS", volume: "2.5", power: 199, fuel: "Бензин" }] }
        ]
      }
    ]
  },
  {
    id: "bmw",
    name: "BMW",
    models: [
      {
        id: "3-series",
        name: "3-Series",
        generations: [
          { id: "e46", name: "E46", startYear: 1998, endYear: 2005, displayYears: "1998 - 2005", engines: [{ code: "M54B22", volume: "2.2", power: 170, fuel: "Бензин" }] },
          { id: "e90", name: "E90/E91/E92", startYear: 2005, endYear: 2012, displayYears: "2005 - 2012", engines: [{ code: "N46B20", volume: "2.0", power: 136, fuel: "Бензин" }, { code: "N52B25", volume: "2.5", power: 218, fuel: "Бензин" }] },
          { id: "f30", name: "F30/F31/F34", startYear: 2012, endYear: 2019, displayYears: "2012 - 2019", engines: [{ code: "N20B20", volume: "2.0", power: 184, fuel: "Бензин" }, { code: "N47D20", volume: "2.0", power: 184, fuel: "Дизель" }] },
          { id: "g20", name: "G20", startYear: 2018, endYear: null, displayYears: "2018 - наст. время", engines: [{ code: "B48B20", volume: "2.0", power: 184, fuel: "Бензин" }] }
        ]
      },
      {
        id: "5-series",
        name: "5-Series",
        generations: [
          { id: "e39", name: "E39", startYear: 1995, endYear: 2003, displayYears: "1995 - 2003", engines: [{ code: "M54B25", volume: "2.5", power: 192, fuel: "Бензин" }] },
          { id: "e60", name: "E60/E61", startYear: 2003, endYear: 2010, displayYears: "2003 - 2010", engines: [{ code: "N52B30", volume: "3.0", power: 258, fuel: "Бензин" }, { code: "M57D30", volume: "3.0", power: 235, fuel: "Дизель" }] },
          { id: "f10", name: "F10/F11", startYear: 2010, endYear: 2017, displayYears: "2010 - 2017", engines: [{ code: "N20B20", volume: "2.0", power: 245, fuel: "Бензин" }, { code: "N57D30", volume: "3.0", power: 258, fuel: "Дизель" }] }
        ]
      }
    ]
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    models: [
      {
        id: "c-class",
        name: "C-Class",
        generations: [
          { id: "w203", name: "W203", startYear: 2000, endYear: 2007, displayYears: "2000 - 2007", engines: [{ code: "M111.951", volume: "2.0", power: 129, fuel: "Бензин" }] },
          { id: "w204", name: "W204", startYear: 2007, endYear: 2014, displayYears: "2007 - 2014", engines: [{ code: "M271.820", volume: "1.8", power: 156, fuel: "Бензин" }] },
          { id: "w205", name: "W205", startYear: 2014, endYear: 2021, displayYears: "2014 - 2021", engines: [{ code: "M274.910", volume: "1.6", power: 150, fuel: "Бензин" }] }
        ]
      },
      {
        id: "e-class",
        name: "E-Class",
        generations: [
          { id: "w210", name: "W210", startYear: 1995, endYear: 2002, displayYears: "1995 - 2002", engines: [{ code: "M111.970", volume: "2.3", power: 150, fuel: "Бензин" }] },
          { id: "w211", name: "W211", startYear: 2002, endYear: 2009, displayYears: "2002 - 2009", engines: [{ code: "M271.946", volume: "1.8", power: 163, fuel: "Бензин" }] },
          { id: "w212", name: "W212", startYear: 2009, endYear: 2016, displayYears: "2009 - 2016", engines: [{ code: "M271.860", volume: "1.8 Turbo", power: 184, fuel: "Бензин" }] }
        ]
      }
    ]
  },
  {
    id: "lada",
    name: "Lada",
    models: [
      {
        id: "vesta",
        name: "Vesta",
        generations: [
          { 
            id: "vesta_i", name: "I поколение", startYear: 2015, endYear: 2022, displayYears: "2015 - 2022",
            engines: [
              { code: "21129", volume: "1.6", power: 106, fuel: "Бензин" },
              { code: "21179", volume: "1.8", power: 122, fuel: "Бензин" }
            ]
          },
          { 
            id: "vesta_ng", name: "NG", startYear: 2022, endYear: null, displayYears: "2022 - наст. время",
            engines: [
              { code: "11182", volume: "1.6 8V", power: 90, fuel: "Бензин" },
              { code: "21129", volume: "1.6 16V", power: 106, fuel: "Бензин" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "hyundai",
    name: "Hyundai",
    models: [
      {
        id: "solaris",
        name: "Solaris",
        generations: [
          { 
            id: "solaris_i", name: "I поколение (RB)", startYear: 2011, endYear: 2017, displayYears: "2011 - 2017",
            engines: [
              { code: "G4FA", volume: "1.4", power: 107, fuel: "Бензин" },
              { code: "G4FC", volume: "1.6", power: 123, fuel: "Бензин" }
            ]
          },
          { 
            id: "solaris_ii", name: "II поколение (HC)", startYear: 2017, endYear: 2024, displayYears: "2017 - 2024",
            engines: [
              { code: "G4LC", volume: "1.4", power: 100, fuel: "Бензин" },
              { code: "G4FG", volume: "1.6", power: 123, fuel: "Бензин" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "geely",
    name: "Geely",
    models: [
      {
        id: "coolray",
        name: "Coolray",
        generations: [
          { id: "coolray_i", name: "I поколение (SX11)", startYear: 2019, endYear: 2023, displayYears: "2019 - 2023", engines: [{ code: "JLH-3G15TD", volume: "1.5T", power: 150, fuel: "Бензин" }] },
          { id: "coolray_fl", name: "Рестайлинг (SX11 FL)", startYear: 2023, endYear: null, displayYears: "2023 - наст. время", engines: [{ code: "BHE15-EFD", volume: "1.5T", power: 147, fuel: "Бензин" }] }
        ]
      },
      {
        id: "monjaro",
        name: "Monjaro",
        generations: [
          { id: "monjaro_i", name: "I поколение (KX11)", startYear: 2022, endYear: null, displayYears: "2022 - наст. время", engines: [{ code: "JLH-4G20td", volume: "2.0T", power: 238, fuel: "Бензин" }] }
        ]
      }
    ]
  },
  {
    id: "haval",
    name: "Haval",
    models: [
      {
        id: "jolion",
        name: "Jolion",
        generations: [
          { id: "jolion_i", name: "I поколение", startYear: 2021, endYear: 2024, displayYears: "2021 - 2024", engines: [{ code: "GW4G15K", volume: "1.5T", power: 143, fuel: "Бензин" }] },
          { id: "jolion_fl", name: "Рестайлинг", startYear: 2024, endYear: null, displayYears: "2024 - наст. время", engines: [{ code: "GW4G15K", volume: "1.5T", power: 143, fuel: "Бензин" }] }
        ]
      }
    ]
  }
];

export const PARTS_CATEGORIES = [
  {
    id: "engine",
    name: "Двигатель",
    subcategories: [
      { id: "engine-parts", name: "Детали двигателя" },
      { id: "timing", name: "ГРМ и приводные ремни" },
      { id: "lubrication", name: "Система смазки" }
    ]
  },
  {
    id: "brakes",
    name: "Тормозная система",
    subcategories: [
      { id: "brake-pads", name: "Тормозные колодки" },
      { id: "brake-discs", name: "Тормозные диски" }
    ]
  }
];

const AutoPartsDataContext = createContext(null);

export const AutoPartsDataProvider = ({ children }) => {
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState(null);

  return (
    <AutoPartsDataContext.Provider value={{
      makes: CAR_MAKES,
      categories: PARTS_CATEGORIES,
      selectedMake, setSelectedMake,
      selectedModel, setSelectedModel,
      selectedGeneration, setSelectedGeneration,
      selectedEngine, setSelectedEngine
    }}>
      {children}
    </AutoPartsDataContext.Provider>
  );
};

export const useAutoPartsData = () => useContext(AutoPartsDataContext);
