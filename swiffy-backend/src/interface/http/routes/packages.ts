import express from 'express';

const router = express.Router();

// 📦 Retourner tous les types de forfaits disponibles
router.get('/', (req, res) => {
  const packages = ['Simple', 'Confort', 'Premium'];
  res.json(packages);
});

export default router;
