/**
 * Updates the display elements with the selected dates and calculates duration
 * @param {string} pickupDateId - ID of the pickup date input element
 * @param {string} returnDateId - ID of the return date input element
 */
export const updateDateDisplay = () => {
  // Get the date input elements
  const pickupDateInput = document.querySelector("#i-pickup-date");
  const returnDateInput = document.querySelector("#i-return-date");

  // Get the display elements
  const pickupDateDisplay = document.querySelector("#v-pickup-date");
  const returnDateDisplay = document.querySelector("#v-return-date");
  const durationDisplay = document.querySelector("#v-calc-duration");

  // Update the display elements with formatted dates
  if (pickupDateInput.value) {
    const pickupDate = new Date(pickupDateInput.value);
    pickupDateDisplay.textContent = formatDateTime(pickupDate);
  }

  if (returnDateInput.value) {
    const returnDate = new Date(returnDateInput.value);
    returnDateDisplay.textContent = formatDateTime(returnDate);
  }

  // Calculate and display duration if both dates are set
  if (pickupDateInput.value && returnDateInput.value) {
    const duration = calculateDuration(
      new Date(pickupDateInput.value),
      new Date(returnDateInput.value)
    );
    durationDisplay.textContent = duration;
  }
};

/**
 * Formats a date object to a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
const formatDateTime = (date) => {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Calculates the duration in days between two dates
 * @param {Date} pickupDate - The pickup date
 * @param {Date} returnDate - The return date
 * @returns {number} Number of days between dates
 */
const calculateDuration = (pickupDate, returnDate) => {
  const diffTime = returnDate - pickupDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
