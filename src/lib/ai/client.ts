import OpenAI from "openai";


export async function askAI(
    prompt: string
): Promise<string> {


    const apiKey =
        process.env.OPENAI_API_KEY;


    // No API key yet
    // Use fallback response
    if (!apiKey) {

        const isRestaurant =
            prompt.toLowerCase().includes("restaurant");


        const isLawnCare =
            prompt.toLowerCase().includes("lawn") ||
            prompt.toLowerCase().includes("landscaping");


        if (isRestaurant) {

            return JSON.stringify({

                template: "restaurant",

                sections: [
                    "hero",
                    "menu",
                    "gallery",
                    "reviews",
                    "location",
                    "contact",
                ],

                theme: {
                    style: "modern",
                    primaryColor: "#111111",
                },

            });

        }


        if (isLawnCare) {

            return JSON.stringify({

                template: "service",

                sections: [
                    "hero",
                    "services",
                    "about",
                    "reviews",
                    "contact",
                ],

                theme: {
                    style: "outdoor",
                    primaryColor: "#166534",
                },

            });

        }


        return JSON.stringify({

            template: "service",

            sections: [
                "hero",
                "services",
                "about",
                "reviews",
                "contact",
            ],

            theme: {
                style: "modern",
                primaryColor: "#111111",
            },

        });

    }


    const client = new OpenAI({
        apiKey,
    });


    const response =
        await client.responses.create({

            model: "gpt-5-mini",

            input: prompt,

        });


    return response.output_text;

}