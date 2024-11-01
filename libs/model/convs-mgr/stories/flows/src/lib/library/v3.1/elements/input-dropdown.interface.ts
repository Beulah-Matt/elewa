import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Flow drop down input
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/components#drop
 */
export interface FlowDropDownInput extends FlowPageLayoutElementV31
{
  /** The input variable name */
//   name: string;

  /** The label to show on the input. Max 20 characters */
  label: string;

  required: boolean;

  type: FlowPageLayoutElementTypesV31.OUTLINE_OPTIONS;
}
