export interface Profile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  groupId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileDisplayProps {
  onEditPress: () => void;
}

export interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}
