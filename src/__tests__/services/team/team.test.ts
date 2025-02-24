import { TeamService } from '../../../services/team/team.service';
import { prismaMock } from '../../setup/setup';
import { AppError } from '../../../utils/errors/AppError';

describe('TeamService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addMember', () => {
    it('should add a team member', async () => {
      const mockTeamMember = {
        id: '1',
        teamId: '1',
        userId: '2',
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.teamMember.findFirst.mockResolvedValue(null);
      prismaMock.teamMember.create.mockResolvedValue(mockTeamMember);

      const result = await TeamService.addMember('1', '2', 'member');

      expect(result).toEqual(mockTeamMember);
      expect(prismaMock.teamMember.create).toHaveBeenCalledWith({
        data: {
          teamId: '1',
          userId: '2',
          role: 'member'
        }
      });
    });

    it('should throw error if member already exists', async () => {
      const existingMember = {
        id: '1',
        teamId: '1',
        userId: '2',
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.teamMember.findFirst.mockResolvedValue(existingMember);

      await expect(
        TeamService.addMember('1', '2', 'member')
      ).rejects.toThrow('User is already a team member');
    });

    it('should handle database errors', async () => {
      prismaMock.teamMember.findFirst.mockResolvedValue(null);
      prismaMock.teamMember.create.mockRejectedValue(new Error('Database error'));

      await expect(
        TeamService.addMember('1', '2', 'member')
      ).rejects.toThrow('Failed to add team member');
    });

    it('should validate required parameters', async () => {
      await expect(
        TeamService.addMember('', '2', 'member')
      ).rejects.toThrow('Missing required parameters');

      await expect(
        TeamService.addMember('1', '', 'member')
      ).rejects.toThrow('Missing required parameters');

      await expect(
        TeamService.addMember('1', '2', '')
      ).rejects.toThrow('Missing required parameters');
    });
  });
});
