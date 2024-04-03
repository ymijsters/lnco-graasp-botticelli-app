import Agent from './Agent';
import { Message } from './Message';
import Trigger from './Trigger';

type Exchange = {
  id: number;
  name: string;
  description: string;
  instructions: string;
  participantInstructionsOnComplete: string;
  cue: string;
  order: number;
  messages: Message[];
  assistant: Agent;
  triggers: Trigger[];
  started: boolean;
  completed: boolean;
  dismissed: boolean;
  softLimit: number;
  hardLimit: number;
  startedAt?: Date;
  completedAt?: Date;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Exchange;
