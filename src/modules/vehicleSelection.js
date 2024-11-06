import { calculateTotals } from "./calculations";

export const initializeVehicleSelection = () => {
  const vehicleInputs = document.querySelectorAll('input[name="vehicle"]');

  vehicleInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const vehicleName = e.target
        .closest(".f-radio-field")
        .querySelector(".vehicle-name").textContent;
      const vehiclePrice = parseFloat(e.target.value);

      // Update vehicle display
      document.querySelector("#v-vehicle-name").textContent = vehicleName;
      document.querySelector("#v-calc-vehicle-price").textContent =
        vehiclePrice.toFixed(2);

      calculateTotals();
    });
  });
};
