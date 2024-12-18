// Import dependencies using ESM syntax
import {
  initializeDatePickers,
  initializeVehicleSelection,
  initializeExtras,
  initializeCurrencyToggle,
  calculateTotals,
  populateCountrySelect,
} from './modules/index.js'
import { bookingService } from './services/bookingService'

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
  try {
    const bookingData = {
      email_address: formData.get('email-address'),
      pickup_date: new Date(formData.get('pickup-date')).toISOString(),
      return_date: new Date(formData.get('return-date')).toISOString(),
      pickup_location: formData.get('pickup-location'),
      return_location: formData.get('return-location'),
      vehicle_id: formData.get('vehicle'),

      // Waivers and Add-ons
      nad_45000_excess_waiver:
        formData.get('NAD-45-000.00-Excess-Waiver') === 'true',
      tyre_glass_waiver: formData.get('Tyre-Glass-Waiver') === 'true',
      cross_border_charge: formData.get('Cross-Border-Charge') === 'true',
      satellite_phone_high_excess:
        formData.get('Satellite-Phone-N-6000-Excess') === 'true',
      satellite_phone_zero_excess:
        formData.get('Satellite-Phone-Zero-Excess') === 'true',
      camping_equipment_double_cab:
        formData.get('Camping-Equipment---Double-Cab') === 'true',
      roof_tents_required: formData.get('Roof-Tents-Required') === 'true',
      engel_fridge_freezer: formData.get('Engel-40L-Fridge-Freezer') === 'true',
      bedding:
        formData.get('Bedding-incl.-1x-sleeping-bag-1x-pillow') === 'true',
      gps_system: formData.get('GPS-System') === 'true',
      sat_phone_minutes: parseInt(formData.get('SAT-Phone-Minutes') || '0'),
      kitchen_wash_up_kit:
        formData.get(
          'Kitchen-wash-up-kit-small-dish-wash-liquid-2x-drying-cloth-2x-sponge-2x-cleaning-cloth-extras'
        ) === 'true',
      ground_tent: formData.get('Ground-Tent') === 'true',
      jerry_can: formData.get('Jerry-Can') === 'true',
      baby_seat: formData.get('Baby-Seat') === 'true',

      // Personal Information
      first_name: formData.get('first-name'),
      last_name: formData.get('last-name'),
      phone_number: formData.get('phone-number'),
      street_address: formData.get('street-address'),
      city: formData.get('city'),
      street: formData.get('street'),
      zip: formData.get('zip'),
      country: formData.get('country'),
      date_of_birth: formData.get('date-of-birth'),
      number_of_people: parseInt(formData.get('number-of-people') || '0'),
      passport_number: formData.get('passport-number'),
      expiration_date: formData.get('expiration-date'),
      driver_license: formData.get('driver-license'),

      // Payment Information
      total_amount: parseFloat(
        document.querySelector('#v-calc-total').textContent
      ),
      currency: document.querySelector('input[name="currency-group"]:checked')
        .value,
    }

    // Create the booking
    const booking = await bookingService.createBooking(bookingData)
    console.log('Booking created:', booking)

    showSuccess('Booking submitted successfully!')
    return booking
  } catch (error) {
    console.error('Error submitting form:', error)
    showError(error.message)
    throw error
  }
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
