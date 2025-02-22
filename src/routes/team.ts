import { Router } from 'express';
import { TeamController } from '../controllers/team';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', TeamController.createTeam);
router.get('/', TeamController.getTeams);
router.put('/:teamId', TeamController.updateTeam);
router.post('/:teamId/members', TeamController.inviteTeamMember);
router.delete('/:teamId/members/:memberId', TeamController.removeTeamMember);

export default router;
