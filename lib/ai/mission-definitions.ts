export interface Mission {
  id: string;
  name: string;
  country: string;
  wait: string;
  focus: string;
}

export const missionDefinitions: { [key: string]: Mission[] } = {
  USA: [
    {
      id: 'LAGOS',
      name: 'US Consulate, Lagos',
      country: 'Nigeria',
      wait: '280 Days',
      focus:
        'High scrutiny on financial documents and proof of employment due to a high rate of fraudulent applications. Officers are trained to be skeptical of claims that are not overwhelmingly supported by robust, authenticated evidence.',
    },
    {
      id: 'MUMBAI',
      name: 'US Consulate, Mumbai',
      country: 'India',
      wait: '128 Days',
      focus:
        'Focus on student and work visas (F-1, H-1B). For visitor visas, there is a strong emphasis on family ties and the applicant\'s social and economic standing in India to ensure their return.',
    },
    {
      id: 'LONDON',
      name: 'US Embassy, London',
      country: 'UK',
      wait: '45 Days',
      focus:
        'Generally lower-risk interviews. The focus is on verifying the specific purpose of travel (e.g., business conference details, tourist itinerary) is well-defined, credible, and consistent with the applicant\'s stated profession.',
    },
    {
      id: 'BEIJING',
      name: 'US Embassy, Beijing',
      country: 'China',
      wait: '15 Days',
      focus:
        'Officers place emphasis on business visits and academic exchange. Proof of employment or institutional affiliation is important. The applicant must clearly demonstrate their ties back to China.',
    },
    {
      id: 'NAIROBI',
      name: 'US Embassy, Nairobi',
      country: 'Kenya',
      wait: '95 Days',
      focus:
        'Strong emphasis on financial self-sufficiency and proof of property or business ownership in Kenya. Officers look closely at bank statements and employment letters for authenticity.',
    },
    {
      id: 'DAR_ES_SALAAM',
      name: 'US Embassy, Dar es Salaam',
      country: 'Tanzania',
      wait: '110 Days',
      focus:
        'Emphasis on demonstrating strong social and economic ties to Tanzania. Consular officers frequently scrutinize business ownership documents, family relationships, and proof of fixed assets to ensure the applicant has a clear intent to return after their visit.',
    },
  ],
  Schengen: [
    {
      id: 'BERLIN',
      name: 'German Embassy, Berlin',
      country: 'Germany',
      wait: '30 Days',
      focus:
        'Known for being very procedural and detail-oriented. The officer will meticulously check if the submitted travel itinerary, insurance policy, and accommodation bookings match the visa application exactly. Any discrepancy is a red flag.',
    },
    {
      id: 'PARIS',
      name: 'French Consulate, Paris',
      country: 'France',
      wait: '45 Days',
      focus:
        "Focus on the applicant's travel history, especially within the Schengen area. The purpose of the visit, particularly for tourism, is explored to ensure it is genuine and the applicant's financial means are adequate.",
    },
    {
      id: 'MADRID',
      name: 'Spanish Embassy, Madrid',
      country: 'Spain',
      wait: '25 Days',
      focus:
        'Emphasis on tourism applicants providing solid proof of accommodation reservations and a realistic budget for the entire stay. Return flight tickets are considered essential.',
    },
    {
      id: 'ROME',
      name: 'Italian Consulate, Rome',
      country: 'Italy',
      wait: '60 Days',
      focus:
        'Officers pay close attention to detailed itineraries for tourist visas, including specific cultural or business activities. Proof of strong employment or family ties at home is important for establishing intent to return.',
    },
    {
      id: 'DAR_ES_SALAAM_SCHENGEN',
      name: 'German Embassy, Dar es Salaam',
      country: 'Tanzania',
      wait: '40 Days',
      focus:
        'Meticulous review of the "Schengen Declaration" and financial sufficiency. The officer will verify that the travel insurance and accommodation bookings are fully confirmed and that the applicant\'s income in Tanzania justifies the luxury of international travel.',
    },
  ],
};

/** Look up a mission by category and ID */
export const getMissionById = (category: string, missionId: string): Mission | undefined => {
  const categoryMissions = missionDefinitions[category];
  if (!categoryMissions) return undefined;
  return categoryMissions.find((m) => m.id === missionId);
};
