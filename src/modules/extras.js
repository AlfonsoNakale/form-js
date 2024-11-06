import { calculateTotals } from "./calculations";

// Optimized EXTRAS array with proper mapping
const EXTRAS = [
  {
    id: 1,
    name: "NAD-45-000.00-Excess-Waiver",
    baseFee: 45000,
    perDay: false,
    displayName: "NAD 45,000.00 Excess Waiver",
  },
  {
    id: 2,
    name: "Tyre-Glass-Waiver",
    baseFee: 165,
    perDay: true,
    displayName: "Tyre & Glass Waiver @ 165.00 p.d",
  },
  {
    id: 3,
    name: "Cross-Border-Charge",
    baseFee: 100,
    perDay: false,
    displayName: "Cross Border Charge @ 100.00",
  },
  {
    id: 4,
    name: "Satellite-Phone-N-6000-Excess",
    baseFee: 140,
    perDay: true,
    displayName: "Satellite Phone (N$6000 Excess) @ 140.00 p.d",
  },
  {
    id: 5,
    name: "Satellite-Phone-Zero-Excess",
    baseFee: 170,
    perDay: true,
    displayName: "Satellite Phone (Zero Excess) @ 170.00 p.d",
  },
  {
    id: 6,
    name: "Camping-Equipment---Double-Cab",
    baseFee: 170,
    perDay: true,
    displayName: "Camping Equipment - Double Cab @ NAD 170.00 p.d",
  },
  {
    id: 7,
    name: "Roof-Tents-Required",
    baseFee: 60,
    perDay: true,
    displayName: "Roof Tents Required @ NAD 60.00 p.d",
  },
  {
    id: 8,
    name: "Engel-40L-Fridge-Freezer",
    baseFee: 90,
    perDay: true,
    displayName: "Engel 40L Fridge/Freezer @ 90.00 p.d",
  },
  {
    id: 9,
    name: "Bedding-incl.-1x-sleeping-bag-1x-pillow",
    baseFee: 20,
    perDay: true,
    displayName: "Bedding (incl. 1x sleeping bag + 1x pillow) @ 20.00 p.d",
  },
  {
    id: 10,
    name: "GPS-System",
    baseFee: 75,
    perDay: true,
    displayName: "GPS System @ 75.00 p.d",
  },
  {
    id: 11,
    name: "SAT-Phone-Minutes",
    baseFee: 825,
    perDay: false,
    displayName: "SAT Phone Minutes @ 825.00 once.off",
  },
  {
    id: 12,
    name: "Kitchen-wash-up-kit-small-dish-wash-liquid-2x-drying-cloth-2x-sponge-2x-cleaning-cloth-extras",
    baseFee: 150,
    perDay: false,
    displayName: "Kitchen wash up kit @ 150.00 once.off",
  },
  {
    id: 13,
    name: "Ground-Tent",
    baseFee: 0,
    perDay: false,
    displayName: "Free Ground Tent",
  },
  {
    id: 14,
    name: "Jerry-Can",
    baseFee: 10,
    perDay: true,
    displayName: "Jerry Can @ 10.00 p.d",
  },
  {
    id: 15,
    name: "Baby-Seat",
    baseFee: 0,
    perDay: false,
    displayName: "Free Baby Seat",
  },
].map((extra) => ({
  ...extra,
  key: `extra-${extra.id}`,
  inputId: `i-extra-${extra.id}`,
  countId: `i-count-extra-${extra.id}`,
  displayId: `v-calc-extra-${extra.id}`,
  // Add validation helpers
  getElements() {
    return {
      checkbox: document.querySelector(`#${this.inputId}`),
      quantity: document.querySelector(`#${this.countId}`),
      display: document.querySelector(`#${this.displayId}`),
    };
  },
  isValid() {
    const elements = this.getElements();
    return elements.checkbox && elements.quantity && elements.display;
  },
}));

const updateExtraCalculation = (extraId) => {
  const extra = EXTRAS.find((e) => e.id === extraId);
  if (!extra || !extra.isValid()) return;

  const elements = extra.getElements();
  const quantity = parseInt(elements.quantity.value) || 0;
  const duration =
    parseInt(document.querySelector("#v-calc-duration")?.textContent) || 0;

  const cost = extra.perDay
    ? extra.baseFee * quantity * duration
    : extra.baseFee * quantity;

  elements.display.textContent = cost.toFixed(2);

  // Update total extras after individual calculation
  updateExtrasTotal();
};

// New function to update extras total display
const updateExtrasTotal = () => {
  const totalElement = document.querySelector("#v-calc-total-extra");
  if (!totalElement) return;

  const total = EXTRAS.reduce((sum, extra) => {
    if (!extra.isValid()) return sum;

    const elements = extra.getElements();
    if (!elements.checkbox.checked || elements.display.textContent === "-") {
      return sum;
    }

    return sum + parseFloat(elements.display.textContent || "0");
  }, 0);

  totalElement.textContent = total.toFixed(2);
};

export const calculateExtrasTotal = () => {
  const total = EXTRAS.reduce((sum, extra) => {
    if (!extra.isValid()) return sum;

    const elements = extra.getElements();
    if (!elements.checkbox.checked || elements.display.textContent === "-") {
      return sum;
    }

    return sum + parseFloat(elements.display.textContent || "0");
  }, 0);

  // Update the display element
  const totalElement = document.querySelector("#v-calc-total-extra");
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }

  return total;
};

export const initializeExtras = () => {
  EXTRAS.forEach((extra) => {
    if (!extra.isValid()) return;

    const elements = extra.getElements();

    elements.checkbox.addEventListener("change", () => {
      if (elements.checkbox.checked) {
        elements.quantity.value = elements.quantity.value || "1";
        updateExtraCalculation(extra.id);
      } else {
        elements.quantity.value = "";
        elements.display.textContent = "-";
        updateExtrasTotal();
      }
      calculateTotals();
    });

    elements.quantity.addEventListener("change", () => {
      if (elements.checkbox.checked) {
        updateExtraCalculation(extra.id);
        calculateTotals();
      }
    });
  });

  updateExtrasTotal();
};

export const getExtraPrice = (extraName) => {
  const extra = EXTRAS.find((e) => e.name === extraName);
  return extra ? extra.baseFee : 0;
};
