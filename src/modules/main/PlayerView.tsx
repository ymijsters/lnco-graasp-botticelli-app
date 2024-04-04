// import { Typography } from '@mui/material';
// import { useLocalContext } from '@graasp/apps-query-client';
// import { hooks } from '@/config/queryClient';
import { Box } from '@mui/material';

import { PLAYER_VIEW_CY } from '@/config/selectors';
import ParticipantInteraction from '@/modules/interaction/ParticipantInteraction';

const PlayerView = (): JSX.Element => (
  // const { permission } = useLocalContext();
  // const { data: appContext } = hooks.useAppContext();
  // const members = appContext?.members;

  <Box data-cy={PLAYER_VIEW_CY} sx={{ height: '100vh' }}>
    {/* Player as {permission} */}
    {/* <Box p={2}> */}
    {/*   <Typography>Members</Typography> */}
    {/*   <pre>{JSON.stringify(members, null, 2)}</pre> */}
    {/* </Box> */}
    <ParticipantInteraction />
  </Box>
);
export default PlayerView;
