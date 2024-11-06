/**
 * API Choice Module
 * Handles country selection functionality using the REST Countries API
 * @module apiChoice
 */

import Choices from 'choices.js'

/**
 * Fetches country data from the REST Countries API
 * @async
 * @returns {Promise<Array>} Array of country objects, or empty array if fetch fails
 */
async function fetchCountries() {
  const API_URL = 'https://restcountries.com/v3.1/all'

  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  }
}

/**
 * Populates the country select dropdown with data from the REST Countries API
 * @async
 * @exports populateCountrySelect
 */
export const populateCountrySelect = async () => {
  const countrySelect = document.querySelector('#i-country')
  if (!countrySelect) {
    console.warn('Country select element not found')
    return
  }

  try {
    // Initialize Choices.js dropdown with configuration
    const choices = new Choices(countrySelect, {
      searchEnabled: true,
      searchPlaceholderValue: 'Search for a country',
      placeholder: true,
      placeholderValue: 'Select a country',
      removeItemButton: true,
      silent: true,
    })

    // Fetch and format country data
    const countries = await fetchCountries()
    const formattedChoices = formatCountryChoices(countries)

    // Update the dropdown with formatted choices
    choices.setChoices(formattedChoices, 'value', 'label', true)
  } catch (error) {
    console.error('Error initializing country select:', error)
  }
}

/**
 * Formats country data for the Choices.js dropdown
 * @param {Array} countries - Array of country objects from the API
 * @returns {Array} Formatted array of choice objects
 */
function formatCountryChoices(countries) {
  return countries
    .sort((a, b) => a.name.common.localeCompare(b.name.common))
    .map((country) => ({
      value: country.cca2,
      label: country.name.common,
    }))
}
