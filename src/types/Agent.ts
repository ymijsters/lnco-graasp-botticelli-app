import AgentType from '@/types/AgentType';

type Agent = {
  id: string;
  type: AgentType;
  description?: string;
  name: string;
};

export default Agent;
