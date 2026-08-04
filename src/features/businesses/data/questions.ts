import { InterviewQuestion } from "../types";
import { getDescriptionPlaceholder } from "./descriptionPlaceholders";

export const questions: InterviewQuestion[] = [
  {
    id: 1,
    field: "name",
    title: "What's your business called?",
    placeholder: "Green Valley Lawn Care",
    required: true,
    inputType: "text",
  },

  {
    id: 2,
    field: "type",
    title: "What type of business is this?",
    placeholder: "Select your business type",
    required: true,
    inputType: "select",
    options: [
      { label: "Restaurant", value: "restaurant" },
      { label: "Lawn Care", value: "lawn_care" },
      { label: "Landscaping", value: "landscaping" },
      { label: "Plumbing", value: "plumber" },
      { label: "Electrical", value: "electrician" },
      { label: "HVAC", value: "hvac" },
      { label: "Cleaning", value: "cleaning" },
      { label: "Dental Practice", value: "dentist" },
      { label: "Legal Practice", value: "lawyer" },
      { label: "Something Else", value: "other" },
    ],
  },

  {
    id: 3,
    field: "customType",
    title: "What kind of business is it?",
    placeholder: "e.g. Bakery, Yoga Studio, Auto Repair Shop, Photography",
    required: true,
    inputType: "text",
    showIf: (answers) => answers.type === "other",
  },

  {
    id: 4,
    field: "description",
    title: "Tell us about your business",
    placeholder: "We provide lawn mowing and yard maintenance services...",
    required: true,
    inputType: "textarea",
    dynamicPlaceholder: (answers) => getDescriptionPlaceholder(answers.type),
  },

  {
    id: 5,
    field: "phone",
    title: "What's your business phone number?",
    placeholder: "(555) 123-4567",
    required: true,
    inputType: "tel",
  },

  {
    id: 6,
    field: "email",
    title: "What's your business email?",
    placeholder: "hello@yourbusiness.com",
    required: true,
    inputType: "email",
  },

  {
    id: 7,
    field: "address",
    title: "Where do you operate?",
    placeholder: "Albany, NY",
    required: true,
    inputType: "text",
  },

  {
    id: 8,
    field: "hours",
    title: "What are your business hours?",
    placeholder: "Mon-Fri 9am-5pm, Sat 9am-2pm (optional)",
    required: false,
    inputType: "text",
  },
];
