import { FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoBadge from '@mui/icons-material/Info';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tooltip,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { v4 as uuidv4 } from 'uuid';

import { ExchangesSettingsType } from '@/config/appSettings';
import {
  MAX_FOLLOW_UP_QUESTIONS,
  MAX_TEXT_INPUT_CHARS,
  MIN_FOLLOW_UP_QUESTIONS,
} from '@/config/config';
import { useSettings } from '@/modules/context/SettingsContext';
import Agent from '@/types/Agent';

// Prop types for ExchangeSettingsPanel component
type PropTypesSingle = {
  exchange: ExchangesSettingsType['exchangeList'][number];
  onChange: (
    index: number,
    field: keyof ExchangesSettingsType['exchangeList'][number],
    // Value type to update
    value: string | number | boolean | Omit<Agent, 'type'>,
  ) => void;
  handleRemoveExchange: (index: number) => void;
  handleMoveUp: (index: number) => void;
  handleMoveDown: (index: number) => void;
  index: number;
  exchangeListLength: number;
};

// ExchangeSettingsPanel component to display and edit individual exchange settings
const ExchangeSettingsPanel: FC<PropTypesSingle> = ({
  exchange,
  onChange,
  handleRemoveExchange,
  handleMoveUp,
  handleMoveDown,
  index,
  exchangeListLength,
}) => {
  const { t } = useTranslation();

  // Destructuring exchange settings
  const {
    assistant: exchangeAssistant,
    description: exchangeDescription,
    chatbotInstructions: exchangeInstructions,
    participantCue: exchangeCue,
    participantInstructionsOnComplete: exchangeOnComplete,
    nbFollowUpQuestions: exchangeFollowUpQuestions,
    hardLimit: exchangeLimit,
  } = exchange;

  // Color based on exchange ID
  const panelColor: string = `#0${exchange.id.slice(0, 5)}`;

  // Getting assistants from settings context
  const { assistants } = useSettings();

  return (
    <Stack
      justifyContent="space-around"
      direction="row"
      spacing={2}
      alignItems="center"
      divider={
        <Divider
          orientation="vertical"
          flexItem
          color={panelColor} // Color for divider based on exchange ID
        />
      }
    >
      <Typography
        px={1}
        bgcolor={panelColor} // Background color based on exchange ID
        flex="0 0 fit-content"
        color="white"
        borderRadius="50%"
        textAlign="center"
      >
        {index + 1}
      </Typography>
      <Box sx={{ flex: '1' }}>
        <Stack spacing={1} p={2} border="1px solid #ccc" borderRadius="8px">
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              value={exchangeDescription}
              label={t('SETTINGS.EXCHANGES.DESCRIPTION')}
              multiline
              inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
              fullWidth
              onChange={(e) => onChange(index, 'description', e.target.value)}
            />
            <IconButton
              sx={{ color: panelColor }}
              onClick={() => handleMoveUp(index)}
              disabled={index === 0} // Disable if already at the top
            >
              <Tooltip title={t('SETTINGS.UP')}>
                <ArrowUpwardIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              sx={{ color: panelColor }}
              onClick={() => handleMoveDown(index)}
              disabled={index === exchangeListLength - 1} // Disable if already at the bottom
            >
              <Tooltip title={t('SETTINGS.DOWN')}>
                <ArrowDownwardIcon />
              </Tooltip>
            </IconButton>
          </Stack>
          <TextField
            value={exchangeInstructions}
            label={t('SETTINGS.EXCHANGES.INSTRUCTIONS')}
            multiline
            inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
            onChange={(e) =>
              onChange(index, 'chatbotInstructions', e.target.value)
            }
          />
          <TextField
            value={exchangeCue}
            label={t('SETTINGS.EXCHANGES.CUE')}
            multiline
            inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
            onChange={(e) => onChange(index, 'participantCue', e.target.value)}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={exchangeAssistant.imageUrl}>
              {exchangeAssistant.name.slice(0, 2)}
            </Avatar>
            <FormControl fullWidth>
              <InputLabel>{t('SETTINGS.EXCHANGES.ASSISTANT')}</InputLabel>
              <Select
                value={exchangeAssistant.id}
                renderValue={(selectedId) =>
                  assistants.assistantList.find(
                    (assistant) => assistant.id === selectedId,
                  )?.name || selectedId
                }
                label={t('SETTINGS.EXCHANGES.ASSISTANT')}
                onChange={(e) =>
                  onChange(
                    index,
                    'assistant',
                    assistants.assistantList.find(
                      (assistant) => assistant.id === e.target.value,
                    ) || exchangeAssistant,
                  )
                }
              >
                {assistants.assistantList.map((assistant, nb) => (
                  <MenuItem key={nb} value={assistant.id}>
                    <Avatar src={assistant.imageUrl} sx={{ mx: '1%' }}>
                      {assistant.name.slice(0, 2)}
                    </Avatar>
                    {assistant ? (
                      assistant.name || assistant.id
                    ) : (
                      <Alert
                        severity="warning"
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {t('SETTINGS.EXCHANGES.CREATE_ASSISTANT')}
                      </Alert>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <TextField
            value={exchangeFollowUpQuestions}
            type="number"
            inputProps={{
              min: MIN_FOLLOW_UP_QUESTIONS,
              max: MAX_FOLLOW_UP_QUESTIONS,
            }} // Min and max values for follow-up questions
            label={t('SETTINGS.EXCHANGES.FOLLOW_UP_QUESTIONS')}
            onChange={(e) =>
              onChange(
                index,
                'nbFollowUpQuestions',
                parseInt(e.target.value, 10),
              )
            }
          />
          <Typography variant="h6">
            {t('SETTINGS.EXCHANGES.DISABLE_HARD_LIMIT')}
            {'   '}
            <Tooltip title={t('SETTINGS.EXCHANGES.HARD_LIMIT_INFO')}>
              <InfoBadge />
            </Tooltip>
          </Typography>
          <Switch
            checked={exchangeLimit}
            onChange={(e) => onChange(index, 'hardLimit', e.target.checked)}
          />
          {!exchangeLimit && (
            <TextField
              value={exchangeOnComplete}
              label={t('SETTINGS.EXCHANGES.ON_COMPLETE')}
              placeholder={t('SETTINGS.EXCHANGES.ON_COMPLETE_HELPER')}
              inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
              onChange={(e) =>
                onChange(
                  index,
                  'participantInstructionsOnComplete',
                  e.target.value,
                )
              }
            />
          )}
          <Stack direction="row" justifyContent="center">
            <IconButton
              color="secondary"
              onClick={() => {
                handleRemoveExchange(index);
              }}
              sx={{ alignSelf: 'center', width: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

// Prop types for ExchangeSettings component
type PropTypeList = {
  exchanges: ExchangesSettingsType;
  onChange: (value: SetStateAction<ExchangesSettingsType>) => void;
};

// ExchangeSettings component to manage a list of exchanges
const ExchangeSettings: FC<PropTypeList> = ({ exchanges, onChange }) => {
  // Translation hook
  const { t } = useTranslation();

  // Add a new exchange to the list
  const handleAddExchange = (): void => {
    onChange((prev) => ({
      exchangeList: [
        ...prev.exchangeList,
        {
          // Generate a new unique ID
          id: uuidv4(),
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
    }));
  };

  // Remove an exchange from the list
  const handleRemoveExchange = (index: number): void => {
    onChange((prev) => ({
      exchangeList: prev.exchangeList.filter((_, i) => i !== index),
    }));
  };

  // Move an exchange up in the list
  const handleMoveUp = (index: number): void => {
    onChange((prev) => {
      const updatedExchanges = [...prev.exchangeList];
      const [movedExchange] = updatedExchanges.splice(index, 1);
      updatedExchanges.splice(index - 1, 0, movedExchange);
      return { exchangeList: updatedExchanges };
    });
  };

  // Move an exchange down in the list
  const handleMoveDown = (index: number): void => {
    onChange((prev) => {
      const updatedExchanges = [...prev.exchangeList];
      const [movedExchange] = updatedExchanges.splice(index, 1);
      updatedExchanges.splice(index + 1, 0, movedExchange);
      return { exchangeList: updatedExchanges };
    });
  };

  // Handle changes to exchange settings
  const handleChange = (
    index: number,
    field: keyof ExchangesSettingsType['exchangeList'][number],
    value: string | number | boolean | Omit<Agent, 'type'>,
  ): void => {
    const updatedExchanges = exchanges.exchangeList.map((exchange, i) =>
      i === index ? { ...exchange, [field]: value } : exchange,
    );

    onChange({ exchangeList: updatedExchanges });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.EXCHANGES.TITLE')}</Typography>
      <Stack
        spacing={1}
        py={2}
        px={20}
        border="1px solid #ccc"
        borderRadius="8px"
      >
        {exchanges.exchangeList.length === 0 ? (
          <Alert
            severity="warning"
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {t('SETTINGS.EXCHANGES.CREATE')}
          </Alert>
        ) : (
          exchanges.exchangeList.map((exchange, index) => (
            <ExchangeSettingsPanel
              key={index}
              exchange={exchange}
              onChange={handleChange}
              handleRemoveExchange={handleRemoveExchange}
              handleMoveUp={handleMoveUp}
              handleMoveDown={handleMoveDown}
              index={index}
              exchangeListLength={exchanges.exchangeList.length}
            />
          ))
        )}
        <Button variant="contained" onClick={handleAddExchange}>
          +
        </Button>
      </Stack>
    </Stack>
  );
};

// Exporting the component as the default export
export default ExchangeSettings;
