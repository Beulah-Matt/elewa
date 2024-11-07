export enum FlowControlType
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