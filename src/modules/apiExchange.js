/**
 * API Exchange Module
 * Handles currency conversion functionality with real-time exchange rates
 * @module apiExchange
 */

/**
 * Exchange rates configuration
 * @constant {Object}
 * @property {number} NAD - Base currency (Namibian Dollar)
 * @property {number} USD - US Dollar rate
 * @property {number} EUR - Euro rate
 * @property {number} GBP - British Pound rate
 */
let EXCHANGE_RATES = {
  NAD: 1,
  USD: 0.054,
  EUR: 0.049,
  GBP: 0.042,
};

/**
 * Currency display configuration
 * @constant {Object}
 */
const CURRENCY_CONFIG = {
  NAD: { symbol: "N$", decimals: 2 },
  USD: { symbol: "$", decimals: 2 },
  EUR: { symbol: "€", decimals: 2 },
  GBP: { symbol: "£", decimals: 2 },
};

// At the top of the file, add rate update tracking
const RATE_UPDATE_INTERVAL = 3600000; // 1 hour in milliseconds
let lastRateUpdate = 0;

// Add rate updating functionality
async function updateExchangeRates() {
  const now = Date.now();
  if (now - lastRateUpdate < RATE_UPDATE_INTERVAL) {
    return; // Skip if rates were updated recently
  }

  const rates = await fetchExchangeRates();
  if (rates) {
    EXCHANGE_RATES = { ...rates };
    lastRateUpdate = now;
  }
}

/**
 * Initializes currency toggle functionality
 * @exports initializeCurrencyToggle
 * @throws {Error} If currency inputs are not found
 */
export const initializeCurrencyToggle = async () => {
  try {
    await updateExchangeRates(); // Get fresh rates on initialization

    const currencyInputs = document.querySelectorAll(
      'input[name="currency-group"]'
    );
    if (!currencyInputs.length) {
      throw new Error("No currency inputs found");
    }

    const nadRadio = document.getElementById("i-currency-nad");
    if (nadRadio) {
      nadRadio.checked = true;
      updateCurrencyDisplay("NAD");
    }

    // Use event delegation for better performance
    const currencyGroup = document
      .querySelector('[name="currency-group"]')
      .closest("form");
    if (currencyGroup) {
      currencyGroup.addEventListener("change", (e) => {
        if (e.target.name === "currency-group") {
          handleCurrencyChange(e);
        }
      });
    }
  } catch (error) {
    console.error("Failed to initialize currency toggle:", error);
    showErrorMessage("Currency initialization failed");
  }
};

/**
 * Handles currency change events
 * @param {Event} e - Change event
 * @private
 */
function handleCurrencyChange(e) {
  const newCurrency = e.target.value;
  updateCurrencyDisplay(newCurrency);
}

/**
 * Updates all price displays with the new currency
 * @param {string} newCurrency - The currency code to convert to
 * @exports updateCurrencyDisplay
 * @throws {Error} If currency is invalid
 */
export const updateCurrencyDisplay = (newCurrency) => {
  try {
    validateCurrency(newCurrency);
    updatePriceElements(newCurrency);
    updateCurrencySymbols(newCurrency);
  } catch (error) {
    console.error("Error updating currency:", error);
    showErrorMessage(`Failed to update currency: ${error.message}`);
  }
};

/**
 * Shows error message to user
 * @param {string} message - Error message to display
 * @private
 */
function showErrorMessage(message) {
  const errorAlert = document.querySelector(".error-alert-bg");
  if (errorAlert) {
    errorAlert.querySelector(".error-alert-text").textContent = message;
    errorAlert.classList.remove("is-hidden");
    setTimeout(() => errorAlert.classList.add("is-hidden"), 5000);
  }
}

/**
 * Validates the currency code
 * @param {string} currency - The currency code to validate
 * @throws {Error} If currency is invalid
 */
function validateCurrency(currency) {
  const rate = EXCHANGE_RATES[currency];
  if (!rate) {
    throw new Error(`Invalid currency: ${currency}`);
  }
}

/**
 * Updates all price elements with converted values
 * @param {string} currency - The currency to convert to
 */
