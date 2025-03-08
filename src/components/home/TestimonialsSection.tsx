
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Implementing the Rocketry For Schools program transformed our STEM curriculum. Students are more engaged and excited about science than ever before.",
    author: "Sarah Johnson",
    role: "Science Department Chair",
    school: "Lincoln High School",
  },
  {
    quote: "The quality of materials and the accompanying curriculum made it incredibly easy to integrate rocketry into our after-school program. Customer support has been exceptional.",
    author: "Michael Torres",
    role: "STEM Coordinator",
    school: "Washington Middle School",
  },
  {
    quote: "We've seen a dramatic increase in students pursuing engineering pathways after introducing the rocketry program from Rocketry For Schools. The hands-on experience makes all the difference.",
    author: "Dr. Patricia Lee",
    role: "Principal",
    school: "Oakridge Academy",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <div className="py-16 bg-rocketry-navy text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold">What Educators Are Saying</h2>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            Hear from teachers and administrators who have implemented our rocketry programs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <svg className="h-8 w-8 text-rocketry-blue mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16.036-.33.084-.51.144-.09.03-.18.056-.27.08L6.2 15.064c1.177-.423 1.98-.692 2.442-.81.085-.02.15-.085.15-.171v-.26c0-.067-.035-.128-.09-.15-.055-.027-.113-.005-.15.054-.067.106-.168.197-.304.267-.133.07-.268.123-.405.158-.107.03-.21.043-.315.043-.312 0-.585-.103-.83-.31-.248-.21-.44-.48-.572-.83-.13-.348-.198-.75-.198-1.205 0-.437.058-.84.172-1.204.112-.366.282-.678.51-.94a2.207 2.207 0 0 1 .85-.569c.342-.134.706-.2 1.088-.2.425 0 .825.076 1.198.23.375.154.693.376.952.673.26.296.462.655.609 1.076.148.42.222.87.222 1.343 0 .87-.156 1.62-.469 2.246a4.118 4.118 0 0 1-1.29 1.517c-.548.386-1.184.645-1.903.772v1.06c1.166-.21 2.132-.66 2.894-1.345.45-.415.83-.915 1.142-1.5.313-.582.47-1.22.47-1.908zM21 11.98c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.694-1.327-.823-.56-.128-1.07-.137-1.54-.028-.16.036-.33.084-.51.144-.09.03-.18.056-.27.08l-.6 2.14c1.177-.424 1.98-.694 2.441-.813.085-.02.15-.79.15-.165v-.267c0-.067-.035-.13-.09-.15-.055-.02-.113.006-.15.06-.067.106-.168.197-.304.267-.133.07-.268.123-.405.158-.107.03-.21.043-.315.043-.312 0-.586-.103-.83-.31-.248-.21-.44-.48-.572-.83-.13-.347-.2-.75-.2-1.204 0-.435.06-.84.174-1.204.115-.365.282-.676.51-.94a2.26 2.26 0 0 1 .85-.569c.342-.133.707-.2 1.09-.2.424 0 .824.076 1.196.23a3.36 3.36 0 0 1 .952.673c.26.297.463.655.61 1.08.148.42.22.87.22 1.344 0 .87-.156 1.62-.468 2.246a4.118 4.118 0 0 1-1.29 1.517c-.55.385-1.184.645-1.904.772v1.06c1.166-.21 2.132-.66 2.894-1.345.45-.424.83-.92 1.142-1.508S21 12.67 21 11.98z" />
                </svg>
                <p className="mb-4 text-white/90 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-white/70">{testimonial.role}</p>
                  <p className="text-sm text-white/70">{testimonial.school}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
