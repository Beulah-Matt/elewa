import { FormBuilder, FormGroup } from "@angular/forms";

import { FlowPageFooterV31 } from "@app/model/convs-mgr/stories/flows";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateFlowNavButtonForm(_fb: FormBuilder, blockData?: FlowPageFooterV31): FormGroup {
  return _fb.group({
    label: [blockData?.label ?? ''],
    type: [blockData?.type ?? ''],
    action: [blockData?.["on-click-action"] ?? ''],
  })
}