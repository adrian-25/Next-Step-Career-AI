import React, { useState } from "react"

const courses = [
  {
    title: "Artificial Intelligence & Machine Learning",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
  },
  {
    title: "Data Science & Analytics",
    url: "https://www.edx.org/learn/data-science",
  },
  {
    title: "Cybersecurity & Ethical Hacking",
    url: "https://www.udemy.com/course/the-complete-internet-security-privacy-course-volume-1/",
  },
  {
    title: "Cloud Computing & DevOps",
    url: "https://aws.amazon.com/training/learn-about/cloud-practitioner/",
  },
  {
    title: "Product Management & Business Strategy",
    url: "https://www.coursera.org/specializations/uva-darden-digital-product-management",
  },
]

export function Courses() {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({})
  const toggle = (key: string) => setOpen(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="min-h-screen w-full p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Top 5 Future-Proofing</span> Courses
        </h1>
        <p className="text-muted-foreground mb-8">
          Curated learning paths to stay competitive and accelerate your career.
        </p>

        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.title} className="group">
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm px-4 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">{course.title}</span>
                  <span className="text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Open ↗
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-4">More Courses</h2>

        <div className="space-y-4">
          {/* Programming & Development */}
          <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm">
            <button onClick={() => toggle('dev')} className="w-full flex items-center justify-between px-4 py-4 text-left">
              <span className="font-medium">Programming & Development</span>
              <span className={`transition-transform ${open['dev'] ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open['dev'] && (
              <div className="px-4 pb-4">
                <ul className="space-y-3">
                  <li><a className="text-primary hover:underline" href="https://www.coursera.org/specializations/python" target="_blank" rel="noopener noreferrer">Python for Everybody</a></li>
                  <li><a className="text-primary hover:underline" href="https://www.coursera.org/specializations/full-stack-mobile-app-development" target="_blank" rel="noopener noreferrer">Full-Stack Web Development</a></li>
                  <li><a className="text-primary hover:underline" href="https://www.udemy.com/course/java-the-complete-java-developer-course/" target="_blank" rel="noopener noreferrer">Java Programming Masterclass</a></li>
                </ul>
              </div>
            )}
          </div>

          {/* Design & Creativity */}
          <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm">
            <button onClick={() => toggle('design')} className="w-full flex items-center justify-between px-4 py-4 text-left">
              <span className="font-medium">Design & Creativity</span>
              <span className={`transition-transform ${open['design'] ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open['design'] && (
              <div className="px-4 pb-4">
                <ul className="space-y-3">
                  <li><a className="text-primary hover:underline" href="https://www.coursera.org/specializations/ui-ux-design" target="_blank" rel="noopener noreferrer">UI/UX Design Specialization</a></li>
                  <li><a className="text-primary hover:underline" href="https://www.udemy.com/course/graphic-design-masterclass-everything-you-need-to-know/" target="_blank" rel="noopener noreferrer">Graphic Design Fundamentals</a></li>
                  <li><a className="text-primary hover:underline" href="https://www.udemy.com/course/complete-adobe-creative-cloud-mega-course/" target="_blank" rel="noopener noreferrer">Adobe Creative Cloud Mastery</a></li>
                </ul>
              </div>
            )}
          </div>

          {/* Business & Management */}
          <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm">
            <button onClick={() => toggle('business')} className="w-full flex items-center justify-between px-4 py-4 text-left">
              <span className="font-medium">Business & Management</span>
              <span className={`transition-transform ${open['business'] ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open['business'] && (
              <div className="px-4 pb-4">
                <ul className="space-y-3">
                  <li><a className="text-primary hover:underline" href="https://www.coursera.org/specializations/digital-marketing" target="_blank" rel="noopener noreferrer">Digital Marketing Specialization</a></li>
                  <li><a className="text-primary hover:underline" href="https://online.hbs.edu/courses/financial-accounting/" target="_blank" rel="noopener noreferrer">Financial Analysis for Decision Making</a></li>
                  <li><a className="text-primary hover:underline" href="https://www.coursera.org/specializations/leadership-management" target="_blank" rel="noopener noreferrer">Leadership & Management Essentials</a></li>
                </ul>
              </div>
            )}
          </div>

          {/* Emerging Technologies */}
          <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm">
            <button onClick={() => toggle('emerging')} className="w-full flex items-center justify-between px-4 py-4 text-left">
              <span className="font-medium">Emerging Technologies</span>
              <span className={`transition-transform ${open['emerging'] ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open['emerging'] && (
              <div className="px-4 pb-4">
                <ul className="space-y-3">
                  <li><a className="text-primary hover:underline" href="https://www.coursera.org/specializations/blockchain" target="_blank" rel="noopener noreferrer">Blockchain Specialization</a></li>
                  <li><a className="text-primary hover:underline" href="https://www.coursera.org/specializations/internet-of-things" target="_blank" rel="noopener noreferrer">Internet of Things (IoT)</a></li>
                  <li><a className="text-primary hover:underline" href="https://www.edx.org/learn/quantum-computing" target="_blank" rel="noopener noreferrer">Quantum Computing Fundamentals</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Courses


