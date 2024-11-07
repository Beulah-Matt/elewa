import { Story } from "@app/model/convs-mgr/stories/main";
import { FlowBuilderStateFrame } from "./flow-builder-state-frame.interface";
import { FlowPageFooterV31, FlowpageForm, FlowPageLayoutElementTypesV31, FlowScreenV31, FlowStory, WFlow } from "@app/model/convs-mgr/stories/flows";
import { generateId } from "../utils/get-uuid.util";

/**
 * Function to load in a new story
 * 
 * @param story - The flow story
 * @param frame - The flow configuration (set if not yet exists)
 * @returns {FlowBuilderStateFrame}
 */
export function __StoryToFlowFrame(story: Story, flow?: WFlow): FlowBuilderStateFrame
{
  return {
    story: story as FlowStory,
    flow: flow ?? _initFrame(story.orgId)
  };
}

/** Initialise the default story configuration */
function _initFrame(orgId: string): WFlow
{
  return {
    flow: {
      id: '',
      version: '3.1',
      data_api_version: '3.0',
      routing_model: {
      },
      screens: [_CreateScreen(1)]
    },
    orgId: orgId,
    validation_errors: [],
    timestamp: new Date().getTime()
  };
}

/**
 * @param storyId - The id of the story the flow screen is being created
 * @param n - The number of the screen added. e.g. 
 *              Screen 1. If it is the first screen pass 1.
 * @returns FlowScreenV31
 */
export function _CreateScreen(n: number): FlowScreenV31 {
  return {
    id: `${generateId()}`,
    layout: {
      type: 'SingleColumnLayout',
      children: [flowForm]
    },
    data: { },
    title: `SCREEN ${n}`,
    terminal: true
  };
}

/** Initialize footer for a new screen */
const footer = {
  label: 'Continue',
  type: FlowPageLayoutElementTypesV31.FOOTER,
  "on-click-action": {
    name: 'navigate',
    // The payload is configured when we build the JSON, as it depends on the input elements
    payload: {}
  }
} as FlowPageFooterV31; 


/** Initialize form to capture data */
const flowForm =  {
  type: FlowPageLayoutElementTypesV31.FORM,
  name: "form",
  children: [footer]
} as FlowpageForm;

