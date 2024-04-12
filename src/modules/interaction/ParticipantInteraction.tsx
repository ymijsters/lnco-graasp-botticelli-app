import { ReactElement, useState } from 'react';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { START_INTERACTION_BUTTON_CY } from '@/config/selectors';
import MessagesPane from '@/modules/message/MessagesPane';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';
import Interaction from '@/types/Interaction';

const ParticipantInteraction = (): ReactElement => {
  const participantId = '0';

  const artificialAssistant: Agent = {
    id: '1',
    name: 'Interviewer',
    description: 'Assistant Description',
    type: AgentType.Assistant,
  };

  const defaultInteraction: Interaction = {
    id: 0,
    description: 'Default Description',
    modelInstructions: '',
    participantInstructions: `Bienvenue et merci de participer à notre étude sur les images mentales induites par l'écoute profonde (deep listening), images qui font font partie de l'œuvre. Un agent conversationnel vous posera quelques questions pour vous aider à décrire ce que vous avez perçu pendant l'écoute du concert de Luca Forcucci. Vos réponses sont entièrement anonymes et aucune donnée personnelle ne vous sera demandée (ne fournissez pas d’information personnelle afin de ne pas ouvrir la possibilité d'être identifié-e).`,
    participantInstructionsOnComplete: `Merci beaucoup! Vos indications nous seront précieuses pour évaluer l'occurrence et la nature des sensations induites par l'écoute. Cette évaluation fait partie de l'œuvre, et aide à la composition de nouvelles formes musicales.`,
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
        participantInstructionsOnComplete: ``,
        cue: `Quelles sont les images mentales les plus fortes ou les plus claires que vous avez perçues pendant l'écoute du concert? Ce pourraient être des visions brèves pendant un moment de somnolence, ou des images persistantes qui vous sont apparues (les yeux ouverts ou fermés).`,
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
        participantInstructionsOnComplete: ``,
        cue: `Pourriez vous décrire s’il s'agissait plus de formes réelles ou imaginaires? Réalistes ou abstraites?`,
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
        id: 2,
        name: 'Exchange 3',
        description: 'Exchange 3 Description',
        instructions: 'Instructions',
        participantInstructionsOnComplete: ``,
        cue: `Merci! Une dernière question s’il vous plaît! Où se trouvait votre corps par rapport à ces images?  Vous les observiez depuis un point de vue extérieur, depuis le bas ou le haut ou latéralement, ou alors aviez- vous la sensation d'être immergé dans un espace qui vous entoure, d'être transporté dans un lieu?`,
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
      {
        id: 3,
        name: 'Exchange 4',
        description: 'Exchange 4 Description',
        instructions: 'Instructions',
        participantInstructionsOnComplete: ``,
        cue: `Merci beaucoup pour vos réponses! Avez-vous quelque chose à ajouter?`,
        order: 4,
        messages: [],
        assistant: artificialAssistant,
        triggers: [],
        started: false,
        completed: false,
        dismissed: false,
        softLimit: 1,
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
          <>
            <Typography
              variant="body1"
              sx={{ p: 2, pt: 4, textAlign: 'justify' }}
            >
              {interaction.participantInstructions}
            </Typography>
            <Typography
              variant="body1"
              sx={{ p: 2, pt: 4, textAlign: 'center' }}
            >
              Le dialogue dure environ 5 minutes et vous recevrez une petite
              récompense pour vous remercier de votre participation!
            </Typography>
          </>
        )}
        <Button
          variant="contained"
          size="large"
          data-cy={START_INTERACTION_BUTTON_CY}
          sx={{ mt: 3, mx: 'auto' }}
          onClick={handleStartInteraction}
        >
          Commencer!
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
      <Typography variant="body1" sx={{ p: 10, textAlign: 'center' }}>
        {interaction.participantInstructionsOnComplete}
        <br />
        <br />
        <a
          href="https://linktr.ee/lucaforcucci"
          target="_blank"
          rel="noreferrer"
        >
          Plus d’information sur l’artiste.
        </a>
        <br />
        <a href="https://lnco.epfl.ch" target="_blank" rel="noreferrer">
          Plus d’information sur les chercheurs.
        </a>
        <br />
        <br />
        Cadeau! Écoutez ces concerts de Luca Forcucci en streaming!
        <br />
        <br />
        <a
          href="https://vimeo.com/manage/videos/659021910"
          target="_blank"
          rel="noreferrer"
        >
          https://vimeo.com/manage/videos/659021910
        </a>
        <br />
        <a href="https://tinyurl.com/2w7bj2xs" target="_blank" rel="noreferrer">
          https://tinyurl.com/2w7bj2xs
        </a>
        <br />
        <a href="https://tinyurl.com/526xxa8w" target="_blank" rel="noreferrer">
          https://tinyurl.com/526xxa8w
        </a>
      </Typography>
    </Box>
  ) : (
    <MessagesPane
      goToNextExchange={goToNextExchange}
      autoDismiss
      exchange={interaction.exchanges[interaction.currentExchange]}
      participantId={participantId}
      readOnly={false}
    />
  );
};

export default ParticipantInteraction;
