export interface Organization {
  id: string;
  name: string;
  role: string;
  memberCount: number;
  joinedAt: string;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  role: string;
  status: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    email: string | null;
  };
}

export interface OrganizationInvite {
  id: string;
  email: string;
  token: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  organization: {
    id: string;
    name: string;
  };
  inviter: {
    username: string;
  };
}
