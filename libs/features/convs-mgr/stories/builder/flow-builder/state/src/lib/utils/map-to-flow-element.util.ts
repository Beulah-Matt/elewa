import { FLOW_CONTROLS, FlowControl, FlowPageLayoutElementV31 } from "@app/model/convs-mgr/stories/flows";

export function _MapToFlowControl(element: FlowPageLayoutElementV31)
{
  const controls = FLOW_CONTROLS();

  // Find the matching control based on the element type
  const control = controls.find((control) => control.controlType.toString() === element.type);
  
  if(control) {
    control.dropped = true;
    control.hasInput = true;
  }
  
  // Return the matched control, or return a default/fallback control if no match is found
  return { ...control, ...element } as FlowControl;
}
