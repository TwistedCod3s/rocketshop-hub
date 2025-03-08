
import { Product } from "@/types/shop";

// Initial sample products
export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Junior Rocket Kit",
    description: "Perfect beginner kit for students to learn the basics of rocket science",
    fullDescription: "The Junior Rocket Kit is specifically designed for young rocketeers and classrooms. This comprehensive kit includes everything needed to build and launch a small model rocket, making it perfect for students to learn the fundamentals of rocket science, physics, and engineering. The kit comes with detailed instructions that are easy to follow, making it ideal for educational settings or home use under adult supervision.",
    price: 24.99,
    category: "Kits",
    images: [
      "/lovable-uploads/464bb92b-3c96-4abd-9987-49654404f1b3.png",
      "/placeholder.svg"
    ],
    inStock: true,
    featured: true,
    rating: 4.5,
    specifications: [
      { name: "Height", value: "12 inches" },
      { name: "Diameter", value: "1.5 inches" },
      { name: "Max Altitude", value: "400 feet" },
      { name: "Recovery", value: "Parachute" },
      { name: "Skill Level", value: "Beginner" },
      { name: "Assembly Time", value: "2-3 hours" }
    ],
    reviews: [
      {
        user: "ScienceTeacher",
        rating: 5,
        comment: "Excellent kit for classroom use. My students loved building and launching these rockets.",
        date: "2023-10-15"
      },
      {
        user: "RocketDad",
        rating: 4,
        comment: "Great starter kit. Instructions were clear, and my son was thrilled with the launch.",
        date: "2023-09-22"
      }
    ]
  },
  {
    id: "2",
    name: "Advanced Explorer Rocket",
    description: "High-performance rocket for advanced students with data collection capabilities",
    fullDescription: "The Advanced Explorer Rocket is designed for high school and advanced middle school students. This sophisticated model rocket allows students to conduct experiments and collect data during flight. It comes with an altimeter and temperature sensor, providing real-world data for analysis. The kit includes comprehensive assembly instructions, quality components, and educational materials about rocket science principles and data analysis.",
    price: 89.99,
    category: "Rockets",
    images: [
      "/lovable-uploads/5e9df28c-dfeb-451d-aa2d-e34a30a769c6.png",
      "/placeholder.svg"
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    specifications: [
      { name: "Height", value: "24 inches" },
      { name: "Diameter", value: "2.6 inches" },
      { name: "Max Altitude", value: "1,500 feet" },
      { name: "Recovery", value: "Dual deployment system" },
      { name: "Skill Level", value: "Advanced" },
      { name: "Data Collection", value: "Altimeter, Temperature" }
    ],
    reviews: [
      {
        user: "PhysicsClub",
        rating: 5,
        comment: "Amazing educational tool. We used this for our science fair project and the data collection was excellent.",
        date: "2023-11-05"
      }
    ]
  },
  {
    id: "3",
    name: "Classroom Rocket Engine Pack",
    description: "Bulk pack of rocket engines suitable for classroom projects",
    fullDescription: "Our Classroom Rocket Engine Pack provides teachers and schools with high-quality, reliable rocket motors at a discounted bulk rate. This pack includes 24 A8-3 engines, perfect for most beginner to intermediate level model rockets. Each engine comes with igniters and recovery wadding. These engines are thoroughly tested for safety and consistent performance, making them ideal for educational settings where multiple launches may take place.",
    price: 65.99,
    category: "Components",
    images: [
      "/lovable-uploads/6deeac36-da1c-460a-8457-ffb92c527e95.png",
      "/placeholder.svg"
    ],
    inStock: true,
    featured: true,
    rating: 4.6,
    specifications: [
      { name: "Engine Type", value: "A8-3" },
      { name: "Quantity", value: "24 engines" },
      { name: "Total Impulse", value: "2.5 Newton-seconds each" },
      { name: "Includes", value: "Igniters and recovery wadding" },
      { name: "Certifications", value: "NAR certified" }
    ],
    reviews: [
      {
        user: "STEMEducator",
        rating: 5,
        comment: "These engines are perfect for our classroom needs. Consistent performance and the bulk pricing saves our budget.",
        date: "2023-08-30"
      },
      {
        user: "RocketClubLeader",
        rating: 4,
        comment: "Good quality engines. Our school rocket club uses these for all our launches.",
        date: "2023-10-12"
      }
    ]
  },
  {
    id: "4",
    name: "Rocket Science Curriculum Bundle",
    description: "Complete teaching materials for a 6-week rocket science unit",
    fullDescription: "The Rocket Science Curriculum Bundle is a comprehensive educational package designed for teachers who want to incorporate rocket science into their STEM curriculum. This bundle includes detailed lesson plans for a 6-week unit, worksheets, assessment tools, presentation slides, and hands-on activities. The materials align with Next Generation Science Standards and include cross-disciplinary connections to mathematics, engineering, and physics. Perfect for middle and high school science classes.",
    price: 129.99,
    category: "Books",
    images: [
      "/placeholder.svg"
    ],
    inStock: true,
    featured: false,
    rating: 4.9,
    specifications: [
      { name: "Grade Level", value: "6-12" },
      { name: "Duration", value: "6-week unit" },
      { name: "Format", value: "Digital download + printed materials" },
      { name: "Includes", value: "Lesson plans, worksheets, assessments, slides" },
      { name: "Standards", value: "NGSS aligned" }
    ],
    reviews: [
      {
        user: "ScienceDepartmentHead",
        rating: 5,
        comment: "Excellent curriculum resource. Well-structured and engaging for students. Highly recommend for any science teacher.",
        date: "2023-09-18"
      }
    ]
  },
  {
    id: "5",
    name: "Digital Rocket Launch Controller",
    description: "Safe and reliable digital launch system for school rocket activities",
    fullDescription: "Our Digital Rocket Launch Controller is designed specifically for educational settings, prioritizing safety while providing an exciting launch experience. This controller features a digital countdown, key lock for teacher authorization, safety interlock system, and audible launch warnings. The 30-foot cable allows for safe distance during launches, and the system is compatible with all standard model rocket igniters. The controller is powered by a rechargeable battery and comes in a durable carrying case for easy transport and storage.",
    price: 149.99,
    category: "Tools",
    images: [
      "/placeholder.svg"
    ],
    inStock: false,
    featured: false,
    rating: 4.7,
    specifications: [
      { name: "Cable Length", value: "30 feet" },
      { name: "Power Source", value: "Rechargeable battery" },
      { name: "Features", value: "Digital countdown, key lock, safety interlock" },
      { name: "Compatibility", value: "Works with all standard igniters" },
      { name: "Case", value: "Included durable carrying case" }
    ],
    reviews: [
      {
        user: "RocketryTeacher",
        rating: 5,
        comment: "This launch controller has transformed our rocket days. The safety features give me peace of mind, and the students love the countdown feature.",
        date: "2023-07-25"
      },
      {
        user: "AfterSchoolSTEM",
        rating: 4,
        comment: "Great quality and very reliable. The only downside is it's a bit pricey for our program budget.",
        date: "2023-08-14"
      }
    ]
  }
];
