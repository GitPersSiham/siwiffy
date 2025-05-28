// infrastructure/services/googleCalendarService.ts
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export class GoogleCalendarService {
  static async isTimeSlotAvailable(auth: any, start: string, end: string): Promise<boolean> {
    const calendar = google.calendar({ version: 'v3', auth });

    console.log(`Checking availability from ${start} to ${end}`);
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: 'startTime'
    });

    console.log('Google Calendar response:', response.data.items);
    if (response.data.items && response.data.items.length > 0) {
      // Vérifier les chevauchements
      for (const event of response.data.items) {
        const eventStart = new Date(event.start?.dateTime || event.start?.date || '').getTime();
        const eventEnd = new Date(event.end?.dateTime || event.end?.date || '').getTime();
        const requestedStart = new Date(start).getTime();
        const requestedEnd = new Date(end).getTime();
        const tolerance = 15 * 60 * 1000; 
        // Si   console.log(`Event conflict: ${event.summary} - Start: ${new Date(eventStart).toLocaleString()}, End: ${new Date(eventEnd).toLocaleString()}`);
        console.log(`Event conflict: ${event.summary} - Start: ${new Date(eventStart).toLocaleString()}, End: ${new Date(eventEnd).toLocaleString()}`);
        console.log(`Requested Start: ${new Date(requestedStart).toLocaleString()}, Requested End: ${new Date(requestedEnd).toLocaleString()}`);
    // Vérifier le chevauchementl'événement existe dans le même créneau horaire (ou chevauche)
        if (
          (requestedStart < eventEnd && requestedEnd > eventStart) || 
          (requestedStart === eventStart && requestedEnd === eventEnd) 
        ) {
          console.log(`Event conflict: ${event.summary} - Start: ${eventStart}, End: ${eventEnd}`);
          return false; // Le créneau est occupé
        }
      }
    }
  
    return true; // Aucun conflit trouvé
  }

  static async createEvent(auth: any, eventDetails: any) {
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventDetails,
    });

    return response.data;
  }
}
