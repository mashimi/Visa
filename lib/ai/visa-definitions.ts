export interface VisaDefinition {
  id: string;
  name: string;
  icon: string;
  category: 'USA' | 'Schengen';
  aiContext: {
    name: string;
    keyRegulation: string;
    primaryConcern: string;
    documentHint: string;
  };
  sidebarObjectives: string[];
}

export const visaDefinitions: VisaDefinition[] = [
  // === USA Visas ===
  {
    id: 'USA_B1_B2',
    name: 'US Tourist (B1/B2)',
    icon: '🇺🇸',
    category: 'USA',
    aiContext: {
      name: 'United States B1/B2 Visitor Visa',
      keyRegulation: 'Section 214(b) of the Immigration and Nationality Act',
      primaryConcern:
        'The applicant must overcome the presumption of being an intending immigrant by demonstrating strong ties (financial, familial, professional) to their home country that will compel them to return after their temporary stay.',
      documentHint: 'DS-160 confirmation page',
    },
    sidebarObjectives: ['Prove Strong Home Ties', 'Clarify Travel Purpose', 'Demonstrate Financial Stability'],
  },
  {
    id: 'USA_F1',
    name: 'US Student (F1)',
    icon: '🎓',
    category: 'USA',
    aiContext: {
      name: 'United States F-1 Student Visa',
      keyRegulation: 'Section 214(b) of the Immigration and Nationality Act',
      primaryConcern:
        'The applicant must demonstrate a genuine intent to study and return home after completion. The officer will probe the choice of institution, field of study, funding sources, and the applicant\'s ties to their home country.',
      documentHint: 'I-20 form, university acceptance letter, proof of financial support',
    },
    sidebarObjectives: ['Validate Academic Intent', 'Confirm Funding Source', 'Show Intent to Return'],
  },
  {
    id: 'USA_H1B',
    name: 'US Work (H1B)',
    icon: '💼',
    category: 'USA',
    aiContext: {
      name: 'United States H-1B Specialty Occupation Visa',
      keyRegulation: 'Immigration and Nationality Act Section 101(a)(15)(H)(i)(b)',
      primaryConcern:
        'The applicant must prove they have a valid job offer from a US employer in a specialty occupation, possess the required qualifications, and that the employer has filed an approved H-1B petition. The nature of the work and its classification as a specialty occupation will be scrutinized.',
      documentHint: 'I-797 approval notice, employment offer letter, educational credentials',
    },
    sidebarObjectives: ['Confirm Specialty Occupation', 'Validate Employer Petition', 'Verify Educational Credentials'],
  },
  {
    id: 'USA_J1_AUPAIR',
    name: 'US Au Pair (J-1)',
    icon: '🧑‍🍼',
    category: 'USA',
    aiContext: {
      name: 'Au Pair Program Visa (J-1)',
      keyRegulation: 'Regulations governing cultural exchange and childcare programs (J-1 Program regulations)',
      primaryConcern:
        'The applicant must demonstrate a genuine, non-immigrant intent focused on cultural exchange and childcare. Key points to verify are: a legitimate contract with the host family, adequate childcare experience, a clear understanding of program rules (including educational requirements), and strong ties to their home country that ensure their return after the program concludes.',
      documentHint:
        'DS-2019 form, signed host family contract, Au Pair agency placement letter, proof of education, and proof of childcare experience',
    },
    sidebarObjectives: ['Prove Cultural Exchange Intent', 'Validate Host Family Contract', 'Show Intent to Return Post-Program'],
  },
  {
    id: 'USA_K1',
    name: 'US Fiancé (K-1)',
    icon: '💍',
    category: 'USA',
    aiContext: {
      name: 'United States K-1 Fiancé(e) Visa',
      keyRegulation: 'Immigration and Nationality Act Section 101(a)(15)(K)',
      primaryConcern:
        "The applicant must prove a bona fide, legitimate relationship with a U.S. citizen petitioner. The officer will rigorously test the relationship's authenticity, looking for inconsistencies. Key areas include how they met, the development of the relationship, plans for the wedding (which must occur within 90 days of entry), and future life together.",
      documentHint:
        'I-129F petition approval notice, proof of relationship (photos, chat logs, travel itineraries), affidavits from friends/family, and proof of meeting in person within the last two years.',
    },
    sidebarObjectives: ['Prove Relationship Authenticity', 'Detail Future Plans', 'Confirm Intent to Marry Within 90 Days'],
  },
  {
    id: 'USA_E2',
    name: 'US Investor (E-2)',
    icon: '💰',
    category: 'USA',
    aiContext: {
      name: 'United States E-2 Investor Visa',
      keyRegulation: 'Treaty of Commerce and Navigation between the US and the applicant\'s country.',
      primaryConcern:
        "The applicant must prove they have invested a substantial amount of capital in a real, operating U.S. enterprise that they will develop and direct. The officer will scrutinize the lawful source of the funds, the business's viability (it cannot be marginal), and its potential to generate more than enough income for the investor's family or create economic impact.",
      documentHint:
        'A comprehensive business plan, proof of transfer of substantial funds, source of funds documentation (bank statements, property sales), and articles of incorporation.',
    },
    sidebarObjectives: ['Validate Source of Funds', 'Demonstrate Business Viability', 'Prove Substantial Investment'],
  },

  // === Schengen Visas ===
  {
    id: 'SCHENGEN_C',
    name: 'Schengen Tourist (C)',
    icon: '🇪🇺',
    category: 'Schengen',
    aiContext: {
      name: 'Schengen Area Visa (Type C)',
      keyRegulation: 'Article 6 of the Schengen Borders Code',
      primaryConcern:
        "The applicant must prove their 'intention to return', sufficient financial means for the stay, and the legitimacy of their travel purpose. They must not be considered a threat to public policy, internal security, or public health.",
      documentHint: 'VFS Global appointment confirmation, travel insurance, flight bookings, hotel reservations.',
    },
    sidebarObjectives: ['Prove Intent to Return', 'Show Sufficient Funds', 'Validate Itinerary & Insurance'],
  },
  {
    id: 'SCHENGEN_D',
    name: 'Schengen National (D)',
    icon: '🛂',
    category: 'Schengen',
    aiContext: {
      name: 'Schengen National Long-Stay Visa (Type D)',
      keyRegulation: 'Article 6 of the Schengen Borders Code and national immigration laws',
      primaryConcern:
        'The applicant must establish a clear and specific reason for the long-term stay (e.g., work, study, family reunification) with supporting documentation. The officer will verify that all required permits and approvals from the destination country are in place.',
      documentHint:
        'Valid work permit or study enrollment, proof of accommodation for the full duration, proof of regular income.',
    },
    sidebarObjectives: ['Confirm Long-Stay Purpose', 'Verify National Permits', 'Demonstrate Accommodation Plan'],
  },
  {
    id: 'SCHENGEN_AUPAIR',
    name: 'EU Au Pair (National)',
    icon: '🧑‍🍼',
    category: 'Schengen',
    aiContext: {
      name: 'Au Pair Program Visa (EU National)',
      keyRegulation: 'European Agreement on Au Pair Placement and national immigration laws',
      primaryConcern:
        'The applicant must demonstrate a genuine cultural exchange intent and a legitimate placement with a registered host family. The officer will verify the signed contract, pocket money arrangements, working hours compliance, and the applicant\'s intention to return home after the program.',
      documentHint:
        'Signed au pair contract, host family registration certificate, proof of language skills, proof of health insurance.',
    },
    sidebarObjectives: ['Verify Host Family Contract', 'Prove Cultural Exchange Intent', 'Confirm Program Compliance'],
  },
];

/** Lookup a visa definition by its ID */
export const getVisaDefinitionById = (id: string): VisaDefinition | undefined => {
  return visaDefinitions.find((v) => v.id === id);
};

/** Get all unique categories present in the definitions */
export const getVisaCategories = (): string[] => {
  return [...new Set(visaDefinitions.map((v) => v.category))];
};