function updatePriceElements(currency) {
  const rate = EXCHANGE_RATES[currency];
  const config = CURRENCY_CONFIG[currency];

  // First, handle all individual price elements
  document.querySelectorAll('[id^="v-calc-"]').forEach((element) => {
    // Skip non-price elements
    if (element.id === "v-calc-duration") return;
    if (element.textContent === "-") return;

    // Store original NAD value on first conversion
    if (
      !element.hasAttribute("data-original-price") &&
      element.textContent !== "-"
    ) {
      element.setAttribute("data-original-price", element.textContent);
    }

    // Get the original NAD price
    const originalPrice = parseFloat(
      element.getAttribute("data-original-price")
    );

    if (!isNaN(originalPrice)) {
      // Handle different element types
      if (element.id === "v-calc-vehicle-price") {
        const convertedPrice = (originalPrice * rate).toFixed(config.decimals);
        element.textContent = convertedPrice;
      } else if (element.id.startsWith("v-calc-extra-")) {
        const convertedPrice = (originalPrice * rate).toFixed(config.decimals);
        element.textContent = convertedPrice;
      } else if (element.id === "v-calc-delivery-fee") {
        const convertedPrice = (originalPrice * rate).toFixed(config.decimals);
        element.textContent = convertedPrice;
      }
    }
  });

  // Then, recalculate totals after all individual prices are converted
  calculateTotalExtras(rate, config.decimals);
  calculateFinalTotals(rate, config.decimals);
}

/**
 * Calculate total extras in the current currency
 * @param {number} rate - Current exchange rate
 * @param {number} decimals - Number of decimal places
 */
function calculateTotalExtras(rate, decimals) {
  const totalExtrasElement = document.querySelector("#v-calc-total-extra");
  if (!totalExtrasElement) return;

  let totalExtras = 0;
  document.querySelectorAll('[id^="v-calc-extra-"]').forEach((extraElement) => {
    if (extraElement.textContent !== "-") {
      const originalPrice = parseFloat(
        extraElement.getAttribute("data-original-price")
      );
      if (!isNaN(originalPrice)) {
        totalExtras += originalPrice;
      }
    }
  });

  // Convert total extras to current currency
  const convertedTotal = (totalExtras * rate).toFixed(decimals);
  totalExtrasElement.textContent = convertedTotal;

  // Store original NAD value
  if (!totalExtrasElement.hasAttribute("data-original-price")) {
    totalExtrasElement.setAttribute(
      "data-original-price",
      totalExtras.toString()
    );
  }
}

/**
 * Calculate final totals (subtotal, tax, total) in the current currency
 * @param {number} rate - Current exchange rate
 * @param {number} decimals - Number of decimal places
 */
function calculateFinalTotals(rate, decimals) {
  const elements = {
    subtotal: document.querySelector("#v-calc-subtotal"),
    tax: document.querySelector("#v-calc-tax"),
    total: document.querySelector("#v-calc-total"),
  };

  // Get original NAD values
  const vehiclePrice = parseFloat(
    document
      .querySelector("#v-calc-vehicle-price")
      ?.getAttribute("data-original-price") || "0"
  );
  const duration = parseInt(
    document.querySelector("#v-calc-duration")?.textContent || "0"
  );
  const deliveryFee = parseFloat(
    document
      .querySelector("#v-calc-delivery-fee")
      ?.getAttribute("data-original-price") || "0"
  );
  const totalExtras = parseFloat(
    document
      .querySelector("#v-calc-total-extra")
      ?.getAttribute("data-original-price") || "0"
  );

  // Calculate in NAD first
  const subtotalNAD = vehiclePrice * duration + deliveryFee + totalExtras;
  const taxNAD = subtotalNAD * 0.15; // 15% tax rate
  const totalNAD = subtotalNAD + taxNAD;

  // Convert and display
  if (elements.subtotal) {
    elements.subtotal.textContent = (subtotalNAD * rate).toFixed(decimals);
    elements.subtotal.setAttribute(
      "data-original-price",
      subtotalNAD.toString()
    );
  }
  if (elements.tax) {
    elements.tax.textContent = (taxNAD * rate).toFixed(decimals);
    elements.tax.setAttribute("data-original-price", taxNAD.toString());
  }
  if (elements.total) {
    elements.total.textContent = (totalNAD * rate).toFixed(decimals);
    elements.total.setAttribute("data-original-price", totalNAD.toString());
  }
}

/**
 * Updates all currency symbols in the UI
 * @param {string} currency - The new currency symbol to display
 */
function updateCurrencySymbols(currency) {
  document.querySelectorAll(".currency-symbol").forEach((element) => {
    element.textContent = currency;
  });
}

const API_KEY = "f8eb8575dc0df45769f9bc6c"; // Replace with your actual API key
const BASE_URL = "https://v6.exchangerate-api.com/v6";

/**
 * Optimize the fetchExchangeRates function with better error handling
 * @exports fetchExchangeRates
 * @param {string} baseCurrency - The base currency code
 * @returns {Promise<Object>} - The exchange rates for the specified base currency
 * @throws {Error} If an error occurs while fetching exchange rates
 */
export async function fetchExchangeRates(baseCurrency = "NAD") {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `${BASE_URL}/${API_KEY}/latest/${baseCurrency}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.result === "success") {
      return data.conversion_rates;
    } else {
      throw new Error(data["error-type"] || "Failed to fetch exchange rates");
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request timed out");
    } else {
      console.error("Error fetching exchange rates:", error);
    }
    return null;
  }
}
