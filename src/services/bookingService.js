import { supabase } from '../config/supabaseConfig'

class BookingService {
  async createBooking(bookingData) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  async getBooking(id) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching booking:', error)
      throw error
    }
  }

  async checkVehicleAvailability(vehicleId, pickupDate, returnDate) {
    try {
      // Convert dates to PostgreSQL timestamp format
      const formattedPickup = new Date(pickupDate).toISOString()
      const formattedReturn = new Date(returnDate).toISOString()

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .neq('status', 'cancelled')
        .or(
          `pickup_date.lte.${formattedReturn},return_date.gte.${formattedPickup}`
        )

      if (error) throw error
      return data.length === 0 // true if vehicle is available
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    }
  }
}

export const bookingService = new BookingService()
