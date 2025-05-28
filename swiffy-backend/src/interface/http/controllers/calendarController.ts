import { Request, Response } from 'express';
import { google } from 'googleapis';

export const checkAvailabilityController = async (req: Request, res: Response):Promise<void> => {
  try {
    const { start, end } = req.body;

    if (!start || !end) {
       res.status(400).json({ error: 'start et end sont requis' });
       return;
    }

    const calendar = google.calendar('v3');

    // @ts-ignore - ajout temporaire, car `user` n'est pas typé
    const oauth2Client = req.oauthClient;
    const calendarId = 'primary';

    const response = await calendar.events.list({
      calendarId,
      auth: oauth2Client,
      timeMin: new Date(start).toISOString(),
      timeMax: new Date(end).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const conflict = events.find(event => {
      const eventStart = new Date(event.start?.dateTime || '').getTime();
      const eventEnd = new Date(event.end?.dateTime || '').getTime();
      const reqStart = new Date(start).getTime();
      const reqEnd = new Date(end).getTime();

      return reqStart < eventEnd && reqEnd > eventStart;
    });

    if (conflict) {
      res.status(200).json({
        available: false,
        conflict: conflict.summary,
      });
      return;
    }

    res.status(200).json({ available: true });
  } catch (error) {
    console.error('Erreur de vérification de disponibilité :', error);
    res.status(500).json({ error: 'Erreur interne' });
    return;
  }
};
