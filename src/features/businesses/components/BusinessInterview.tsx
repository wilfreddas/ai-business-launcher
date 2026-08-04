"use client";

import { ChevronLeft } from "lucide-react";
import useInterview from "../hooks/useInterview";

import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";

import WebsitePreviewWrapper from "@/features/website/components/WebsitePreviewWrapper";


export default function BusinessInterview() {

  const {
    currentQuestion,
    totalQuestions,
    question,
    next,
    previous,
    answers,
    updateAnswer,
    completed,
    business,
    isCurrentAnswerValid,
  } = useInterview();


  if (completed && business) {
    return (
      <WebsitePreviewWrapper
        business={business}
      />
    );
  }

  if (!question) {
    return null;
  }

  const placeholder =
    question.dynamicPlaceholder?.(answers) ?? question.placeholder;

  return (

    <div className="mx-auto max-w-2xl">

      <ProgressBar
        current={currentQuestion + 1}
        total={totalQuestions}
      />


      <QuestionCard

        title={question.title}

        placeholder={placeholder}

        value={
          answers[question.field] ?? ""
        }

        required={question.required}

        inputType={question.inputType}

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


      <div className="mt-8 flex justify-between">

        <button
          type="button"
          onClick={previous}
          disabled={currentQuestion === 0}
          className="
          inline-flex
          items-center
          gap-1
          rounded-lg
          border
          border-gray-200
          px-5
          py-3
          font-medium
          text-gray-600
          transition-colors
          hover:bg-gray-50
          disabled:invisible
          "
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={next}
          disabled={!isCurrentAnswerValid}
          className="
          rounded-lg
          bg-black
          px-6
          py-3
          font-medium
          text-white
          transition-colors
          hover:bg-gray-800
          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:bg-black
          "
        >
          {currentQuestion === totalQuestions - 1 ? "Create My Website" : "Next"}
        </button>

      </div>

    </div>

  );
}
