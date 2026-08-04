import { Button } from "@/components/ui/Button";


export default function HeroSection({
    title,
    headline,
    description,
}: {
    title: string;
    headline: string;
    description: string;
}) {

    return (
        <section
            className="
            relative
            overflow-hidden
            bg-gradient-to-br
            from-neutral-900
            via-neutral-800
            to-neutral-700
            px-6
            py-28
            text-white
            "
        >

            <div
                className="
                mx-auto
                max-w-6xl
                "
            >

                <p
                    className="
                    mb-4
                    text-sm
                    uppercase
                    tracking-widest
                    text-neutral-300
                    "
                >
                    {title}
                </p>


                <h1
                    className="
                    max-w-3xl
                    text-5xl
                    font-bold
                    leading-tight
                    md:text-7xl
                    "
                >
                    {headline}
                </h1>


                <p
                    className="
                    mt-6
                    max-w-2xl
                    text-xl
                    text-neutral-200
                    "
                >
                    {description}
                </p>


                <Button
                    className="
                    mt-10
                    rounded-full
                    px-8
                    py-6
                    "
                >
                    Contact Us
                </Button>

            </div>

        </section>
    );
}