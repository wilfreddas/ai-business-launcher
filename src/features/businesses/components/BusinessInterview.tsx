"use client";

import { questions } from "../data/questions";
import useInterview from "../hooks/useInterview";

import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";

import {
  WebsitePreviewWrapper,
} from "@/features/website";


export default function BusinessInterview() {

  const {
    currentQuestion,
    next,
    answers,
    updateAnswer,
    completed,
    business,
  } = useInterview();


  if (completed && business) {
    return (
      <WebsitePreviewWrapper
        business={business}
      />
    );
  }


  const question =
    questions[currentQuestion];


  return (

    <div className="mx-auto max-w-2xl">

      <ProgressBar
        current={currentQuestion + 1}
        total={questions.length}
      />


      <QuestionCard

        title={question.title}

        placeholder={
          question.placeholder
        }

        value={
          answers[question.field] ?? ""
        }


        options={
          question.options
        }


        onChange={(value) =>
          updateAnswer(
            question.field,
            value
          )
        }

      />


      <div className="mt-8 flex justify-end">

        <button
          onClick={next}
          className="
          rounded-lg
          bg-black
          px-6
          py-3
          text-white
          "
        >
          Next
        </button>

      </div>

    </div>

  );
}