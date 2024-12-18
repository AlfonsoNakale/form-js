export const UI_STATES = {
  setLoading: (form, isLoading) => {
    const submitButton = form.querySelector('button[type="submit"]')
    if (isLoading) {
      submitButton.disabled = true
      submitButton.innerHTML =
        '<span class="loading-spinner"></span> Submitting...'
    } else {
      submitButton.disabled = false
      submitButton.innerHTML = 'Submit Booking'
    }
  },

  showNotification: (message, type = 'success') => {
    const alertClass =
      type === 'success' ? 'success-alert-bg' : 'error-alert-bg'
    const alert = document.querySelector(`.${alertClass}`)
    if (alert) {
      alert.querySelector('.alert-text').textContent = message
      alert.classList.remove('is-hidden')
      setTimeout(() => alert.classList.add('is-hidden'), 5000)
    }
  },
}
