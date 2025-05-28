// /src/services/jwtService.ts
import jwt from 'jsonwebtoken';

const secretKey = "ton_secret_key"; // Ta clé secrète pour signer les tokens

// Fonction pour générer un token JWT
export const generateJWT = (userId: string) => {
  const payload = {
    userId: userId,  // ID de l'utilisateur, tu peux y ajouter plus de données si nécessaire
  };

  const options: jwt.SignOptions = {
    expiresIn: '1h', // Le token expirera dans 1 heure
  };
  const secretKey = process.env.JWT_SECRET || 'ton_secret_key';
  // Signature du JWT avec la clé secrète et les options
  return jwt.sign(payload, secretKey, options);
};

// Fonction pour vérifier un token JWT
export const verifyJWT = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};
