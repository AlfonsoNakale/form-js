import { calculateExtrasTotal } from "./extras";

// Constants
const TAX_RATE = 0.15;
const SELECTORS = {
  vehiclePrice: "#v-calc-vehicle-price",
  duration: "#v-calc-duration",
  deliveryFee: "#v-calc-delivery-fee",
  totalExtra: "#v-calc-total-extra",
  tax: "#v-calc-tax",
  subtotal: "#v-calc-subtotal",
  total: "#v-calc-total",
};

// Helper function to safely get numeric values from elements
const getNumericValue = (
  selector,
  defaultValue = 0,
  parseFunc = parseFloat
) => {
  try {
    const element = document.querySelector(selector);
    if (!element) return defaultValue;
    const value = parseFunc(element?.textContent || defaultValue);
    return isNaN(value) ? defaultValue : value;
  } catch (error) {
    return defaultValue;
  }
};

// Helper function to safely update element text
const updateElement = (selector, value) => {
  try {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value.toFixed(2);
    }
  } catch (error) {
    // Silent error handling
  }
};

export const calculateTotals = () => {
  try {
    // Get base values
    const baseValues = {
      vehiclePrice: getNumericValue(SELECTORS.vehiclePrice),
      duration: getNumericValue(SELECTORS.duration, 0, parseInt),
      deliveryFee: getNumericValue(SELECTORS.deliveryFee),
    };

    // Calculate components
    const calculations = {
      extrasTotal: calculateExtrasTotal(),
      vehicleCost: baseValues.vehiclePrice * baseValues.duration,
    };

    // Calculate totals
    const subtotal =
      calculations.vehicleCost +
      calculations.extrasTotal +
      baseValues.deliveryFee;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Update all displays
    const updates = {
      [SELECTORS.totalExtra]: calculations.extrasTotal,
      [SELECTORS.tax]: tax,
      [SELECTORS.subtotal]: subtotal,
      [SELECTORS.total]: total,
    };

    // Batch update DOM elements
    Object.entries(updates).forEach(([selector, value]) => {
      updateElement(selector, value);
    });

    return { subtotal, tax, total };
  } catch (error) {
    return { subtotal: 0, tax: 0, total: 0 };
  }
};
