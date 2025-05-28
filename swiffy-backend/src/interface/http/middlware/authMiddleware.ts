  import { Request, Response, NextFunction } from 'express';
  import jwt from 'jsonwebtoken';
  import { OAuth2Client } from 'google-auth-library';
  import { UserRepositoryMongo } from '../../../infrastracture/db/repositories/UserRepositoryMongo';

  const userRepository = new UserRepositoryMongo();
  const secretKey = process.env.JWT_SECRET || 'your_secret_key';

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID, 
    process.env.GOOGLE_CLIENT_SECRET, 
    process.env.GOOGLE_REDIRECT_URI
  );

  export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

      // Vérifier si le token est présent
      if (!token) {
        res.status(403).json({ error: 'Token manquant' });
        return;
      }

      // Vérifier et décoder le JWT
      const decoded = jwt.verify(token, secretKey);
      req.body.user = decoded;

      // Vérifier si le corps de la requête est bien valide et non vide
      if (!req.body || Object.keys(req.body).length === 0) {
         res.status(400).json({ error: 'Corps de la requête manquant ou mal formaté' });
      }

      // Récupérer l'utilisateur à partir de la base de données
      const user = await userRepository.findById(req.body.user.userId); 
      if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
      }

      // Vérifier si le token d'accès Google est présent
      if (!user.googleAccessToken) {
         res.status(400).json({ error: 'Google access token manquant' });
         return;
      }

      // Configurer OAuth2 client avec le token Google
      oauth2Client.setCredentials({
        access_token: user.googleAccessToken, // Google access token de l'utilisateur
      });

      console.log('Decoded JWT:', decoded);
      console.log('User from DB:', user);

      req.body.oauthClient = oauth2Client;  // Vous pouvez ajouter oauthClient à la requête pour l'utiliser dans d'autres middlewares

      next(); // Passer au middleware ou handler suivant
    } catch (error) {
      console.error('Erreur dans le middleware d\'authentification:', error);
      res.status(401).json({ error: 'Token invalide ou expiré' });
      return;
    }
  };
