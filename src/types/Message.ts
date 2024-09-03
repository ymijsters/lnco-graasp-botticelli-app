import { UUID } from '@graasp/sdk';

import Agent from './Agent';

export interface Message {
  id: UUID;
  content: string;
  sender: Agent;
  updatedAt?: string;
  createdAt?: string;
}
