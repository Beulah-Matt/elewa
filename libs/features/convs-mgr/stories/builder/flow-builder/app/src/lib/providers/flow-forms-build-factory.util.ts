import { FormBuilder } from "@angular/forms";

import { FlowControl, FlowControlType, FlowDatepickerInputV31, FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31, FlowTextAreaInput, FlowTextInput, InputOptInV31 } from "@app/model/convs-mgr/stories/flows";

import { _CreateFlowTextForm } from "./flow-forms/flow-text-form-build.model";
import { _CreateFlowTextAreaInputForm } from './flow-forms/flow-text-area-form-build.model'
import { _CreateFlowDatePickerInputForm} from './flow-forms/flow-date-input-build.model'
import { _CreateFlowTextInputForm } from "./flow-forms/flow-text-input-form-build.model";
import { _CreateFlowOptInInputForm } from "./flow-forms/flow-opt-in-form-build.model";
import { _CreateDropDownInputForm } from "./flow-forms/flow-dropdown-build.model";

export function _GetFlowComponentForm(_fb: FormBuilder, componentData?: FlowPageLayoutElementV31) {
  const componentDataType = componentData as FlowControl;
  if (componentDataType ) {
    switch (componentDataType.controlType) {
      case FlowControlType.Text:
        return _CreateFlowTextForm(_fb, componentData);

      case FlowControlType.TextArea:
        return _CreateFlowTextAreaInputForm(_fb, componentData as FlowTextAreaInput);

      case FlowControlType.Datepick:
        return _CreateFlowDatePickerInputForm(_fb, componentData as FlowDatepickerInputV31);

      case FlowControlType.TextInput:
        return _CreateFlowTextInputForm(_fb, componentData as FlowTextInput);

      case FlowControlType.Dropdown:
        return _CreateDropDownInputForm(_fb, componentData);

      case FlowControlType.OptIn:
        return _CreateFlowOptInInputForm(_fb, componentData as InputOptInV31);

    }
  }
  // Default return null
  return  _CreateFlowTextForm(_fb, componentData);
}
