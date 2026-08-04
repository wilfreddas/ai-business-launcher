import { InterviewQuestion } from "../types";

export const questions: InterviewQuestion[] = [
  {
    id: 1,
    field: "name",
    title: "What's your business called?",
    placeholder: "Green Valley Lawn Care",
    required: true,
  },

  {
    id: 2,
    field: "type",
    title: "What type of business is this?",
    placeholder: "Select your business type",
    required: true,
    options: [
      {
        label: "Restaurant",
        value: "restaurant",
      },
      {
        label: "Lawn Care",
        value: "lawn_care",
      },
      {
        label: "Landscaping",
        value: "landscaping",
      },
      {
        label: "Plumbing",
        value: "plumber",
      },
      {
        label: "Cleaning",
        value: "cleaning",
      },
      {
        label: "Other Service",
        value: "other",
      },
    ],
  },

  {
    id: 3,
    field: "description",
    title: "Tell us about your business",
    placeholder:
      "We provide lawn mowing and yard maintenance services...",
    required: true,
  },

  {
    id: 4,
    field: "address",
    title: "Where do you operate?",
    placeholder: "Albany, NY",
    required: true,
  },
];