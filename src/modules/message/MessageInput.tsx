import {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UseTranslationResponse, useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/CheckRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Textarea from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

export type MessageInputProps = {
  dismissExchange: () => void;
  onSubmit: ({ content }: { content: string }) => void;
  exchangeCompleted: boolean;
};

// Main component function: MessageInput
const MessageInput = ({
  dismissExchange,
  onSubmit,
  exchangeCompleted,
}: MessageInputProps): ReactElement => {
  // State to manage the value of the textarea input
  const [textAreaValue, setTextAreaValue]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState<string>('');

  // Ref to get direct access to the textarea DOM element
  const textAreaRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  // Hook for internationalization (i18n) translation
  const { t }: UseTranslationResponse<'translations', undefined> =
    useTranslation();

  // Function to focus on the textarea input
  const focusOnTextArea: () => void = (): void => {
    const textareaElement = textAreaRef?.current?.querySelector('textarea');
    if (textareaElement) {
      textareaElement.focus();
    }
  };

  // Function to remove focus from the textarea input
  const blurTextArea: () => void = (): void => {
    const textareaElement = textAreaRef?.current?.querySelector('textarea');
    if (textareaElement) {
      textareaElement.blur();
    }
  };

  // Effect to focus on the textarea whenever the component renders
  useEffect((): void => {
    focusOnTextArea();
  });

  // Function to handle the send button click
  const handleClick: () => void = (): void => {
    if (textAreaValue.trim() !== '') {
      onSubmit({ content: textAreaValue });

      setTextAreaValue('');

      focusOnTextArea();
      blurTextArea();
    }
  };

  // Function to handle the dismiss button click
  const handleDismiss: () => void = (): void => {
    dismissExchange();
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl sx={{ width: '100%' }}>
        <Textarea
          placeholder={t('MESSAGE_BOX.INSERT_HERE')}
          aria-label="Message"
          ref={textAreaRef}
          onChange={(e): void => {
            setTextAreaValue(e.target.value);
          }}
          size="small"
          multiline
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          endAdornment={
            <Stack
              direction="row"
              justifyContent="end"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                px: 1,
              }}
            >
              {exchangeCompleted && ( // Conditionally render the "Done" button if exchange is completed
                <Button
                  size="small"
                  color="success"
                  endIcon={<CheckIcon />}
                  sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                  onClick={handleDismiss}
                >
                  {t('MESSAGE_BOX.DONE')}
                </Button>
              )}
              <Button
                size="small"
                color="primary"
                sx={{ ml: 1, alignSelf: 'center', borderRadius: 'sm' }}
                endIcon={<SendRoundedIcon />}
                onClick={handleClick}
              >
                {t('MESSAGE_BOX.SEND')}
              </Button>
            </Stack>
          }
          onKeyDown={(event): void => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick(); // Submit the message on "Ctrl+Enter" or "Cmd+Enter"
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
};

export default MessageInput;
