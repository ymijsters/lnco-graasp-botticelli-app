import { ExchangeSettings } from '@/config/appSettings';

import Agent from './Agent';
import { Message } from './Message';

type Exchange = ExchangeSettings & {
  assistant: Agent;
  messages: Message[];
  started: boolean;
  completed: boolean;
  dismissed: boolean;
  startedAt?: Date;
  completedAt?: Date;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Exchange;
