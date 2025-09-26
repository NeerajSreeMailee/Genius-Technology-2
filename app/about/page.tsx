import { BackgroundPatterns } from "@/components/background-patterns";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { UserRound, Linkedin } from "lucide-react";
import profile from "../../public/profile.png";

export default function AboutPage() {
  return (
    <div className="max-h-screen overflow-y-auto">
      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <Header />

        {/* Banner */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-[100px] sm:mt-[120px] lg:mt-[150px] relative z-10">
          <img
            src="/About.png"
            alt="About Us Banner"
            className="h-[250px] sm:h-[350px] lg:h-[500px] w-full object-cover rounded-lg mt-[50px] sm:mt-[60px] lg:mt-[70px]"
          />

          {/* Story & Mission */}
          <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 sm:px-6 lg:px-[50px] justify-between">
            <div className="flex-1 glass-card p-4 sm:p-5 lg:p-6 rounded-xl">
              <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-[#004AAD] mb-2 sm:mb-3">Our Story</h1>
              <p className="text-[#333333] text-sm sm:text-base text-medium text-justify leading-relaxed">
                Genius Technology was founded in 2005 by a team from Rajasthan, driven by a passion to innovate and create meaningful solutions. Our journey began with manufacturing mobile adaptors in a small factory in Vishwas Nagar, Delhi. After two years of hard work, we opened our first office in Gaffar Market, Delhi — marking our entry into India's mobile accessory market.<br /><br />
                Today, Genius Technology offers over 800 high-quality products including mobile screen folders, accessories, and our flagship long-lasting batteries. From humble beginnings to a trusted brand, our story reflects dedication, innovation, and excellence.
              </p>
            </div>
            <div className="flex-1 glass-card p-4 sm:p-5 lg:p-6 rounded-xl">
              <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-[#004AAD] mb-2 sm:mb-3">Our Mission</h1>
              <p className="text-[#333333] text-sm sm:text-base text-medium text-justify leading-relaxed">
                To make quality technology accessible to everyone through innovative products and exceptional service. We aim to bridge the gap between cutting-edge innovation and everyday usability, delivering products that not only perform but inspire.<br /><br />
                We focus on simplifying life, sparking creativity, and elevating digital experiences. At Genius Technology, we don't just build tech—we build trust, convenience, and a smarter future.
              </p>
            </div>
          </div>

          {/* Research & Development */}
          <div className="mt-10 sm:mt-12 lg:mt-14 px-4 sm:px-6 lg:px-[50px]">
            <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold mb-4 sm:mb-6">Research & Development</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🔬 Product Innovation</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">We continuously study market trends and consumer needs to develop next-generation mobile accessories — improving battery performance, designing more durable screen folders, and high-speed charging solutions.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">⚙️ Quality Testing</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Every product undergoes rigorous testing for performance, safety, and durability. Our in-house team ensures every item meets the high-quality standards our customers expect.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">📊 User Feedback Integration</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">We actively collect feedback from distributors, retailers, and customers to improve existing products and inspire new ideas.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🔋 Battery Efficiency & Safety</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Our flagship batteries are optimized for chemistry, thermal stability, and lifespan, ensuring safe and long-lasting options for all devices.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🌍 Sustainability Research</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">We explore eco-friendly materials, low-waste packaging, and sustainable manufacturing practices to reduce environmental impact.</p>
              </Card>
            </div>
          </div>

          {/* Quality Assurance */}
          <div className="mt-10 sm:mt-12 lg:mt-14 px-4 sm:px-6 lg:px-[50px]">
            <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold mb-4 sm:mb-6">Quality You Can Trust</h1>
            <p className="text-[#333333] text-sm sm:text-base max-w-[900px] mb-4 sm:mb-6 text-justify leading-relaxed">
              At Genius Technology, quality isn't just checked — it's engineered. Performance and reliability matter more than ever. Our quality process ensures that every product delivers performance, trust, and long-term value.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">✅ 100% Product Testing</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Each product goes through individual performance checks before it leaves our warehouse.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🛠️ Multi-Stage Inspection</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">From raw materials to finished goods, defects are eliminated through rigorous multi-level inspections.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">📦 Strong, Protective Packaging</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">We use damage-resistant packaging to keep products safe in transit and retail.</p>
              </Card>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="mt-10 sm:mt-12 lg:mt-14 px-4 sm:px-6 lg:px-[50px]">
            <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold mb-4 sm:mb-6">Our Infrastructure</h1>
            <p className="text-[#333333] text-sm sm:text-base max-w-[900px] mb-4 sm:mb-6 text-justify leading-relaxed">
              Our infrastructure supports innovation, scale, and speed. We operate modern manufacturing units, warehouses, in-house testing labs, and a dedicated support team to ensure smooth production, logistics, and customer service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">📍 Manufacturing Units</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">State-of-the-art facilities with automated and semi-automated production lines, in-house testing, and high-capacity machinery.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🏢 Warehousing & Distribution</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Real-time inventory systems and fast logistics ensure stock availability across multiple zones with daily dispatches.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🔧 In-House Testing Lab</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Voltage and thermal testing (batteries), connector strength checks (accessories), and drop, heat, and wear testing (folders/screens).</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">👨‍💻 Office & Support Team</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Sales, marketing, customer service, and admin teams operate from a fully-equipped head office ensuring smooth coordination and superior after-sales support.</p>
              </Card>
            </div>
          </div>

          {/* Vision */}
          <div className="mt-10 sm:mt-12 lg:mt-14 px-4 sm:px-6 lg:px-[50px]">
            <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold mb-4">Our Vision</h1>
            <p className="text-[#333333] text-sm sm:text-base max-w-[900px] text-justify glass-card p-4 sm:p-5 lg:p-6 rounded-xl leading-relaxed">
              To lead the future of smart electronics by delivering innovative, high-performance, and sustainable power solutions. We aim to set new benchmarks in quality and manufacturing excellence, becoming a globally trusted brand for intelligently designed mobile accessories and smart charging technology.
            </p>
          </div>

          {/* Achievements */}
          <div className="mt-10 sm:mt-12 lg:mt-14 px-4 sm:px-6 lg:px-[50px] pb-8 sm:pb-10 lg:pb-12">
            <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold mb-4 sm:mb-6">Our Achievements</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">Recognized Industry Leadership</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Our CEO holds prestigious positions as the President of the Delhi Mobile Trade Association and Vice President of the All India Mobile Trade Association (AIMTA), reflecting our strong industry leadership and influence.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">Pan-India Presence</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">With nationwide distribution, Genius Technology products reach every corner of India, delivering fast, reliable service to customers and partners alike.</p>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}