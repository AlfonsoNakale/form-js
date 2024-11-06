import flatpickr from 'flatpickr'
import { updateDateDisplay } from './displayCalculations'

function initializePickupLocation() {
  const pickupConfirmation = document.querySelector('#pickup-confirmation')
  const pickupLocation = document.querySelector('#i-pickup-location')
  const returnLocation = document.querySelector('#i-return-location')
  const deliveryFeeElement = document.querySelector('#v-calc-delivery-fee')
  const vPickupLocation = document.querySelector('#v-pickup-location')
  const vReturnLocation = document.querySelector('#v-return-location')

  pickupLocation.closest('.input-dropdown').style.display = 'none'
  returnLocation.closest('.input-dropdown').style.display = 'none'

  pickupLocation.addEventListener('change', function () {
    if (this.selectedIndex !== 0) {
      vPickupLocation.textContent = this.options[this.selectedIndex].text
    }
  })

  returnLocation.addEventListener('change', function () {
    if (this.selectedIndex !== 0) {
      vReturnLocation.textContent = this.options[this.selectedIndex].text
    }
  })

  pickupConfirmation.addEventListener('change', function () {
    const displayStyle = this.checked ? 'block' : 'none'
    pickupLocation.closest('.input-dropdown').style.display = displayStyle
    returnLocation.closest('.input-dropdown').style.display = displayStyle

    deliveryFeeElement.textContent = this.checked ? '250.00' : '0.00'

    if (!this.checked) {
      pickupLocation.selectedIndex = 0
      returnLocation.selectedIndex = 0
      vPickupLocation.textContent = '-'
      vReturnLocation.textContent = '-'
    }
  })
}

export function initializeDatePickers() {
  let pickupDateInstance
  let returnDateInstance

  const pickupDateConfig = {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    minDate: 'today',
    time_24hr: true,
    minuteIncrement: 30,
    onChange: function (selectedDates) {
      if (returnDateInstance) {
        returnDateInstance.set('minDate', selectedDates[0])

        const returnDate = returnDateInstance.selectedDates[0]
        if (returnDate && returnDate < selectedDates[0]) {
          returnDateInstance.clear()
          showDateAlert(
            'Return date cannot be earlier than pickup date. Please select a new return date.'
          )
        }
      }
      updateDateDisplay()
    },
  }

  const returnDateConfig = {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    minDate: 'today',
    time_24hr: true,
    minuteIncrement: 30,
    onChange: function (selectedDates) {
      const pickupDate = pickupDateInstance.selectedDates[0]

      if (pickupDate && selectedDates[0] < pickupDate) {
        returnDateInstance.clear()
        showDateAlert(
          'Return date cannot be earlier than pickup date. Please select a valid date.'
        )
        return
      }
      updateDateDisplay()
    },
  }

  pickupDateInstance = flatpickr('#i-pickup-date', pickupDateConfig)
  returnDateInstance = flatpickr('#i-return-date', returnDateConfig)

  const dobConfig = {
    dateFormat: 'Y-m-d',
    maxDate: new Date(),
    yearRange: [1900, new Date().getFullYear()],
  }

  const expirationConfig = {
    dateFormat: 'Y-m-d',
    minDate: 'today',
  }

  flatpickr('#i-date-of-birth', dobConfig)
  flatpickr('#i-expiration-date', expirationConfig)

  initializePickupLocation()
}

function showDateAlert(message) {
  const errorAlert = document
    .querySelector('#i-return-date')
    .closest('.f-field-wrapper')
    .querySelector('.error-alert-bg')

  errorAlert.querySelector('.error-alert-text').textContent = message
  errorAlert.classList.remove('is-hidden')

  setTimeout(() => {
    errorAlert.classList.add('is-hidden')
  }, 5000)
}
