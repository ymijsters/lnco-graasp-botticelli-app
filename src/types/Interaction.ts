import { UUID } from '@graasp/sdk';

import { ChatSettingsType } from '@/config/appSettings';

import Agent from './Agent';
import Exchange from './Exchange';

type Interaction = ChatSettingsType & {
  id: UUID;
  currentExchange: number;
  completed: boolean;
  started: boolean;
  participant: Agent;
  exchanges: { exchangeList: Exchange[] };
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Interaction;
