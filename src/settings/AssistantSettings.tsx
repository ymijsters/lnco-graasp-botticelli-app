import { FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { v4 as uuidv4 } from 'uuid';

import { AssistantsSettingsType } from '@/config/appSettings';
import { MAX_TEXT_INPUT_CHARS } from '@/config/config';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';

// Prop types for individual assistant settings panel
type PropTypesSingle = {
  assistant: AssistantsSettingsType['assistantList'][number];
  onChange: (
    index: number,
    field: keyof AssistantsSettingsType['assistantList'][number],
    value: string,
  ) => void;
  handleRemoveAssistant: (index: number) => void;
  handleMoveUp: (index: number) => void;
  handleMoveDown: (index: number) => void;
  index: number;
  assistantListLength: number;
};

// Component for individual assistant settings panel
const AssistantSettingsPanel: FC<PropTypesSingle> = ({
  assistant,
  onChange,
  handleRemoveAssistant,
  handleMoveUp,
  handleMoveDown,
  index,
  assistantListLength,
}) => {
  const { t } = useTranslation();

  // Destructuring assistant properties
  const {
    name: assistantName,
    description: assistantDescription,
    imageUrl: assistantImageUrl,
  } = assistant;

  // Generating a unique color for the assistant panel based on its ID
  const panelColor: string = `#0${assistant.id.slice(0, 5)}`;

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
          color={panelColor} // Unique color for each assistant's divider
        />
      }
    >
      <Typography
        px={1}
        bgcolor={panelColor}
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
            <Avatar
              src={assistantImageUrl}
              sx={{ border: '1px solid #bdbdbd' }}
            >
              {assistantName.slice(0, 2)}
            </Avatar>
            <TextField
              value={assistantImageUrl || ''}
              label={t('SETTINGS.ASSISTANTS.IMAGE')}
              onChange={(e) => onChange(index, 'imageUrl', e.target.value)}
              placeholder={t('SETTINGS.ASSISTANTS.URL')}
              fullWidth
            />
            <IconButton
              sx={{ color: panelColor }}
              onClick={() => handleMoveUp(index)}
              disabled={index === 0} // Disabled if the assistant is at the top
            >
              <Tooltip title={t('SETTINGS.UP')}>
                <ArrowUpwardIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              sx={{ color: panelColor }}
              onClick={() => handleMoveDown(index)}
              disabled={index === assistantListLength - 1} // Disabled if the assistant is at the bottom
            >
              <Tooltip title={t('SETTINGS.DOWN')}>
                <ArrowDownwardIcon />
              </Tooltip>
            </IconButton>
          </Stack>
          <TextField
            value={assistantName}
            label={t('SETTINGS.ASSISTANTS.NAME')}
            multiline
            inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
            onChange={(e) => onChange(index, 'name', e.target.value)}
          />
          <TextField
            value={assistantDescription}
            label={t('SETTINGS.ASSISTANTS.DESCRIPTION')}
            multiline
            inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
            onChange={(e) => onChange(index, 'description', e.target.value)}
          />
          <Stack direction="row" justifyContent="center">
            <IconButton
              color="secondary"
              onClick={() => handleRemoveAssistant(index)}
              sx={{ width: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

// Prop types for the main assistants settings component
type PropTypeList = {
  assistants: AssistantsSettingsType;
  onChange: (value: SetStateAction<AssistantsSettingsType>) => void;
};

// Main component for managing assistants settings
const AssistantsSettings: FC<PropTypeList> = ({ assistants, onChange }) => {
  const { t } = useTranslation();

  // Function to add a new assistant to the list
  const handleAddAssistant = (): void => {
    onChange((prev) => ({
      assistantList: [
        // Spreading existing assistants
        ...prev.assistantList,
        {
          // Generating a unique ID for the new assistant
          id: uuidv4(),
          name: '',
          description: '',
          imageUrl: '',
        },
      ],
    }));
  };

  // Function to remove an assistant from the list
  const handleRemoveAssistant = (index: number): void => {
    onChange((prev) => ({
      // Removing the assistant at the specified index
      assistantList: prev.assistantList.filter((_, i) => i !== index),
    }));
  };

  // Function to move an assistant up in the list
  const handleMoveUp = (index: number): void => {
    onChange((prev) => {
      const updatedAssistants = [...prev.assistantList];
      const [movedAssistant] = updatedAssistants.splice(index, 1);
      updatedAssistants.splice(index - 1, 0, movedAssistant);
      return { assistantList: updatedAssistants };
    });
  };

  // Function to move an assistant down in the list
  const handleMoveDown = (index: number): void => {
    onChange((prev) => {
      const updatedAssistants = [...prev.assistantList];
      const [movedAssistant] = updatedAssistants.splice(index, 1);
      updatedAssistants.splice(index + 1, 0, movedAssistant);
      return { assistantList: updatedAssistants };
    });
  };

  // Function to handle changes in the assistant's fields (name, description, image URL)
  const handleChange = (
    index: number,
    field: keyof AssistantsSettingsType['assistantList'][number],
    value: string | number | boolean | (Agent & { type: AgentType.Assistant }),
  ): void => {
    const updatedAssistants = assistants.assistantList.map((assistant, i) =>
      // Updating the specified field of the assistant at the specified index
      i === index ? { ...assistant, [field]: value } : assistant,
    );

    // Updating the state with the new list
    onChange({ assistantList: updatedAssistants });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.ASSISTANTS.TITLE')}</Typography>
      <Stack
        spacing={1}
        py={2}
        px={20}
        border="1px solid #ccc"
        borderRadius="8px"
      >
        {assistants.assistantList.length === 0 ? (
          <Alert
            severity="warning"
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {t('SETTINGS.ASSISTANTS.CREATE')}
          </Alert>
        ) : (
          // Mapping over the list of assistants and rendering a settings panel for each
          assistants.assistantList.map((assistant, index) => (
            <AssistantSettingsPanel
              key={index}
              assistant={assistant}
              onChange={handleChange}
              handleRemoveAssistant={handleRemoveAssistant}
              handleMoveUp={handleMoveUp}
              handleMoveDown={handleMoveDown}
              index={index}
              assistantListLength={assistants.assistantList.length}
            />
          ))
        )}
        <Button variant="contained" onClick={handleAddAssistant}>
          {t('SETTINGS.ASSISTANTS.ADD')}
        </Button>
      </Stack>
    </Stack>
  );
};

// Exporting the component as the default export
export default AssistantsSettings;
