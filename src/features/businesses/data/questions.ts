import { InterviewQuestion } from "../types";

export const questions: InterviewQuestion[] = [
  {
    id: 1,
    field: "name",
    title: "What's your business called?",
    placeholder: "Joe's Plumbing",
    required: true,
  },
  {
    id: 2,
    field: "description",
    title: "Tell us about your business",
    placeholder: "We provide residential plumbing services...",
    required: true,
  },
  {
    id: 3,
    field: "address",
    title: "Where do you operate?",
    placeholder: "Albany, NY",
    required: true,
  },
];