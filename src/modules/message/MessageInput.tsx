import { ReactElement, useEffect, useRef, useState } from 'react';

import CheckIcon from '@mui/icons-material/CheckRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Textarea from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

import Exchange from '@/types/Exchange';

export type MessageInputProps = {
  exchange: Exchange;
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: (keyPressData: KeyPressData[]) => void;
  completed: boolean;
  setExchange: (exchange: Exchange) => void;
  goToNextExchange: () => void;
};

type KeyPressData = {
  timestamp: number;
  key: string;
};

const MessageInput = ({
  exchange,
  textAreaValue,
  setTextAreaValue,
  onSubmit,
  completed,
  setExchange,
  goToNextExchange,
}: MessageInputProps): ReactElement => {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const [keypressData, setKeypressData] = useState<KeyPressData[]>([]);

  function dismissExchange(): void {
    const updatedExchange = { ...exchange };
    updatedExchange.dismissed = true;
    updatedExchange.dismissedAt = new Date();
    setExchange(updatedExchange);
    goToNextExchange();
  }

  const focusOnTextArea = (): void => {
    const textareaElement = textAreaRef?.current?.querySelector('textarea');
    if (textareaElement) {
      textareaElement.focus();
    }
  };

  useEffect(() => {
    focusOnTextArea();
  });

  const handleClick = (): void => {
    if (textAreaValue.trim() !== '') {
      onSubmit(keypressData);
      setTextAreaValue('');

      // focus on the text area
      focusOnTextArea();
    }
  };

  const handleDismiss = (): void => {
    dismissExchange();
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl sx={{ width: '100%' }}>
        <Textarea
          placeholder="Votre réponse ici…"
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
              {completed && (
                <Button
                  size="small"
                  color="success"
                  endIcon={<CheckIcon />}
                  sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                  onClick={handleDismiss}
                >
                  Done
                </Button>
              )}
              <Button
                size="small"
                color="primary"
                sx={{ ml: 1, alignSelf: 'center', borderRadius: 'sm' }}
                endIcon={<SendRoundedIcon />}
                onClick={handleClick}
              >
                Send
              </Button>
            </Stack>
          }
          onKeyDown={(event): void => {
            setKeypressData([
              ...keypressData,
              {
                timestamp: event.timeStamp,
                key: event.key,
              },
            ]);
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick();
              // reset keypress data
              setKeypressData([]);
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
