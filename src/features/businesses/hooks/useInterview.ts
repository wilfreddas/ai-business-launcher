"use client";

import { useState } from "react";

import { questions } from "../data/questions";
import { Business } from "../types";

export default function useInterview() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [completed, setCompleted] = useState(false);
    const [business, setBusiness] = useState<Partial<Business> | null>(null);

    const next = () => {
        if (currentQuestion < questions.length - 1) {
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
            id: crypto.randomUUID(),

            name: answers.name ?? "",

            type: answers.type as Business["type"],

            description: answers.description ?? "",

            address: answers.address ?? "",
        };
    };

    return {
        currentQuestion,
        next,
        previous,
        answers,
        updateAnswer,
        completed,
        business,
    };
}