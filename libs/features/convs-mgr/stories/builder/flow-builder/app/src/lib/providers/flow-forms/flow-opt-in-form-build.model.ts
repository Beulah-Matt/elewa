import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InputOptInV31 } from "@app/model/convs-mgr/stories/flows";
import {FlowPageLayoutElementTypesV31} from "@app/model/convs-mgr/stories/flows";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateFlowOptInInputForm(_fb: FormBuilder, blockData?: InputOptInV31): FormGroup {
  return _fb.group({
    // name: [blockData?.name ?? "", Validators.required],
    label: [blockData?.label ?? "", Validators.required],
    required: [blockData?.required ?? "", Validators.required],
    visible: [blockData?.visible ?? ''],
    type: FlowPageLayoutElementTypesV31.OPT_IN,
  })
}