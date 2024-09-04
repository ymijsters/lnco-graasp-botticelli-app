import {
  ChangeEvent,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import { UseTranslationResponse, useTranslation } from 'react-i18next';

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
  SelectChangeEvent,
  Switch,
  Tooltip,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { UUID } from '@graasp/sdk';

import { v4 as uuidv4 } from 'uuid';

import {
  AssistantSettings,
  ExchangesSettingsType,
  ExchangeSettings as singleExchangeType,
} from '@/config/appSettings';
import {
  MAX_FOLLOW_UP_QUESTIONS,
  MAX_TEXT_INPUT_CHARS,
  MIN_FOLLOW_UP_QUESTIONS,
} from '@/config/config';
import {
  SettingsContextType,
  useSettings,
} from '@/modules/context/SettingsContext';
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
  const { t }: UseTranslationResponse<'translations', undefined> =
    useTranslation();

  // Destructuring exchange settings
  const {
    name: exchangeName,
    assistant: exchangeAssistant,
    description: exchangeDescription,
    chatbotInstructions: exchangeInstructions,
    participantCue: exchangeCue,
    participantInstructionsOnComplete: exchangeOnComplete,
    nbFollowUpQuestions: exchangeFollowUpQuestions,
    hardLimit: exchangeLimit,
  }: singleExchangeType = exchange;

  // Color based on exchange ID
  const panelColor: string = `#0${exchange.id.slice(0, 5)}`;

  // Getting assistants from settings context
  const { assistants }: SettingsContextType = useSettings();

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
              value={exchangeName}
              label={t('SETTINGS.EXCHANGES.NAME')}
              inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
              fullWidth
              onChange={(
                e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
              ): void => onChange(index, 'name', e.target.value)}
            />

            <IconButton
              sx={{ color: panelColor }}
              onClick={(): void => handleMoveUp(index)}
              disabled={index === 0} // Disable if already at the top
            >
              <Tooltip title={t('SETTINGS.UP')}>
                <ArrowUpwardIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              sx={{ color: panelColor }}
              onClick={(): void => handleMoveDown(index)}
              disabled={index === exchangeListLength - 1} // Disable if already at the bottom
            >
              <Tooltip title={t('SETTINGS.DOWN')}>
                <ArrowDownwardIcon />
              </Tooltip>
            </IconButton>
          </Stack>
          <TextField
            value={exchangeDescription}
            label={t('SETTINGS.EXCHANGES.DESCRIPTION')}
            multiline
            inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
            onChange={(
              e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ): void => onChange(index, 'description', e.target.value)}
          />
          <TextField
            value={exchangeInstructions}
            label={t('SETTINGS.EXCHANGES.INSTRUCTIONS')}
            multiline
            inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
            onChange={(
              e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ): void => onChange(index, 'chatbotInstructions', e.target.value)}
          />
          <TextField
            value={exchangeCue}
            label={t('SETTINGS.EXCHANGES.CUE')}
            multiline
            inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
            onChange={(
              e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ): void => onChange(index, 'participantCue', e.target.value)}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={exchangeAssistant.imageUrl}>
              {exchangeAssistant.name.slice(0, 2)}
            </Avatar>
            <FormControl fullWidth>
              <InputLabel>{t('SETTINGS.EXCHANGES.ASSISTANT')}</InputLabel>
              <Select
                value={exchangeAssistant.id}
                renderValue={(selectedId: UUID): string =>
                  assistants.assistantList.find(
                    (assistant: AssistantSettings): boolean =>
                      assistant.id === selectedId,
                  )?.name || selectedId
                }
                label={t('SETTINGS.EXCHANGES.ASSISTANT')}
                onChange={(e: SelectChangeEvent<string>): void =>
                  onChange(
                    index,
                    'assistant',
                    assistants.assistantList.find(
                      (assistant: AssistantSettings): boolean =>
                        assistant.id === e.target.value,
                    ) || exchangeAssistant,
                  )
                }
              >
                {assistants.assistantList.map(
                  (assistant: AssistantSettings, nb: number): JSX.Element => (
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
                  ),
                )}
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
            onChange={(
              e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ): void =>
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
            onChange={(e: ChangeEvent<HTMLInputElement>): void =>
              onChange(index, 'hardLimit', e.target.checked)
            }
          />
          {!exchangeLimit && (
            <TextField
              value={exchangeOnComplete}
              label={t('SETTINGS.EXCHANGES.ON_COMPLETE')}
              placeholder={t('SETTINGS.EXCHANGES.ON_COMPLETE_HELPER')}
              inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
              onChange={(
                e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
              ): void =>
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
              onClick={(): void => {
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
  const { t }: UseTranslationResponse<'translations', undefined> =
    useTranslation();

  const lastExchangeRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);

  // Scroll into view when assistants change (e.g., after adding or moving)
  useEffect((): void => {
    if (lastExchangeRef.current) {
      lastExchangeRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [exchanges.exchangeList.length]);

  // Add a new exchange to the list
  const handleAddExchange = (): void => {
    onChange(
      (prev: ExchangesSettingsType): ExchangesSettingsType => ({
        exchangeList: [
          ...prev.exchangeList,
          {
            // Generate a new unique ID
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
      }),
    );
  };

  // Remove an exchange from the list
  const handleRemoveExchange = (index: number): void => {
    onChange(
      (prev: ExchangesSettingsType): ExchangesSettingsType => ({
        exchangeList: prev.exchangeList.filter(
          (_: singleExchangeType, i: number): boolean => i !== index,
        ),
      }),
    );
  };

  // Move an exchange up in the list
  const handleMoveUp = (index: number): void => {
    onChange((prev: ExchangesSettingsType): ExchangesSettingsType => {
      const updatedExchanges: singleExchangeType[] = [...prev.exchangeList];
      const [movedExchange]: singleExchangeType[] = updatedExchanges.splice(
        index,
        1,
      );
      updatedExchanges.splice(index - 1, 0, movedExchange);
      return { exchangeList: updatedExchanges };
    });
  };

  // Move an exchange down in the list
  const handleMoveDown = (index: number): void => {
    onChange((prev: ExchangesSettingsType): ExchangesSettingsType => {
      const updatedExchanges: singleExchangeType[] = [...prev.exchangeList];
      const [movedExchange]: singleExchangeType[] = updatedExchanges.splice(
        index,
        1,
      );
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
    const updatedExchanges: singleExchangeType[] = exchanges.exchangeList.map(
      (exchange: singleExchangeType, i: number): singleExchangeType =>
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
          exchanges.exchangeList.map(
            (exchange: singleExchangeType, index: number): JSX.Element => (
              <Box
                key={index}
                ref={
                  index === exchanges.exchangeList.length - 1
                    ? lastExchangeRef
                    : null
                } // Attach ref to the last added panel
              >
                <ExchangeSettingsPanel
                  exchange={exchange}
                  onChange={handleChange}
                  handleRemoveExchange={handleRemoveExchange}
                  handleMoveUp={handleMoveUp}
                  handleMoveDown={handleMoveDown}
                  index={index}
                  exchangeListLength={exchanges.exchangeList.length}
                />
              </Box>
            ),
          )
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
