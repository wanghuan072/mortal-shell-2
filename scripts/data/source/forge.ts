export const forgeCosts = [
  ["+1", "Ventrium", "1", "100"], ["+2", "Ventrium", "3", "300"], ["+3", "Ventrium", "6", "500"], ["+4", "Ventrium", "9", "1,000"], ["+5", "Ventrium", "12", "2,000"],
  ["+6", "Laterite", "1", "3,500"], ["+7", "Laterite", "3", "5,500"], ["+8", "Laterite", "6", "8,000"], ["+9", "Laterite", "9", "11,000"], ["+10", "Laterite", "12", "14,500"],
  ["+11", "Dorsalite", "1", "18,500"], ["+12", "Dorsalite", "3", "23,000"], ["+13", "Dorsalite", "6", "28,000"], ["+14", "Dorsalite", "9", "33,500"], ["+15", "Dorsalite", "12", "39,500"],
  ["+16", "Thoracium", "1", "46,000"], ["+17", "Thoracium", "1", "53,000"], ["+18", "Thoracium", "1", "60,500"], ["+19", "Thoracium", "1", "68,500"], ["+20", "Thoracium", "1", "77,000"],
].map(([level, material, quantity, coin]) => ({ level, material, quantity, coin }));
