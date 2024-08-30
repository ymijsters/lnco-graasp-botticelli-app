import { Member } from '@graasp/sdk';

import { t } from 'i18next';
import { v4 as uuidv4 } from 'uuid';

import { defaultSettingsValues } from '@/modules/context/SettingsContext';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';
import Exchange from '@/types/Exchange';
import Interaction from '@/types/Interaction';

export const MIN_FOLLOW_UP_QUESTIONS: number = 0;
export const MAX_FOLLOW_UP_QUESTIONS: number = 400;
export const MAX_TEXT_INPUT_CHARS: number = 5000;

// Define a default user as an agent
export const defaultUser: Agent = {
  id: uuidv4(),
  name: 'Default User',
  description: 'Default user description',
  type: AgentType.User,
};

// Define a default assistant as an agent
export const defaultAssistant: Agent = {
  id: uuidv4(),
  name: 'Default Assistant',
  description: 'Default assistant description',
  type: AgentType.Assistant,
};

// Define a default interaction object using default settings
export const defaultInteraction: Interaction = {
  ...defaultSettingsValues.chat,
  id: uuidv4(),
  currentExchange: 0,
  started: false,
  completed: false,
  participant: defaultUser,
  exchanges: { exchangeList: [] },
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Define a default exchange object using default settings
export const defaultExchange: Exchange = {
  ...defaultSettingsValues.exchanges.exchangeList[0],
  messages: [],
  assistant: defaultAssistant,
  started: false,
  completed: false,
  dismissed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const placeholderMember: Member = {
  id: '',
  name: t('CONVERSATIONS.PLACEHOLDER'),
  email: '',
};
