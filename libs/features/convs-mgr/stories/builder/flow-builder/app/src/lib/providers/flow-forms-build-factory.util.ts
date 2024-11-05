import { FormBuilder } from "@angular/forms";

import { FlowControl, FlowControlType, FlowDatepickerInputV31, FlowDropDownInput, FlowPageLayoutElementV31, FlowTextAreaInput, FlowTextInput, InputOptInV31 } from "@app/model/convs-mgr/stories/flows";

import { _CreateFlowTextForm } from "./flow-forms/flow-text-form-build.model";
import { _CreateFlowTextAreaInputForm } from './flow-forms/flow-text-area-form-build.model'
import { _CreateFlowDatePickerInputForm} from './flow-forms/flow-date-input-build.model'
import { _CreateFlowTextInputForm } from "./flow-forms/flow-text-input-form-build.model";
import { _CreateFlowOptInInputForm } from "./flow-forms/flow-opt-in-form-build.model";
import { _CreateDropDownInputForm } from "./flow-forms/flow-dropdown-build.model";

export function _GetFlowComponentForm(_fb: FormBuilder, componentData?: FlowPageLayoutElementV31) {
  const componentDataType = componentData as FlowControl;
  if (componentDataType ) {
    switch (componentDataType.type as unknown as FlowControlType) {
      case FlowControlType.TextHeading:
      case FlowControlType.TextSubHeading:
      case FlowControlType.TextCaption:
      case FlowControlType.TextBody:
        return _CreateFlowTextForm(_fb, componentData);

      case FlowControlType.TEXT_AREA_INPUT:
        return _CreateFlowTextAreaInputForm(_fb, componentData as FlowTextAreaInput);

      case FlowControlType.DATE_PICKER_INPUT:
        return _CreateFlowDatePickerInputForm(_fb, componentData as FlowDatepickerInputV31);

      case FlowControlType.TEXT_INPUT:
        return _CreateFlowTextInputForm(_fb, componentData as FlowTextInput);

      case FlowControlType.DROPDOWN:
        return _CreateDropDownInputForm(_fb, componentData as FlowDropDownInput);

      case FlowControlType.OPT_IN:
        return _CreateFlowOptInInputForm(_fb, componentData as InputOptInV31);

    }
  }
  // Default return null
  return  _CreateFlowTextForm(_fb, componentData);
}
