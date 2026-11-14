import { motion } from 'framer-motion';
import { MapPin, Globe, Code, Palette, Video, Heart, Mail, Phone, ExternalLink } from 'lucide-react';

const SKILLS = [
  { icon: Code, label: 'Web Development' },
  { icon: Palette, label: 'Web & Graphic Design' },
  { icon: Video, label: 'Video Editing' },
  { icon: Globe, label: 'Digital Media' },
];

const HIGHLIGHTS = [
  {
    title: 'SettleSmart Canada',
    desc: 'A free digital platform helping newcomers in Canada access settlement services, resources, and information.',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    title: 'RefuConnect (In Development)',
    desc: 'A global refugee support hub connecting people to jobs, education, emergency assistance, and resettlement info.',
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
  },
  {
    title: 'PALS & Edmonton Food Bank',
    desc: 'Volunteered with Project Adult Literacy Society and the Edmonton Food Bank to support vulnerable individuals and families.',
    color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
  },
  {
    title: 'MAAK Impact',
    desc: 'Helped small business owners improve digital visibility and growth through digital tools and strategies.',
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  },
];

export default function MeetTheDeveloper() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header badge */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Heart className="w-3.5 h-3.5" />
            Meet the Creator
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground leading-tight">
            Meet the Developer
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-lg">
                <img
                  src="https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/58298bcc0_unnamed.jpg"
                  alt="Lwebuga Charles"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
                Lwebuga Charles
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground text-sm mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Originally from Uganda · Based in Edmonton, Canada</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {SKILLS.map(s => (
                  <span key={s.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/20 text-primary text-xs font-medium">
                    <s.icon className="w-3 h-3" />
                    {s.label}
                  </span>
                ))}
              </div>

              {/* Contact */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="mailto:charzlwebz256@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Mail className="w-4 h-4" />
                  Email Charles
                </a>
                <a href="tel:+14372475086"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
                  <Phone className="w-4 h-4" />
                  +1 (437) 247-5086
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 mb-8 space-y-4">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Biography</h3>

          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Lwebuga Charles is a web designer, web developer, graphic designer, and video editor originally from Uganda, 
            currently based in Edmonton, Canada. He is the creator of <strong className="text-foreground">SettleSmart</strong>, 
            a digital platform designed to support newcomers in Canada by helping them access settlement services, essential 
            resources, and practical information needed to build stable lives through technology.
          </p>

          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            He has a strong background in digital media and creative technology, with experience in web design, graphic design, 
            and video editing. His work focuses on building clean, functional, and user-centered digital experiences that 
            simplify access to information and improve usability for everyday users. He studied video editing and photography 
            at <strong className="text-foreground">Exile Key Records in Kakuma Refugee Camp</strong>, where he earned a certificate 
            and developed hands-on skills in visual storytelling and content production.
          </p>

          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Throughout his journey, he has worked in both technical and community environments, including IT support and 
            digital storytelling roles in refugee settings such as <strong className="text-foreground">Kakuma and Gorom Refugee Camps</strong>. 
            These experiences shaped his approach to technology as a tool for inclusion, empowerment, and problem-solving 
            in underserved communities.
          </p>

          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            He has also contributed to community development initiatives through volunteering with 
            <strong className="text-foreground"> PALS (Project Adult Literacy Society)</strong> and the 
            <strong className="text-foreground"> Edmonton's Food Bank</strong>, supporting efforts that assist vulnerable individuals 
            and families. In addition, he has been involved in entrepreneurship support work with organizations such as 
            <strong className="text-foreground"> MAAK Impact</strong>, helping small business owners improve visibility and growth 
            through digital tools.
          </p>

          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Beyond professional and technical work, Charles is engaged in humanitarian-focused innovation. He is currently 
            building platforms such as <strong className="text-foreground">RefuConnect</strong>, a global refugee support hub 
            that connects people to jobs, education, resources, emergency assistance, and resettlement information. Through 
            his work, he continues to combine creativity, technology, and lived experience to build impactful digital 
            solutions that empower communities and improve access to opportunity.
          </p>
        </div>

        {/* Highlights */}
        <div className="mb-8">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Key Contributions & Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HIGHLIGHTS.map(h => (
              <div key={h.title} className={`rounded-2xl border p-5 ${h.color}`}>
                <h4 className="font-semibold text-sm mb-1">{h.title}</h4>
                <p className="text-xs leading-relaxed opacity-80">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="font-heading font-bold text-lg text-foreground mb-2">Connect with Charles</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Have a project idea, partnership opportunity, or just want to say hello? Charles is always open to conversations 
            about technology, community, and innovation.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:charzlwebz256@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Mail className="w-4 h-4" />
              charzlwebz256@gmail.com
            </a>
            <a href="tel:+14372475086"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors">
              <Phone className="w-4 h-4" />
              +1 (437) 247-5086
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}