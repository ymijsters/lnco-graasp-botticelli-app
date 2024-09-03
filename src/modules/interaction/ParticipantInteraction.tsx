import {
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UseTranslationResponse, useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { LocalContext, useLocalContext } from '@graasp/apps-query-client';

import {
  defaultAssistant,
  defaultExchange,
  defaultInteraction,
  defaultUser,
} from '@/config/config';
import { hooks, mutations } from '@/config/queryClient';
import { START_INTERACTION_BUTTON_CY } from '@/config/selectors';
import MessagesPane from '@/modules/message/MessagesPane';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';
import Exchange from '@/types/Exchange';
import Interaction from '@/types/Interaction';

import { SettingsContextType, useSettings } from '../context/SettingsContext';

// Main component: ParticipantInteraction
const ParticipantInteraction = (): ReactElement => {
  // Getting the participant ID from local context
  const { memberId: participantId }: LocalContext = useLocalContext();

  const { data: appDatas } = hooks.useAppData<Interaction>();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { chat, exchanges }: SettingsContextType = useSettings();

  const { t }: UseTranslationResponse<'translations', undefined> =
    useTranslation();

  // Define the current member as an agent, merging with the default user
  const currentMember: Agent = {
    ...defaultUser,
    ...hooks
      .useAppContext()
      // Find the member in app context data by participant ID
      .data?.members.find((member) => member.id === participantId),
  };

  /**
   * @function createInteractionFromTemplate
   * @description Creates and returns a new `Interaction` object by merging default settings with chat and exchange settings.
   * @returns {Interaction} A fully constructed `Interaction` object with merged settings.
   */
  function createInteractionFromTemplate(): Interaction {
    // Merge chat settings with default interaction
    const interactionBase: Interaction = {
      ...defaultInteraction,
      ...chat,
      participant: currentMember,
    };
    interactionBase.exchanges.exchangeList = exchanges.exchangeList.map(
      (exchange) => ({
        // Merge default exchange with each exchange from settings
        ...defaultExchange,
        ...exchange,
        assistant: {
          ...defaultAssistant,
          ...exchange.assistant,
          type: AgentType.Assistant,
        },
      }),
    );
    return interactionBase;
  }

  // Memoize the current app data for the participant
  const currentAppData = useMemo(
    () =>
      appDatas?.find(
        (appData) =>
          appData?.data?.exchanges && appData.member.id === participantId,
      ),
    [appDatas, participantId],
  );

  // Ref to track if the app data has already been posted
  const hasPosted: MutableRefObject<boolean> = useRef(!!currentAppData);

  // State to manage the current interaction, either from existing data or a new template
  const [interaction, setInteraction]: [
    Interaction,
    Dispatch<SetStateAction<Interaction>>,
  ] = useState<Interaction>(
    (currentAppData?.data as Interaction) || createInteractionFromTemplate(),
  );

  // Effect to post the interaction data if it hasn't been posted yet
  useEffect((): void => {
    if (!hasPosted.current) {
      postAppData({ data: interaction, type: 'Interaction' });
      hasPosted.current = true;
    }
  }, [interaction, postAppData]);

  // Effect to patch the interaction data if it has been posted and current app data exists
  useEffect((): void => {
    if (hasPosted.current && currentAppData?.id) {
      patchAppData({
        id: currentAppData.id,
        data: interaction,
      });
    }
  }, [interaction, patchAppData, currentAppData?.id]);

  // Callback to update a specific exchange within the interaction
  const updateExchange = useCallback((updatedExchange: Exchange): void => {
    setInteraction(
      (prevState: Interaction): Interaction => ({
        ...prevState,
        exchanges: {
          exchangeList: prevState.exchanges.exchangeList.map((exchange) =>
            exchange.id === updatedExchange.id ? updatedExchange : exchange,
          ),
        },
      }),
    );
  }, []);

  // Effect to handle actions when the user tries to leave the page (before unload)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): string => {
      if (!interaction.completed) {
        // If the interaction is not completed, prompt the user before leaving
        event.preventDefault();
        const confirmationMessage = 'Are you sure you want to leave?';
        // eslint-disable-next-line no-param-reassign
        event.returnValue = confirmationMessage; // For Chrome
        return confirmationMessage; // For standard browsers
      }
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [interaction.completed]);

  // Function to start the interaction
  const startInteraction = (): void => {
    setInteraction(
      (prev: Interaction): Interaction => ({
        ...prev,
        started: true,
        startedAt: new Date(),
      }),
    );
  };

  // Function to move to the next exchange or complete the interaction
  const goToNextExchange = (): void => {
    setInteraction((prev: Interaction): Interaction => {
      const numExchanges: number = prev.exchanges.exchangeList.length;
      if (prev.currentExchange === numExchanges - 1) {
        // If this is the last exchange, mark the interaction as completed
        return {
          ...prev,
          completed: true,
          completedAt: new Date(),
        };
      }
      return {
        ...prev,
        // Move to the next exchange
        currentExchange: prev.currentExchange + 1,
      };
    });
  };

  // Render fallback if interaction data is not available
  if (!interaction) {
    return <div>Interaction Not Found</div>;
  }

  // Handle the start of the interaction
  const handleStartInteraction: () => void = (): void => {
    startInteraction();
  };

  // Render the start interaction button if the interaction has not started
  if (!interaction.started) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        {interaction.participantInstructions && (
          <Typography variant="body1" sx={{ p: 2, pt: 4, textAlign: 'center' }}>
            {interaction.participantInstructions}
          </Typography>
        )}
        <Button
          variant="contained"
          size="large"
          data-cy={START_INTERACTION_BUTTON_CY}
          sx={{ mt: 3, mx: 'auto' }}
          onClick={handleStartInteraction}
        >
          {t('START')}
        </Button>
      </Box>
    );
  }
  // Render the completed interaction message if the interaction is completed
  return interaction.completed ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Typography variant="body1" sx={{ p: 10, textAlign: 'center' }}>
        {interaction.participantEndText}
      </Typography>
    </Box>
  ) : (
    // Render the MessagesPane component to handle the conversation
    <MessagesPane
      goToNextExchange={goToNextExchange}
      autoDismiss={
        interaction.exchanges.exchangeList[interaction.currentExchange]
          .hardLimit
      } // Auto-dismiss exchanges if the hard limit is reached
      currentExchange={
        interaction.exchanges.exchangeList[interaction.currentExchange]
      }
      setExchange={updateExchange}
      interactionDescription={interaction.description}
      pastMessages={interaction.exchanges.exchangeList.flatMap((exchange) => {
        if (exchange.dismissed) {
          return exchange.messages;
        }
        return [];
      })}
      participant={currentMember}
      sendAllMessages={interaction.sendAllToChatbot}
    />
  );
};

// Export the ParticipantInteraction component as the default export
export default ParticipantInteraction;
