import { ReactElement } from 'react';

import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

type AvatarWithStatusProps = AvatarProps & {
  online?: boolean;
};

const AvatarWithStatus = ({
  online = false,
  ...rest
}: AvatarWithStatusProps): ReactElement => (
  <div>
    <Badge
      color={online ? 'success' : 'default'}
      variant={online ? 'dot' : 'standard'}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Avatar {...rest} />
    </Badge>
  </div>
);

export default AvatarWithStatus;
