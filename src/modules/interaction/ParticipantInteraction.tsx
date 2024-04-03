import { ReactElement, useState } from 'react';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import MessagesPane from '@/modules/message/MessagesPane';
import Agent from '@/types/Agent';
import Interaction from '@/types/Interaction';

const ParticipantInteraction = (): ReactElement => {
  const participantId = '0';

  const artificialAssistant: Agent = {
    id: '1',
    name: 'Assistant',
    description: 'Assistant Description',
    type: 'bot',
  };

  const defaultInteraction: Interaction = {
    id: 0,
    description: 'Default Description',
    modelInstructions: '',
    participantInstructions: 'Welcome to our interaction!',
    participantInstructionsOnComplete: 'Done!',
    name: 'Default Name',
    currentExchange: 0,
    started: false,
    completed: false,
    participant: {
      id: participantId,
      type: 'user',
      description: 'User Description',
      name: 'User',
    },
    exchanges: [
      {
        id: 0,
        name: 'Exchange 1',
        description: 'Exchange 1 Description',
        instructions: 'Instructions',
        participantInstructionsOnComplete: "You're done.",
        cue: 'Hi! This is exchange 1.',
        order: 0,
        messages: [],
        assistant: artificialAssistant,
        triggers: [],
        started: false,
        completed: false,
        dismissed: false,
        softLimit: 2,
        hardLimit: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 1,
        name: 'Exchange 2',
        description: 'Exchange 2 Description',
        instructions: 'Instructions',
        participantInstructionsOnComplete: "You're done.",
        cue: 'Hi! This is exchange 2.',
        order: 1,
        messages: [],
        assistant: artificialAssistant,
        triggers: [],
        started: false,
        completed: false,
        dismissed: false,
        softLimit: 5,
        hardLimit: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [interaction, setInteraction] =
    useState<Interaction>(defaultInteraction);

  function startInteraction(): void {
    const updatedInteraction = { ...interaction };
    updatedInteraction.started = true;
    updatedInteraction.startedAt = new Date();
    setInteraction(updatedInteraction);
  }

  const goToNextExchange = (): void => {
    const updatedInteraction = { ...interaction };
    const numExchanges = interaction.exchanges.length;
    const { currentExchange } = interaction;
    if (currentExchange === numExchanges - 1) {
      updatedInteraction.completed = true;
      updatedInteraction.completedAt = new Date();
      setInteraction(updatedInteraction);
    } else {
      updatedInteraction.currentExchange = interaction.currentExchange + 1;
      setInteraction(updatedInteraction);
    }
  };

  if (!interaction) {
    return <div>Interaction Not Found</div>;
  }

  const handleStartInteraction = (): void => {
    startInteraction();
  };

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
          <Typography variant="h3" sx={{ p: 10, textAlign: 'center' }}>
            {interaction.participantInstructions}
          </Typography>
        )}
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 3, mx: 'auto' }}
          onClick={handleStartInteraction}
        >
          Start
        </Button>
      </Box>
    );
  }

  return interaction.completed ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" sx={{ p: 10, textAlign: 'center' }}>
        {interaction.participantInstructionsOnComplete}
      </Typography>
    </Box>
  ) : (
    <MessagesPane
      goToNextExchange={goToNextExchange}
      exchange={interaction.exchanges[interaction.currentExchange]}
      participantId={participantId}
      readOnly={false}
    />
  );
};

export default ParticipantInteraction;
