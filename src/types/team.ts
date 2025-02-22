export interface CreateTeamDto {
  name: string;
}

export interface UpdateTeamDto {
  name?: string;
}

export interface InviteTeamMemberDto {
  email: string;
  role?: 'member' | 'admin';
}

export interface TeamResponse {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMemberResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberResponse {
  id: string;
  userId: string;
  teamId: string;
  role: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
