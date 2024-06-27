import { BotVersions } from "@app/model/convs-mgr/bots";
import { StoryModuleTypes } from "@app/model/convs-mgr/stories/blocks/structural";
import { IObject } from "@iote/bricks";

/**
 * A story is a conversational flow that models the 
 *    interaction between a chatbot actor (the engine) and a physical actor (an end user).
 * 
 * The conversation between a chatbot and a physical actor can consist out of different stories,
 *    human takeover, etc.. It is not limited to single story.
 * 
 * A story consists out of different Blocks with StartBlock ID = Story ID.
 */
export interface Story extends IObject
{
  /* Foreign Key to Organisation holding the story. */
  orgId: string;

  /* Name of the story */
  name?: string;

  /* image of the story */
  imageField?: string;

  /* description of the story */
  description?: string;

  /* chapter of the story */
  chapter?: string;

  /** id of the parent module */
  parentModule?: string;

  /** Id of the parent bot */
  parentBot?: string

  /** NEW INHERITANCE - ID of the parent Story */
  parent?: string;

  /* type of the story */
  isAssessment?: boolean

  /* time of publishing */
  publishedOn?: Date;

  /** total number of blocks in the story */
  blocksCount?: number;

  version?: BotVersions;

  type?: StoryModuleTypes;
}
