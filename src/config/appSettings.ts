import { UUID } from '@graasp/sdk';

import Agent from '@/types/Agent';

export type AssistantSettings = Omit<Agent, 'type'>;

export type AssistantsSettingsType = {
  assistantList: AssistantSettings[];
};

export type ChatSettingsType = {
  name: string;
  description: string;
  participantInstructions: string;
  participantEndText: string;
  sendAllToChatbot: boolean;
};

export type ExchangeSettings = {
  id: UUID;
  name: string;
  assistant: AssistantSettings;
  description: string;
  chatbotInstructions: string;
  participantCue: string;
  nbFollowUpQuestions: number;
  participantInstructionsOnComplete?: string;
  hardLimit: boolean;
};

export type ExchangesSettingsType = { exchangeList: ExchangeSettings[] };
