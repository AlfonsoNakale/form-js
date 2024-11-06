// Import dependencies using ESM syntax
import {
  initializeDatePickers,
  initializeVehicleSelection,
  initializeExtras,
  initializeCurrencyToggle,
  calculateTotals,
  populateCountrySelect,
} from './modules/index.js'

import './modules/extras.js'
import './modules/apiExchange.js'
import './modules/calculations.js'
import './modules/apiChoice.js'
import './modules/datePickers.js'
import './modules/vehicleSelection.js'

const initializeBookingForm = async () => {
  try {
    const form = document.querySelector('#booking_form')
    if (!form) throw new Error('Booking form not found')

    form.classList.add('loading')

    await populateCountrySelect()

    await Promise.all([
      initializeDatePickers(),
      initializeVehicleSelection(),
      initializeExtras(),
      initializeCurrencyToggle(),
    ])

    handleFormSubmission()
    calculateTotals()
    form.classList.remove('loading')
  } catch (error) {
    console.error('Error initializing booking form:', error)
    showError(
      'There was an error loading the booking form. Please refresh the page.'
    )
  }
}

const handleFormSubmission = () => {
  const form = document.querySelector('#wf-form-Booking-form')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    try {
      form.classList.add('submitting')

      if (!validateForm(form)) {
        throw new Error('Please fill in all required fields')
      }

      const formData = new FormData(form)
      await submitForm(formData)
      showSuccess('Booking submitted successfully!')
    } catch (error) {
      console.error('Form submission error:', error)
      showError(error.message)
    } finally {
      form.classList.remove('submitting')
    }
  })
}

const submitForm = async (formData) => {
  console.log('Form data:', Object.fromEntries(formData))
}

const validateForm = (form) => {
  const requiredFields = form.querySelectorAll('[required]')
  return Array.from(requiredFields).every((field) => field.value.trim() !== '')
}

const showError = (message) => {
  const errorAlert = document.querySelector('.error-alert-bg')
  if (errorAlert) {
    errorAlert.querySelector('.error-alert-text').textContent = message
    errorAlert.classList.remove('is-hidden')
    setTimeout(() => errorAlert.classList.add('is-hidden'), 5000)
  }
}

const showSuccess = (message) => {
  const successAlert = document.querySelector('.success-alert-bg')
  if (successAlert) {
    successAlert.querySelector('.success-alert-text').textContent = message
    successAlert.classList.remove('is-hidden')
    setTimeout(() => successAlert.classList.add('is-hidden'), 5000)
  }
}

initializeBookingForm()

//alert('Hello World')
