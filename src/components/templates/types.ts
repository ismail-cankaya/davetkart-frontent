import { Invitation } from '../../types';

export interface TemplateProps {
  invitation: Invitation;
  mode?: 'preview' | 'live';
}
