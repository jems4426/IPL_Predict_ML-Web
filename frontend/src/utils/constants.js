export const TEAMS = [
  { name: "Chennai Super Kings", abbr: "CSK", color: "#F9CD05" }, // Yellow
  { name: "Delhi Capitals", abbr: "DC", color: "#00008B" },      // Blue
  { name: "Gujarat Titans", abbr: "GT", color: "#1B2133" },      // Dark Blue/Black
  { name: "Kolkata Knight Riders", abbr: "KKR", color: "#3A225D" }, // Purple
  { name: "Lucknow Super Giants", abbr: "LSG", color: "#00B0F0" },  // Light Blue
  { name: "Mumbai Indians", abbr: "MI", color: "#004BA0" },      // Blue
  { name: "Punjab Kings", abbr: "PBKS", color: "#ED1B24" },      // Red
  { name: "Rajasthan Royals", abbr: "RR", color: "#EA1A85" },      // Pink
  { name: "Royal Challengers Bengaluru", abbr: "RCB", color: "#EC1C24" }, // Red
  { name: "Sunrisers Hyderabad", abbr: "SRH", color: "#F26522" },  // Orange
];

export const CITIES = [
  "Abu Dhabi",
  "Ahmedabad",
  "Bengaluru",
  "Bloemfontein",
  "Cape Town",
  "Centurion",
  "Chandigarh",
  "Chennai",
  "Cuttack",
  "Delhi",
  "Dharamshala",
  "Dubai",
  "Durban",
  "East London",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Johannesburg",
  "Kanpur",
  "Kimberley",
  "Kolkata",
  "Lucknow",
  "Mohali",
  "Mumbai",
  "Nagpur",
  "Navi Mumbai",
  "Port Elizabeth",
  "Pune",
  "Raipur",
  "Rajkot",
  "Ranchi",
  "Sharjah",
  "Visakhapatnam",
];

export const getTeamColor = (teamName) => {
  const team = TEAMS.find(t => t.name === teamName);
  return team ? team.color : "#39ff14"; // Default to neon green
};

export const getTeamAbbr = (teamName) => {
  const team = TEAMS.find(t => t.name === teamName);
  return team ? team.abbr : "UNK";
};
