import { ReactElement } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Agent from '@/types/Agent';
import { getFormattedTime } from '@/utils/datetime';

type ChatBubbleProps = {
  content: string;
  timestamp?: string;
  sender: Agent;
  variant: 'sent' | 'received';
};

const ChatBubble = ({
  content,
  variant,
  timestamp,
  sender,
}: ChatBubbleProps): ReactElement => {
  const isSent = variant === 'sent';
  return (
    <Box sx={{ maxWidth: '60%', minWidth: 'auto' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography variant="body2">{sender.name}</Typography>
        {timestamp && (
          <Typography variant="body2">
            {getFormattedTime(timestamp, 'en')}
          </Typography>
        )}
      </Stack>
      <Box sx={{ position: 'relative' }}>
        <Paper
          color={isSent ? 'primary' : 'neutral'}
          variant="outlined"
          sx={{
            p: 1.25,
            borderRadius: 'lg',
            borderTopRightRadius: isSent ? 0 : 'lg',
            borderTopLeftRadius: isSent ? 'lg' : 0,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: isSent
                ? 'var(--joy-palette-common-white)'
                : 'var(--joy-palette-text-primary)',
            }}
          >
            {content}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatBubble;
