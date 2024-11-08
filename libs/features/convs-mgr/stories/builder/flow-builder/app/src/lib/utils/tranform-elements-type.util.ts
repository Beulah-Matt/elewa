import { FlowControl, FlowPageLayoutElementV31 } from '@app/model/convs-mgr/stories/flows';

export const transformToFlowElement = (controls: FlowControl[]): FlowPageLayoutElementV31[] => {
  return controls.map((c)=> {
    // Get keys of FlowControl interface
    const flowElement = Object.fromEntries(
      Object.entries(c).filter(([key]) => !["group", "controlLabel", "controlType", "icon", "id", "dropped", "value", "hasInput"].includes(key))
    );
    
    return flowElement;
  }) as unknown as FlowPageLayoutElementV31[];
}