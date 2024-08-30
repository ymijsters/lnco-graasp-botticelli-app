import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { Member } from '@graasp/sdk';

import { hooks, mutations } from '@/config/queryClient';
import MessagesPane from '@/modules/message/MessagesPane';
import Interaction from '@/types/Interaction';

type Props = {
  checkedOutMember: Member;
  setCheckedOutMember: (newCheckedOutMember: Member) => void;
};

// Main component for managing conversations
const Conversations: FC<Props> = ({
  checkedOutMember,
  setCheckedOutMember,
}) => {
  const { t } = useTranslation();

  // Hook to handle deleting app data
  const { mutate: deleteAppData } = mutations.useDeleteAppData();

  // Fetching interaction data
  const { data: appDatas } = hooks.useAppData<Interaction>();

  // Fetching all members from the app context or defaulting to the checked-out member
  const allMembers = hooks.useAppContext().data?.members || [checkedOutMember];

  // Memoized value to find the interaction corresponding to the selected member
  const checkedOutInteraction = useMemo(
    () =>
      appDatas?.find(
        (appData) =>
          appData?.data?.exchanges?.exchangeList &&
          appData.member.id === checkedOutMember.id,
      )?.data,
    [appDatas, checkedOutMember.id],
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('CONVERSATIONS.TITLE')}</Typography>

      <FormControl fullWidth>
        <InputLabel>{t('CONVERSATIONS.MEMBER')}</InputLabel>
        <Select
          value={checkedOutMember.id}
          renderValue={(selectedId) =>
            allMembers?.find((member) => member.id === selectedId)?.name ||
            selectedId
          }
          label={t('CONVERSATIONS.MEMBER')}
          onChange={(e) =>
            setCheckedOutMember(
              allMembers.find((member) => member.id === e.target.value) ||
                checkedOutMember,
            )
          }
        >
          {allMembers.map((member, nb) => (
            <MenuItem key={nb} value={member.id}>
              {member.name || member.id}
            </MenuItem>
          ))}
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
                setExchange={() => {}}
                interactionDescription=""
                pastMessages={
                  checkedOutInteraction.exchanges.exchangeList.flatMap(
                    (exchange) => {
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
                goToNextExchange={() => {}}
                readOnly
              />
              {checkedOutInteraction.completed ? (
                <Alert variant="filled" severity="success">
                  {t('CONVERSATIONS.COMPLETE')}
                </Alert>
              ) : (
                <Alert sx={{ Width: '50%' }} variant="filled" severity="error">
                  {t('CONVERSATIONS.INCOMPLETE')}
                </Alert>
              )}

              <Stack direction="row" justifyContent="center">
                <IconButton
                  color="secondary"
                  onClick={() =>
                    deleteAppData({
                      id:
                        appDatas?.find(
                          (appData) =>
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
};

export default Conversations;
