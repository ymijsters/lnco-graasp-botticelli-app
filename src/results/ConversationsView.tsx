import { FC, Fragment } from 'react';
import { UseTranslationResponse, useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Alert,
  Box,
  Button,
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
  const appDatas =
    hooks
      .useAppData<Interaction>()
      .data?.filter((appData) => appData.type === 'Interaction') || [];

  // Fetching all members from the app context or defaulting to the checked-out member
  const allMembers: Member[] = hooks.useAppContext().data?.members || [];

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

  // Utility function to convert JSON data to CSV format
  const convertJsonToCsv: (data: Interaction[]) => string = (
    data: Interaction[],
  ): string => {
    const headers: string[] = [
      'Participant',
      'Sender',
      'Sent at',
      'Exchange',
      'Interaction',
      'Content',
      'Type',
    ];
    const csvRows: string[] = [
      headers.join(','), // header row first
      ...data.flatMap((interactionData: Interaction): string[] =>
        interactionData.exchanges.exchangeList.flatMap(
          (exchange: Exchange): string[] =>
            exchange.messages.map((message: Message): string =>
              [
                interactionData.participant.name,
                message.sender.name,
                format(new Date(message.sentAt || ''), 'dd/MM/yyyy HH:mm'),
                exchange.name,
                interactionData.name,
                message.content,
                typeof message.content,
              ]
                .map(
                  (cellText: string): string =>
                    `"${cellText.replaceAll('\n', ' ')}"`,
                )
                .join(','),
            ),
        ),
      ),
    ];
    // map data rows
    return csvRows.join('\n');
  };
  /*
  ...data.map((row) =>
    headers.map((header) => JSON.stringify(row[header] || '')).join(','),
*/
  // Function to download CSV file
  const downloadCsv: (csv: string, filename: string) => void = (
    csv: string,
    filename: string,
  ): void => {
    const blob: Blob = new Blob([csv], { type: 'text/csv' });
    const url: string = window.URL.createObjectURL(blob);
    const anchor: HTMLAnchorElement = document.createElement('a');
    anchor.setAttribute('hidden', '');
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', filename);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // Main function to handle JSON export as CSV
  const exportJsonAsCsv: (jsonData: Interaction[], filename: string) => void = (
    jsonData: Interaction[],
    filename: string,
  ): void => {
    if (jsonData && jsonData.length) {
      const csv: string = convertJsonToCsv(jsonData);
      downloadCsv(csv, filename);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">{t('CONVERSATIONS.TITLE')}</Typography>
        <Button
          disabled={appDatas?.length === 0}
          onClick={(): void =>
            exportJsonAsCsv(
              appDatas.map((appData): Interaction => appData.data),
              `chatbot_all_${format(new Date(), 'yyyyMMdd_HH.mm')}.csv`,
            )
          }
        >
          {t('CONVERSATIONS.EXPORT_ALL')}
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('CONVERSATIONS.TABLE.MEMBER')}</TableCell>
              <TableCell>{t('CONVERSATIONS.TABLE.UPDATED')}</TableCell>
              <TableCell>{t('CONVERSATIONS.TABLE.STATUS')}</TableCell>
              <TableCell>{t('CONVERSATIONS.TABLE.DELETE')}</TableCell>
              <TableCell>{t('CONVERSATIONS.TABLE.EXPORT')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allMembers &&
              allMembers.map((member, index) => {
                const checkedOutAppData = appDatas?.find(
                  (appData) => appData.data.participant.id === member.id,
                );

                const interaction: Interaction | undefined =
                  checkedOutAppData?.data;

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
                            interaction?.completed
                              ? 'success'
                              : interaction?.started
                                ? 'warning'
                                : 'error'
                          }
                        >
                          {StatusLabel(
                            interaction?.started || false,
                            interaction?.completed || false,
                          )}
                        </Alert>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="secondary"
                          onClick={(): void =>
                            deleteAppData({
                              id: checkedOutAppData?.id || '',
                            })
                          }
                          disabled={!checkedOutAppData}
                          sx={{ width: 'auto' }}
                        >
                          <Tooltip title={t('CONVERSATIONS.RESET')}>
                            <DeleteIcon />
                          </Tooltip>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(): void => {
                            exportJsonAsCsv(
                              interaction ? [interaction] : [],
                              `chatbot_${interaction?.description}_${format(new Date(), 'yyyyMMdd_HH.mm')}.csv`,
                            );
                          }}
                          disabled={!interaction}
                        >
                          <FileDownloadIcon />
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
                            {interaction?.started ? (
                              <Stack spacing={2}>
                                <MessagesPane
                                  currentExchange={
                                    interaction.exchanges.exchangeList[
                                      interaction.currentExchange
                                    ]
                                  }
                                  setExchange={(): void => {}}
                                  interactionDescription=""
                                  pastMessages={
                                    interaction.exchanges.exchangeList.flatMap(
                                      (exchange: Exchange): Message[] => {
                                        // Collect dismissed messages from exchanges
                                        if (exchange.dismissed) {
                                          return exchange.messages;
                                        }
                                        return [];
                                      },
                                    ) || []
                                  }
                                  participant={interaction.participant}
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
};

export default Conversations;
