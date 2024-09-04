import { FC, ReactElement, createContext, useContext } from 'react';

import { v4 as uuidv4 } from 'uuid';

import {
  AssistantsSettingsType,
  ChatSettingsType,
  ExchangesSettingsType,
} from '@/config/appSettings';

import { hooks, mutations } from '../../config/queryClient';
import Loader from '../common/Loader';

// mapping between Setting names and their data type
type AllSettingsType = {
  assistants: AssistantsSettingsType;
  chat: ChatSettingsType;
  exchanges: ExchangesSettingsType;
};

// default values for the data property of settings by name
export const defaultSettingsValues: AllSettingsType = {
  assistants: {
    assistantList: [{ id: uuidv4(), name: '', description: '' }],
  },
  chat: {
    name: '',
    description: '',
    participantInstructions: '',
    participantEndText: '',
    sendAllToChatbot: false,
  },
  exchanges: {
    exchangeList: [
      {
        id: uuidv4(),
        name: '',
        assistant: {
          id: '',
          name: '',
          description: '',
        },
        description: '',
        chatbotInstructions: '',
        participantCue: '',
        participantInstructionsOnComplete: '',
        nbFollowUpQuestions: 0,
        hardLimit: false,
      },
    ],
  },
};

// list of the settings names
const ALL_SETTING_NAMES = [
  // name of your settings
  'assistants',
  'chat',
  'exchanges',
] as const;

// automatically generated types
type AllSettingsNameType = (typeof ALL_SETTING_NAMES)[number];
export type AllSettingsDataType = AllSettingsType[keyof AllSettingsType];

export type SettingsContextType = AllSettingsType & {
  saveSettings: (
    name: AllSettingsNameType,
    newValue: AllSettingsDataType,
  ) => void;
};

const defaultContextValue = {
  ...defaultSettingsValues,
  saveSettings: () => null,
};

const SettingsContext = createContext<SettingsContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const SettingsProvider: FC<Prop> = ({ children }) => {
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();
  const {
    data: appSettingsList,
    isLoading,
    isSuccess,
  } = hooks.useAppSettings();

  const saveSettings = (
    name: AllSettingsNameType,
    newValue: AllSettingsDataType,
  ): void => {
    if (appSettingsList) {
      const previousSetting = appSettingsList.find((s) => s.name === name);
      // setting does not exist
      if (!previousSetting) {
        postAppSetting({
          data: newValue,
          name,
        });
      } else {
        patchAppSetting({
          id: previousSetting.id,
          data: newValue,
        });
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const getContextValue = (): SettingsContextType => {
    if (isSuccess) {
      const allSettings: AllSettingsType = ALL_SETTING_NAMES.reduce(
        <T extends AllSettingsNameType>(acc: AllSettingsType, key: T) => {
          const setting = appSettingsList.find((s) => s.name === key);
          if (setting) {
            const settingData =
              setting?.data as unknown as AllSettingsType[typeof key];
            acc[key] = settingData;
          } else {
            acc[key] = defaultSettingsValues[key];
          }
          return acc;
        },
        defaultSettingsValues,
      );
      return {
        ...allSettings,
        saveSettings,
      };
    }
    return defaultContextValue;
  };

  const contextValue = getContextValue();

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType =>
  useContext<SettingsContextType>(SettingsContext);
