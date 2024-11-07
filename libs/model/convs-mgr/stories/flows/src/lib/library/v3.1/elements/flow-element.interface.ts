/**
 * A (layout) element of a whatsapp flow.
 * Base type, inherited by all possible layout options.
 * 
 * The screen is built out of these elements
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowsapi/
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson/components/
 */
export interface FlowPageLayoutElementV31 
{ 
  /** Type of the layout element */
  type?: FlowPageLayoutElementTypesV31;

  /**
   * Represents an array of components from the WhatsApp Flows Library.
   */
  children?: FlowPageLayoutElementV31[];

}

/**
 * List of all types our flow builder supports.
 * 
 * Max number of elements per page is 50!
 */
export enum  FlowPageLayoutElementTypesV31 
{
  //
  // Structural elements

  /** Structural element indicating a form. */
  FORM = 'Form',

  /** A footer component. Basically a button requesting the next action. */
  FOOTER = 'Footer',

  /** 
   * A text header 
   *  On text types, use the 'size' attribute to determine what to send to WhatsApp API
  */
  // TEXT = '__text__',

  TextHeading = 'TextHeading',

  TextSubHeading = 'TextSubheading',

  TextBody = 'TextBody',

  TextCaption = 'TextCaption',

  /** Image */
  IMAGE= 'Image',

  /** Anchor link */
  LINK = 'EmbeddedLink',

  //
  // Input elements
  /** Opt-in window */
  OPT_IN = 'OptIn',

  /** Text input field */
  TEXT_INPUT = 'TextInput',

  /** TExt area input */
  TEXT_AREA_INPUT ='TextArea',

  /** Date picker input */
  DATE_PICKER_INPUT = 'DatePicker',

  /** Multi select checkbox group */
  INLINE_CHECKBOX_INPUT = 'CheckboxGroup',
  
  /** Single select radio buttons */
  INLINE_RADIO_BUTTONS = 'RadioButtonsGroup',

  /** Single select options */
  DROPDOWN = 'Dropdown'
}

export const isInputElement = (type: FlowPageLayoutElementTypesV31) => {
  switch (type) {
    case FlowPageLayoutElementTypesV31.OPT_IN:
    case FlowPageLayoutElementTypesV31.TEXT_INPUT:
    case FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT:
    case FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT:
    case FlowPageLayoutElementTypesV31.INLINE_CHECKBOX_INPUT:
    case FlowPageLayoutElementTypesV31.INLINE_RADIO_BUTTONS:
    case FlowPageLayoutElementTypesV31.DROPDOWN:
      return true;
    default:
      return false;
  } 
} 