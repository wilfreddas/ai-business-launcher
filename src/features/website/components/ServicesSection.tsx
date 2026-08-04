import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const services = [
  "Quality Service",
  "Reliable Support",
  "Customer Satisfaction",
];


export default function ServicesSection({ description }: { description?: string }) {
  return (
    <section className="bg-muted/40 px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Our Services
      </h2>


      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">

        {services.map((service) => (

          <Card key={service}>

            <CardHeader>
              <CardTitle>
                {service}
              </CardTitle>
            </CardHeader>

            <CardContent>
              Professional service designed around your needs.
            </CardContent>

          </Card>

        ))}

      </div>

    </section>
  );
}