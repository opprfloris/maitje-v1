
export type Helper = {
  id: number;
  name: string;
  avatar_emoji: string;
  character_description: string;
  created_at: string;
};

export type GenericTip = {
  id: number;
  text_template: string;
  created_at: string;
};

export type SpecificTip = {
  id: number;
  helper_id: number;
  text: string;
  created_at: string;
};
