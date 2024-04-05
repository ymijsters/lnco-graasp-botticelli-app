import { ReactElement, useState } from 'react';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import MessagesPane from '@/modules/message/MessagesPane';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';
import Interaction from '@/types/Interaction';

const ParticipantInteraction = (): ReactElement => {
  const participantId = '0';

  const artificialAssistant: Agent = {
    id: '1',
    name: 'Assistant',
    description: 'Assistant Description',
    type: AgentType.Assistant,
  };

  const defaultInteraction: Interaction = {
    id: 0,
    description: 'Default Description',
    modelInstructions: '',
    participantInstructions: `Thanks for participating! Now that the concert is over, you will hold a short interaction with an artificial agent. The agent will ask you three general questions about your experience during the concert, along with some follow up questions. The whole interaction should last between 5 and 10 minutes. Note that your responses are entirely anonymous, but if you provide any personal information, you might be identifiable. Please click start to get started.`,
    participantInstructionsOnComplete: `Thank you for participating in this short interaction.`,
    name: 'Default Name',
    currentExchange: 0,
    started: false,
    completed: false,
    participant: {
      id: participantId,
      type: AgentType.Assistant,
      description: 'User Description',
      name: 'User',
    },
    exchanges: [
      {
        id: 0,
        name: 'Exchange 1',
        description: 'Exchange 1 Description',
        instructions: 'Instructions',
        participantInstructionsOnComplete: `Thanks for answering this question. You can go on to the next question by clicking on "Next".`,
        cue: `Hi! Let's start by discussing what was going on in your mind during the concert. What images came to mind? What were you thinking about?`,
        order: 0,
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
      {
        id: 1,
        name: 'Exchange 2',
        description: 'Exchange 2 Description',
        instructions: 'Instructions',
        participantInstructionsOnComplete: `Thanks for answering this question. You can go on to the next question by clicking on "Next".`,
        cue: `Now let's try to understand a bit more the nature of what was going on in your mind. Were you thinking about realistic images or more abstract thoughts?`,
        order: 2,
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
      {
        id: 1,
        name: 'Exchange 3',
        description: 'Exchange 3 Description',
        instructions: 'Instructions',
        participantInstructionsOnComplete: `Thanks for answering this question. You can finish the interaction by clicking on "Next".`,
        cue: `Finally, let's talk a bit about how you perceived your body during the concert. Were there any particular bodily sensations that stood out?`,
        order: 3,
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
          <Typography variant="h4" sx={{ p: 10, textAlign: 'justify' }}>
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
