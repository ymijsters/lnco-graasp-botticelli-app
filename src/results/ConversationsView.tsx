import { FC, Fragment } from 'react';
import { UseTranslationResponse, useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Alert,
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { Member } from '@graasp/sdk';

import { format } from 'date-fns';

import { hooks, mutations } from '@/config/queryClient';
import MessagesPane from '@/modules/message/MessagesPane';
import Exchange from '@/types/Exchange';
import Interaction from '@/types/Interaction';
import { Message } from '@/types/Message';

type Props = {
  expandedConversation: number | null;
  setExpandedConversation: (newExpandedConversation: number | null) => void;
};

// Main component for managing conversations
const Conversations: FC<Props> = ({
  expandedConversation,
  setExpandedConversation,
}) => {
  const { t }: UseTranslationResponse<'translations', undefined> =
    useTranslation();

  // Hook to handle deleting app data
  const { mutate: deleteAppData } = mutations.useDeleteAppData();

  // Fetching interaction data
  const { data: appDatas } = hooks.useAppData<Interaction>();

  // Fetching all members from the app context or defaulting to the checked-out member
  const allMembers: Member[] = hooks.useAppContext().data?.members || [];

  /*
  // Memoized value to find the interaction corresponding to the selected member
  const checkedOutInteraction: Interaction | undefined = useMemo(
    (): Interaction | undefined =>
      appDatas?.find(
        (appData): boolean =>
          appData?.data?.exchanges?.exchangeList &&
          appData.member.id === checkedOutMember.id,
      )?.data,
    [appDatas, checkedOutMember.id],
  );
*/

  const StatusLabel: (started: boolean, complete: boolean) => string = (
    started: boolean,
    complete: boolean,
  ): string => {
    if (complete) {
      return t('CONVERSATIONS.TABLE.COMPLETE');
    }
    if (started) {
      return t('CONVERSATIONS.TABLE.INCOMPLETE');
    }
    return t('CONVERSATIONS.TABLE.NOT_STARTED');
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('CONVERSATIONS.TITLE')}</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('CONVERSATIONS.TABLE.MEMBER')}</TableCell>
              <TableCell>{t('CONVERSATIONS.TABLE.UPDATED')}</TableCell>
              <TableCell>{t('CONVERSATIONS.TABLE.STATUS')}</TableCell>
              <TableCell>{t('CONVERSATIONS.TABLE.DELETE')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allMembers &&
              allMembers.map((member, index) => {
                const interaction = appDatas?.find(
                  (appData) => appData.member.id === member.id,
                );

                return (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setExpandedConversation(
                              index === expandedConversation ? null : index,
                            )
                          }
                        >
                          {index === expandedConversation ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
                        {interaction?.updatedAt
                          ? format(
                              new Date(interaction.updatedAt),
                              'dd.MM.yyyy HH:mm:ss',
                            )
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Alert
                          sx={{ maxWidth: 'fit-content' }}
                          variant="filled"
                          severity={
                            // eslint-disable-next-line no-nested-ternary
                            interaction?.data.completed
                              ? 'success'
                              : interaction?.data.started
                                ? 'warning'
                                : 'error'
                          }
                        >
                          {StatusLabel(
                            interaction?.data.started || false,
                            interaction?.data.completed || false,
                          )}
                        </Alert>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="secondary"
                          onClick={(): void =>
                            deleteAppData({
                              id: interaction?.id || '',
                            })
                          }
                          sx={{ width: 'auto' }}
                        >
                          <Tooltip title={t('CONVERSATIONS.RESET')}>
                            <DeleteIcon />
                          </Tooltip>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={index === expandedConversation}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box py={2} px={20}>
                            {interaction?.data ? (
                              <Stack spacing={2}>
                                <MessagesPane
                                  currentExchange={
                                    interaction.data.exchanges.exchangeList[
                                      interaction.data.currentExchange
                                    ]
                                  }
                                  setExchange={(): void => {}}
                                  interactionDescription=""
                                  pastMessages={
                                    interaction.data.exchanges.exchangeList.flatMap(
                                      (exchange: Exchange): Message[] => {
                                        // Collect dismissed messages from exchanges
                                        if (exchange.dismissed) {
                                          return exchange.messages;
                                        }
                                        return [];
                                      },
                                    ) || []
                                  }
                                  participant={interaction.data.participant}
                                  autoDismiss={false}
                                  goToNextExchange={(): void => {}}
                                  readOnly
                                />
                              </Stack>
                            ) : (
                              // Show a warning if no interaction is found
                              <Alert
                                severity="warning"
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                {t('CONVERSATIONS.TABLE.NONE')}
                              </Alert>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
  /*
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('CONVERSATIONS.TITLE')}</Typography>
      <FormControl fullWidth>
        <InputLabel>{t('CONVERSATIONS.MEMBER')}</InputLabel>
        <Select
          value={checkedOutMember.id}
          renderValue={(selectedId: string): string =>
            allMembers?.find(
              (member: Member): boolean => member.id === selectedId,
            )?.name || selectedId
          }
          label={t('CONVERSATIONS.MEMBER')}
          onChange={(e: SelectChangeEvent<string>): void =>
            setCheckedOutMember(
              allMembers.find(
                (member: Member): boolean => member.id === e.target.value,
              ) || checkedOutMember,
            )
          }
        >
          {allMembers.map(
            (member: Member, nb: number): JSX.Element => (
              <MenuItem key={nb} value={member.id}>
                {member.name || member.id}
              </MenuItem>
            ),
          )}
        </Select>
      </FormControl>
      {checkedOutMember.id === '' ? null : (
        <Box py={2} px={20} border="1px solid #ccc" borderRadius="8px">
          {checkedOutInteraction ? (
            <Stack spacing={2}>
              <MessagesPane
                currentExchange={
                  checkedOutInteraction.exchanges.exchangeList[
                    checkedOutInteraction.currentExchange
                  ]
                }
                setExchange={(): void => {}}
                interactionDescription=""
                pastMessages={
                  checkedOutInteraction.exchanges.exchangeList.flatMap(
                    (exchange: Exchange): Message[] => {
                      // Collect dismissed messages from exchanges
                      if (exchange.dismissed) {
                        return exchange.messages;
                      }
                      return [];
                    },
                  ) || []
                }
                participant={checkedOutInteraction.participant}
                autoDismiss={false}
                goToNextExchange={(): void => {}}
                readOnly
              />
              {checkedOutInteraction.completed ? (
                <Alert variant="filled" severity="success">
                  {t('CONVERSATIONS.TABLE.COMPLETE')}
                </Alert>
              ) : (
                <Alert sx={{ Width: '50%' }} variant="filled" severity="error">
                  {t('CONVERSATIONS.TABLE.INCOMPLETE')}
                </Alert>
              )}

              <Stack direction="row" justifyContent="center">
                <IconButton
                  color="secondary"
                  onClick={(): void =>
                    deleteAppData({
                      id:
                        appDatas?.find(
                          (appData): boolean =>
                            appData.member.id === checkedOutMember.id,
                        )?.id || '',
                    })
                  }
                  sx={{ width: 'auto' }}
                >
                  <Tooltip title={t('CONVERSATIONS.RESET')}>
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
              </Stack>
            </Stack>
          ) : (
            // Show a warning if no interaction is found
            <Alert
              severity="warning"
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {t('CONVERSATIONS.NONE')}
            </Alert>
          )}
        </Box>
      )}
    </Stack>
  );
  */
};

export default Conversations;
