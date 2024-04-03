import Agent from './Agent';
import Exchange from './Exchange';

type Interaction = {
  id: number;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  participantInstructionsOnComplete: string;
  name: string;
  currentExchange: number;
  completed: boolean;
  started: boolean;
  participant: Agent;
  exchanges: Exchange[];
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Interaction;
