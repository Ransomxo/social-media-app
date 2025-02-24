import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { TeamController } from '../controllers/team.controller';
import { checkTeamAccess } from '../middleware/team';

const router = Router();

// Create a new team
router.post('/', authMiddleware, TeamController.createTeam);

// Add a member to a team
router.post('/:teamId/members', authMiddleware, checkTeamAccess(['admin']), TeamController.addMember);

// Remove a member from a team
router.delete('/:teamId/members/:userId', authMiddleware, checkTeamAccess(['admin']), TeamController.removeMember);

// Update a member's role
router.put('/:teamId/members/:userId/role', authMiddleware, checkTeamAccess(['admin']), TeamController.updateMemberRole);

// Get team members
router.get('/:teamId/members', authMiddleware, checkTeamAccess(['admin', 'editor', 'viewer']), TeamController.getTeamMembers);

export default router;
