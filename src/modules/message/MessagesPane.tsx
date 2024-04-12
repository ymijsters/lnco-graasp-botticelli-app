import { ReactElement, useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { ChatBotMessage, ChatbotRole } from '@graasp/sdk';

import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { AppDataTypes } from '@/config/appData';
import { mutations } from '@/config/queryClient';
import AgentType from '@/types/AgentType';
import Exchange from '@/types/Exchange';
import { Message } from '@/types/Message';
import Status from '@/types/Status';

import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessageLoader from './MessageLoader';

type MessagesPaneProps = {
  exchange: Exchange;
  participantId: string;
  readOnly?: boolean;
  autoDismiss?: boolean;
  goToNextExchange: () => void;
};

const buildPrompt = (
  threadMessages: Message[],
  userMessage: Message,
): Array<ChatBotMessage> => {
  // define the message to send to OpenAI with the initial prompt first if needed (role system).
  // Each call to OpenAI must contain the whole history of the messages.
  // const finalPrompt: Array<ChatBotMessage> = initialPrompt
  //   ? [{ role: ChatbotRole.System, content: initialPrompt }]
  //   : [];
  const finalPrompt = [
    {
      role: ChatbotRole.System,
      content:
        'Vous êtes un chatbot qui conduit une interview avec une personne qui vient d’assister à un concert de musique électroacoustique. Vous posez une question principale et continuez avec d’autres questions afin de préciser les réponses données.',
    },
  ];

  threadMessages.forEach((msg) => {
    const msgRole =
      msg.sender.type === AgentType.Assistant
        ? ChatbotRole.Assistant
        : ChatbotRole.User;
    finalPrompt.push({ role: msgRole, content: msg.content });
  });

  // add the last user's message in the prompt
  finalPrompt.push({ role: ChatbotRole.User, content: userMessage.content });

  return finalPrompt;
};

const MessagesPane = ({
  exchange: defaultExchange,
  participantId,
  autoDismiss,
  readOnly = false,
  goToNextExchange,
}: MessagesPaneProps): ReactElement => {
  const { mutateAsync: postAppDataAsync } = mutations.usePostAppData();
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();

  function loadMessages(): Message[] {
    const item = window.sessionStorage.getItem('messages');
    return item != null ? JSON.parse(item) : [];
  }

  function loadExchange(): Exchange {
    const item = window.sessionStorage.getItem('exchange');
    return item != null ? JSON.parse(item) : defaultExchange;
  }

  function loadSentMessageCount(): number {
    const item = window.sessionStorage.getItem('sentMessageCount');
    return item != null ? parseInt(item, 10) : 0;
  }

  const [status, setStatus] = useState<Status>(Status.Idle);
  const [exchange, setExchange] = useState<Exchange>(loadExchange());
  const [messages, setMessages] = useState<Message[]>(loadMessages());
  const [textAreaValue, setTextAreaValue] = useState('');
  const [sentMessageCount, setSentMessageCount] = useState<number>(
    loadSentMessageCount(),
  );

  useEffect(() => {
    window.sessionStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    window.sessionStorage.setItem('exchange', JSON.stringify(exchange));
  }, [exchange]);

  useEffect(() => {
    window.sessionStorage.setItem(
      'sentMessageCount',
      sentMessageCount.toString(),
    );
  }, [sentMessageCount]);

  useEffect(() => {
    const defaultMessages: Message[] = [
      {
        id: `${defaultExchange.id}`,
        content: defaultExchange.cue,
        sender: {
          id: '1',
          name: 'Interviewer',
          type: AgentType.Assistant,
        },
      },
    ];
    setMessages((m) => _.uniqBy([...m, ...defaultMessages], 'id'));
    setExchange(defaultExchange);
  }, [defaultExchange]);

  const saveNewMessage = ({ content }: { content: string }): void => {
    setStatus(Status.Loading);
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: {
        id: participantId,
        name: 'User',
        type: AgentType.User,
      },
    };

    postAppDataAsync({
      data: {
        content,
      },
      type: AppDataTypes.ParticipantComment,
    });

    setMessages((m) => [...m, newMessage]);
    setSentMessageCount((c) => c + 1);

    // will not take updated message count in consideration so we add two
    // https://react.dev/reference/react/useState#setstate-caveats
    if (exchange.softLimit && sentMessageCount + 2 > exchange.softLimit) {
      const newExchange = { ...exchange };
      newExchange.completed = true;
      newExchange.completedAt = new Date();
      if (autoDismiss) {
        newExchange.dismissed = true;
        newExchange.dismissedAt = new Date();
        setExchange(newExchange);
        setStatus(Status.Idle);
        setSentMessageCount(0);
        goToNextExchange();
      } else {
        setExchange(newExchange);
      }
    } else {
      // respond
      const prompt = [
        // initial settings
        // ...
        // this function requests the prompt as the first argument in string format
        // we can not use it in this context as we are using a JSON prompt.
        // if we simplify the prompt in the future we will be able to remove the line above
        // and this function solely
        ...buildPrompt(messages, newMessage),
      ];

      postChatBot(prompt)
        .then((chatBotRes) => {
          // actionData.content = chatBotRes.completion;
          const response = {
            id: uuidv4(),
            content: chatBotRes.completion,
            sender: {
              id: '1',
              name: 'Interviewer',
              type: AgentType.Assistant,
            },
          };

          // post comment from bot
          postAppDataAsync({
            data: {
              content: chatBotRes.completion,
            },
            type: AppDataTypes.AssistantComment,
          });

          // const updatedMessagesWithResponse = [...updatedMessages, response];
          setMessages((m) => [...m, response]);
        })
        .finally(() => {
          // set status back to idle
          setStatus(Status.Idle);
          // postAction({
          //   data: actionData,
          //   type: AppActionsType.Create,
          // });
        });
    }

    // evaluate
    // ...
  };

  useEffect((): void => {
    const startExchange = (): void => {
      const updatedExchange = { ...exchange };
      updatedExchange.started = true;
      updatedExchange.startedAt = new Date();
      setExchange(updatedExchange);
    };
    // do not start if this is readonly
    if (!readOnly && exchange && !exchange.started) {
      startExchange();
    }
  }, [exchange, readOnly]);

  if (!exchange) {
    return <>Exchange Not Found</>;
  }

  const showParticipantInstructionsOnComplete =
    exchange.completed && exchange.participantInstructionsOnComplete;

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {messages.map((message: Message, index: number) => {
            const isYou = message?.sender?.id === participantId;

            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? 'row-reverse' : 'row'}
              >
                {!isYou && (
                  <AvatarWithStatus src="" sx={{ bgcolor: '#5050d2' }}>
                    😀
                  </AvatarWithStatus>
                )}
                <ChatBubble
                  variant={isYou ? 'sent' : 'received'}
                  content={message.content}
                  sender={message.sender}
                />
              </Stack>
            );
          })}
          {status === Status.Loading && (
            <Box sx={{ maxWidth: '60%', minWidth: 'auto' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 0.25 }}
              >
                <MessageLoader />
              </Stack>
            </Box>
          )}
          {showParticipantInstructionsOnComplete && (
            <Alert variant="filled" color="success">
              {exchange.participantInstructionsOnComplete}
            </Alert>
          )}
        </Stack>
      </Box>
      {!(readOnly || exchange.dismissed) && (
        <MessageInput
          exchange={exchange}
          goToNextExchange={goToNextExchange}
          textAreaValue={textAreaValue}
          setTextAreaValue={setTextAreaValue}
          setExchange={setExchange}
          completed={exchange.completed}
          onSubmit={(): void => {
            saveNewMessage({
              // keyPressEvents,
              // sender: participantId,
              content: textAreaValue,
            });
          }}
        />
      )}
    </Paper>
  );
};

export default MessagesPane;
