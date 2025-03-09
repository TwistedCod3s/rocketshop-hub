
import MainLayout from "@/components/layout/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-rocketry-navy mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Find answers to commonly asked questions about our products and services.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Are your rocket kits safe for classroom use?</AccordionTrigger>
              <AccordionContent>
                Yes, all our educational rocket kits are designed with classroom safety in mind. They use
                appropriate motors for the age group, include comprehensive safety guidelines, and are
                compliant with UK educational safety standards. We recommend adult supervision for all
                launches, particularly with younger students.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>What age groups are your products suitable for?</AccordionTrigger>
              <AccordionContent>
                We have products suitable for all school ages, from primary through to sixth form. 
                Our beginner kits are appropriate for ages 8+, while our advanced kits and materials
                are designed for secondary school and college students. Each product listing includes
                recommended age ranges and skill levels.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Do you offer educational discounts for schools?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer special pricing for educational institutions. Schools can register for
                an educational account on our website, which provides access to discounted pricing,
                bulk order options, and educational resources. Contact our sales team for details on
                setting up a school account.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I order for my school?</AccordionTrigger>
              <AccordionContent>
                Schools can place orders through our website using a purchase order number, or we
                can provide a quotation for your finance department. For large orders or custom
                requirements, please contact our education team directly at admin@rocketryforschools.co.uk.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>What is the UKROC Competition?</AccordionTrigger>
              <AccordionContent>
                UKROC (UK Rocketry Challenge) is a national competition for school students to design,
                build and launch model rockets. We provide official competition kits and materials that
                meet the UKROC specifications. Visit our UKROC section for more details on the competition
                and how to enter.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
              <AccordionContent>
                We do ship internationally for most of our products, but we do not ship rocket engines or 
                motor components outside of the UK due to international transport regulations. All other 
                items such as rocket kits (without motors), accessories, and educational materials can be 
                shipped worldwide. International shipping costs are calculated at checkout.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger>What is your returns policy?</AccordionTrigger>
              <AccordionContent>
                We accept returns of unused, unopened items within 30 days of delivery. Custom orders
                and certain components cannot be returned unless faulty. Please contact customer service
                before returning any items. For faulty products, we offer replacements or refunds depending
                on stock availability.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
            <p>Contact our team at admin@rocketryforschools.co.uk or visit us at BL1 1HL Churchgate House, Bolton.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
