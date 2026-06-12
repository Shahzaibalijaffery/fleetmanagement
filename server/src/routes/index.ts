import { Router } from 'express';

import { assignmentsRoutes } from '../features/assignments/assignments.routes';
import { authRoutes } from '../features/auth/auth.routes';
import { carsRoutes } from '../features/cars/cars.routes';
import { contractsRoutes } from '../features/contracts/contracts.routes';
import { dashboardRoutes } from '../features/dashboard/dashboard.routes';
import { marketplaceRoutes } from '../features/marketplace/marketplace.routes';
import { profileRoutes } from '../features/profile/profile.routes';
import { requestsRoutes } from '../features/requests/requests.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/cars', carsRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/requests', requestsRoutes);
router.use('/assignments', assignmentsRoutes);
router.use('/contracts', contractsRoutes);
router.use('/dashboard', dashboardRoutes);
// router.use('/trips', tripRoutes);

export { router as apiRouter };
