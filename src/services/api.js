const EMAIL_REGEX = /\S+@\S+\.\S+/;

// Simulate fetching all leads from the JSON file
export const fetchLeads = async () => {
  try {
    const response = await fetch('/data/leads.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve(data), 500));
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return Promise.reject("Could not load leads data.");
  }
};

// Simulate updating a lead
export const updateLead = async (updatedLead) => {
  console.log("Simulating update for lead:", updatedLead.id);

  // Simulate validation failure
  if (!updatedLead.email || !EMAIL_REGEX.test(updatedLead.email)) {
    return new Promise((_, reject) =>
      setTimeout(() => reject("Invalid email format."), 400)
    );
  }

  // Simulate random API failure
  if (Math.random() < 0.1) { // 10% chance of failure
    return new Promise((_, reject) =>
      setTimeout(() => reject("A server error occurred. Please try again."), 500)
    );
  }

  // Simulate success
  return new Promise(resolve => setTimeout(() => resolve(updatedLead), 700));
};