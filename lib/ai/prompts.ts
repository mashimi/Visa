export const getInterviewQuestions = (visaType: string) => {
  const baseQuestions = [
    "Good morning. May I see your passport please? What is the purpose of your trip?",
    "How long do you plan to stay in the destination country?",
    "How will you be funding this trip? Can you show me your bank statements?",
    "What do you do for a living? How long have you been with your current employer?",
    "Do you have family in your home country? What ties do you have that will ensure your return?",
    "Have you traveled internationally before? Which countries have you visited?",
    "Where will you be staying during your visit? Do you have hotel reservations?",
    "Is there anything else you'd like to add before I make my decision?"
  ];

  return baseQuestions;
};

export const generateFollowUp = (answer: string, context: any) => {
  // Generate contextual follow-up questions based on the answer
  return "Can you provide more details about that?";
};