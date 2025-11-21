export interface MDA {
  id: number;
  name: string;
  link: string;
  image: string;
  category: "Ministry" | "Department" | "Agency";
  iconName: string;
}

export const mdas: MDA[] = [
  {
    id: 1,
    name: "Ministry of Finance",
    link: "https://mfbep.tr.gov.ng/",
    image: "/images/mda/Ministryoffinance.png",
    category: "Ministry",
    iconName: "Wallet",
  },
  {
    id: 2,
    name: "Taraba State Board of Internal Revenue Service (TIRS)",
    link: "https://mda.tarababir.gov.ng/",
    image: "/images/mda/BoardofInternalRevenueServiceTIRS.png",
    category: "Agency",
    iconName: "Receipt",
  },
  {
    id: 3,
    name: "Taraba State Geographic Information Service (TAGIS)",
    link: "https://www.tarabastategov.cloud/government/tagis",
    image: "/images/mda/TarabaStateGeographicInformationServiceTAGIS.png",
    category: "Agency",
    iconName: "Map",
  },
  {
    id: 4,
    name: "Taraba Investment Promotion Agency (TARIPA)",
    link: "https://www.tarabastategov.cloud/government/taripa",
    image: "/images/mda/TarabaInvestmentPromotionAgencyTARIPA.png",
    category: "Agency",
    iconName: "TrendingUp",
  },
  {
    id: 5,
    name: "Taraba State Public-Private Partnership (PPP) Office",
    link: "https://www.tarabastategov.cloud/government/ppp-office",
    image: "/images/mda/TarabaStatePublicPrivatePartnershipPPP.png",
    category: "Department",
    iconName: "Handshake",
  },
  {
    id: 6,
    name: "Taraba State Small Claims Court",
    link: "https://www.tarabastategov.cloud/government/small-claims-court",
    image: "/images/mda/TarabaStateSmallClaimsCourt.png",
    category: "Department",
    iconName: "Scale",
  },
  {
    id: 7,
    name: "Ministry of Digital Economy and Innovation",
    link: "https://modei.tr.gov.ng/",
    image: "/images/mda/MinistryofDigitalEconomyandInnovation.png",
    category: "Ministry",
    iconName: "Cpu",
  },
  {
    id: 8,
    name: "Ministry of Agriculture and Food Security",
    link: "https://www.tarabastategov.cloud/government/ministry-of-agriculture-and-food-security",
    image: "/images/mda/MinistryofAgricultureandFoodSecurity.png",
    category: "Ministry",
    iconName: "Sprout",
  },
  {
    id: 9,
    name: "Bureau of Lands and Survey",
    link: "https://www.tarabastategov.cloud/government/bureau-of-land-and-survey",
    image: "/images/mda/BureauofLandsandSurvey.png",
    category: "Department",
    iconName: "MapPin",
  },
  {
    id: 10,
    name: "Ministry of Justice",
    link: "https://www.tarabastategov.cloud/government/ministry-of-justice",
    image: "/images/mda/Ministry%20of%20Justice.png",
    category: "Ministry",
    iconName: "Scale",
  },
  {
    id: 11,
    name: "Ministry of Rural and Urban Development",
    link: "https://www.tarabastategov.cloud/government/ministry-of-rural-and-urban-development",
    image: "/images/mda/MinistryofRuralandUrbanDevelopment.png",
    category: "Ministry",
    iconName: "Building2",
  },
  {
    id: 12,
    name: "Ministry of Commerce, Trade, Industry, and Investment",
    link: "https://www.tarabastategov.cloud/government/ministry-of-commerce",
    image: "/images/mda/MinistryofCommerce%2CTrade%2CIndustryandInvestment.png",
    category: "Ministry",
    iconName: "ShoppingCart",
  },
  {
    id: 13,
    name: "Ministry of Environment and Climate Change",
    link: "https://www.tarabastategov.cloud/government/ministry-of-enviroment-and-climate-change",
    image: "/images/mda/MinistryofEnvironmentandClimateChange.png",
    category: "Ministry",
    iconName: "Leaf",
  },
];

