import { InvoiceSettings } from '../../models/InvoiceSettings.js';

/**
 * Pobiera ustawienia faktur z bazy danych
 * @returns {Promise<Object>} Ustawienia faktur
 */
export async function getInvoiceSettings() {
  try {
    // Pobierz pierwszy (i jedyny) rekord ustawień
    const settings = await InvoiceSettings.findOne();
    
    if (!settings) {
      // Jeśli nie ma ustawień, zwróć domyślne wartości
      return {
        seller_name: 'Jerzy Bobiński',
        seller_address_line1: 'ul. Jana Pawła II 66 lok. 2',
        seller_address_line2: '47-232 Kędzierzyn-Koźle',
        seller_nip: '7491021184',
        default_place_of_issue: 'Kędzierzyn-Koźle',
        default_due_in_days: 10,
        bank_account: '22 1240 1659 1111 0010 2591 2002'
      };
    }
    
    return settings.toJSON();
  } catch (error) {
    console.error('Błąd podczas pobierania ustawień faktur:', error);
    
    // W przypadku błędu zwróć domyślne wartości
    return {
      seller_name: 'Jerzy Bobiński',
      seller_address_line1: 'ul. Jana Pawła II 66 lok. 2',
      seller_address_line2: '47-232 Kędzierzyn-Koźle',
      seller_nip: '7491021184',
      default_place_of_issue: 'Kędzierzyn-Koźle',
      default_due_in_days: 10,
      bank_account: '22 1240 1659 1111 0010 2591 2002'
    };
  }
}

/**
 * Aktualizuje ustawienia faktur w bazie danych
 * @param {Object} newSettings - Nowe ustawienia
 * @returns {Promise<Object>} Zaktualizowane ustawienia
 */
export async function updateInvoiceSettings(newSettings) {
  try {
    let settings = await InvoiceSettings.findOne();
    
    if (settings) {
      // Aktualizuj istniejące ustawienia
      await settings.update(newSettings);
    } else {
      // Utwórz nowe ustawienia
      settings = await InvoiceSettings.create(newSettings);
    }
    
    return settings.toJSON();
  } catch (error) {
    console.error('Błąd podczas aktualizacji ustawień faktur:', error);
    throw error;
  }
} 