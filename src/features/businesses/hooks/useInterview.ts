"use client";

import { useMemo, useState } from "react";

import { questions } from "../data/questions";
import { Business, BusinessType } from "../types";

// Pre-fills the wizard's answers from an already-saved business, so editing
// an existing site starts from what's already there instead of a blank form.
function answersFromBusiness(business?: Partial<Business> | null): Record<string, string> {
    if (!business) return {};
    const answers: Record<string, string> = {};
    if (business.name) answers.name = business.name;
    if (business.type) answers.type = business.type;
    if (business.customType) answers.customType = business.customType;
    if (business.description) answers.description = business.description;
    if (business.phone) answers.phone = business.phone;
    if (business.email) answers.email = business.email;
    if (business.address) answers.address = business.address;
    if (business.hours) answers.hours = business.hours;
    return answers;
}

export default function useInterview(initialBusiness?: Partial<Business> | null) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>(() =>
        answersFromBusiness(initialBusiness)
    );
    const [completed, setCompleted] = useState(false);
    const [business, setBusiness] = useState<Partial<Business> | null>(null);

    // Only the questions relevant given current answers (e.g. skip "custom
    // type" unless "Other" was picked).
    const visibleQuestions = useMemo(
        () => questions.filter((q) => !q.showIf || q.showIf(answers)),
        [answers]
    );

    const question = visibleQuestions[currentQuestion];

    const isCurrentAnswerValid = () => {
        if (!question) return true;
        if (!question.required) return true;
        return (answers[question.field] ?? "").trim().length > 0;
    };

    const next = () => {
        if (currentQuestion < visibleQuestions.length - 1) {
            setCurrentQuestion((previous) => previous + 1);
        } else {
            const createdBusiness = buildBusiness();

            setBusiness(createdBusiness);
            setCompleted(true);
        }
    };

    const previous = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((previous) => previous - 1);
        }
    };

    const updateAnswer = (field: string, value: string) => {
        setAnswers((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const buildBusiness = (): Partial<Business> => {
        return {
            id: initialBusiness?.id ?? crypto.randomUUID(),

            name: answers.name ?? "",

            type: (answers.type as BusinessType) ?? "other",

            customType: answers.customType,

            description: answers.description ?? "",

            phone: answers.phone ?? "",

            email: answers.email ?? "",

            address: answers.address ?? "",

            hours: answers.hours || undefined,
        };
    };

    return {
        currentQuestion,
        totalQuestions: visibleQuestions.length,
        question,
        next,
        previous,
        answers,
        updateAnswer,
        completed,
        business,
        isCurrentAnswerValid: isCurrentAnswerValid(),
    };
}
