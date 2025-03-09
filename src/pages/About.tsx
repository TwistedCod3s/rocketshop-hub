
import MainLayout from "@/components/layout/MainLayout";
const About = () => {
  return <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-rocketry-navy mb-6">About Rocketry For Schools</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Rocketry For Schools is dedicated to bringing rocketry education to schools across the UK,
              helping inspire the next generation of scientists, engineers, and space enthusiasts.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Our Mission</h2>
            <p>
              Our mission is to make rocketry accessible to all schools, providing high-quality materials,
              expert guidance, and educational resources to help teachers and students engage with STEM subjects
              through the exciting world of rockets.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Our Story</h2>
            <p>We believe in learning through doing. Our rocket kits and educational materials are designed to provide hands-on experiences that make complex scientific concepts tangible and engaging. Our competition-ready resources help teachers integrate rocketry into their extracurricular program easily with the same capabilities as schools with experience at UKROC </p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Our Approach</h2>
            <p>Safety is our top priority. All our products and services emphasize proper safety procedures. Teachers and students need to be aware of all safety rules to ensure all rocket activities are conducted safely. Rocketry for schools is not liable for any injuries or damages caused by negligence to acknowledge proper safety rules.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Safety First</h2>
            <p>
              Safety is our top priority. All our products and educational materials emphasize proper
              safety procedures, and we provide comprehensive guidelines for teachers and students
              to ensure all rocket activities are conducted safely.
            </p>
            
            <div className="my-12 bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Join us in inspiring the next generation</h3>
              <p>
                Whether you're a teacher looking to bring rocketry to your classroom, or a parent
                wanting to encourage your child's interest in STEM, we're here to help. Explore
                our range of products and resources, or get in touch to discuss how we can support
                your educational needs.
              </p>
              <p className="mt-4">
                Contact us at admin@rocketryforschools.co.uk or visit us at BL1 1HL Churchgate House, Bolton.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>;
};
export default About;
