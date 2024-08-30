import { UUID } from '@graasp/sdk';

import AgentType from '@/types/AgentType';

type Agent = {
  id: UUID;
  type: AgentType;
  description?: string;
  name: string;
  imageUrl?: string;
};

export default Agent;
