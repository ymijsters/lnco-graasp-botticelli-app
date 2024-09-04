import { UUID } from '@graasp/sdk';

import AgentType from '@/types/AgentType';

type Agent = {
  id: UUID;
  name: string;
  type: AgentType;
  description?: string;
  imageUrl?: string;
};

export default Agent;
