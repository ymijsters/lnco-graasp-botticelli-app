import { UUID } from '@graasp/sdk';

import Agent from '@/types/Agent';

type AssistantSettings = Omit<Agent, 'type'>;

export type AssistantsSettingsType = {
  assistantList: AssistantSettings[];
};

export type ChatSettingsType = {
  description: string;
  participantInstructions: string;
  participantEndText: string;
};

export type ExchangeSettings = {
  id: UUID;
  assistant: AssistantSettings;
  description: string;
  chatbotInstructions: string;
  participantCue: string;
  nbFollowUpQuestions: number;
  participantInstructionsOnComplete?: string;
  hardLimit: boolean;
};

export type ExchangesSettingsType = { exchangeList: ExchangeSettings[] };
