import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, Mail, ExternalLink, Code } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import api from "../api";

const Portfolio = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [portfolioData, setPortfolioData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  const getPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/portfolio/${username}`);

      if (!response.data.success) {
        setError(response.data.message || "User not found");
        setLoading(false);
        return;
      }

      console.log(response.data);
      setPortfolioData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      if (error.response?.status === 404) {
        setError("User not found. Please check the username and try again.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to load portfolio. Please try again.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getPortfolioData();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = [
        "home",
        "about",
        "skills",
        "experience",
        "projects",
        "contact",
      ];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [username]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
      tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
      github: "#",
      live: "#",
    },
    {
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      tech: ["React", "Socket.io", "MongoDB", "Express"],
      github: "#",
      live: "#",
    },
    {
      title: "Weather Dashboard",
      description:
        "A responsive weather application with location-based forecasts, interactive maps, and weather alerts using OpenWeatherMap API.",
      tech: ["React", "OpenWeatherMap API", "Chart.js", "Tailwind"],
      github: "#",
      live: "#",
    },
  ];

  const skills = [
    {
      name: "Jenkins",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg",
    },
    {
      name: "C++",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
    },
    {
      name: "Socket.io",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg",
    },
    {
      name: "Vitest",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitest/vitest-original.svg",
    },
    {
      name: "Appwrite",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/appwrite/appwrite-original.svg",
    },
    {
      name: "Cloudflare",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg",
    },
    {
      name: "Three.js",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg",
    },
    {
      name: "Qwik",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/qwik/qwik-original.svg",
    },
    {
      name: "Svelte/SvelteKit",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
    },
    {
      name: "Astro",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original.svg",
    },
    {
      name: "Salesforce",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/salesforce/salesforce-original.svg",
    },
    {
      name: "Supabase",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
    },
    {
      name: "OAuth",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oauth/oauth-original.svg",
    },
    {
      name: "Kubernetes",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg",
    },
    {
      name: "Azure",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg",
    },
    {
      name: "Vercel",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
    },
    {
      name: "Netlify",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg",
    },
    {
      name: "GitHub",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
    },
    {
      name: "GitLab",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg",
    },
    {
      name: "Jest",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg",
    },
    {
      name: "Prisma",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
    },
    {
      name: "Mocha",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mocha/mocha-original.svg",
    },
    {
      name: "Redux",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg",
    },
    {
      name: "MySQL",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    },
    {
      name: "Express.js",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
    },
    {
      name: "PHP",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
    },
    {
      name: "Postman",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
    },
    {
      name: "Java",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
    },
    {
      name: "React",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    },
    {
      name: "Vue.js",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
    },
    {
      name: "TypeScript",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    },
    {
      name: "Tailwind CSS",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    },
    {
      name: "Node.js",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    },
    {
      name: "Python",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    },
    {
      name: "PostgreSQL",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    },
    {
      name: "MongoDB",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
    },
    {
      name: "React Native",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    },
    {
      name: "Flutter",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
    },
    {
      name: "Android",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg",
    },
    {
      name: "Swift",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",
    },
    {
      name: "Figma",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    },
    {
      name: "Adobe XD",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/xd/xd-original.svg",
    },
    {
      name: "Photoshop",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg",
    },
    {
      name: "Google Cloud",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
    },
    {
      name: "HTML5",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    },
    {
      name: "CSS3",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    },
    {
      name: "JavaScript",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    },
    {
      name: "Angular",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg",
    },
    {
      name: "Git",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    },
    {
      name: "Docker",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    },
    {
      name: "AWS",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    },
    {
      name: "Firebase",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
    },
  ];

  const experiences = [
    {
      company: "TechCorp Solutions",
      position: "Senior Full Stack Developer",
      startDate: "Jan 2023",
      endDate: "Present",
      responsibilities: [
        "Led development of microservices architecture serving 100k+ users",
        "Mentored junior developers and conducted code reviews",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
        "Collaborated with cross-functional teams to deliver features on time",
      ],
    },
    {
      company: "StartupXYZ",
      position: "Frontend Developer",
      startDate: "Jun 2021",
      endDate: "Dec 2022",
      responsibilities: [
        "Developed responsive web applications using React and TypeScript",
        "Improved application performance by 40% through optimization",
        "Integrated third-party APIs and payment gateways",
        "Worked closely with designers to implement pixel-perfect UIs",
      ],
    },
    {
      company: "Digital Agency Pro",
      position: "Junior Web Developer",
      startDate: "Mar 2020",
      endDate: "May 2021",
      responsibilities: [
        "Built custom WordPress themes and plugins for clients",
        "Maintained and updated existing client websites",
        "Collaborated with design team to create engaging user experiences",
        "Learned modern JavaScript frameworks and best practices",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Loading State */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading portfolio...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h1>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 w-full cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Content */}
      {!loading && !error && portfolioData && (
        <>
          {/* Navigation */}
          <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
              isScrolled
                ? "bg-white/80 backdrop-blur-md shadow-lg"
                : "bg-transparent"
            }`}
          >
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-900">
                  Portfolio
                </div>
                <div className="hidden md:flex space-x-8">
                  {[
                    "Home",
                    "About",
                    "Skills",
                    "Experience",
                    "Projects",
                    "Contact",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className={`transition-all duration-300 font-medium cursor-pointer relative ${
                        activeSection === item.toLowerCase()
                          ? "text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.6)] font-semibold"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {item}
                      {activeSection === item.toLowerCase() && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full shadow-[0_0_6px_rgba(37,99,235,0.8)]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section
            id="home"
            className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
            <div className="max-w-4xl text-center z-10">
              <div className="animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  John Developer
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Full-stack developer crafting digital experiences with modern
                  technologies and creative solutions
                </p>
                <div className="flex justify-center space-x-6 mb-12">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaGithub size={26} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaLinkedin size={26} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaXTwitter size={26} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Mail size={26} />
                  </a>
                </div>
                <button
                  onClick={() => scrollToSection("about")}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Get to know me
                </button>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown size={24} className="text-gray-400" />
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">About Me</h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Hi, I'm John</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    I'm a passionate full-stack developer with 5+ years of
                    experience building scalable web applications. I love
                    turning complex problems into simple, beautiful designs that
                    provide exceptional user experiences.
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    When I'm not coding, you can find me exploring new
                    technologies, contributing to open-source projects, or
                    sharing my knowledge through technical writing and
                    mentoring.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Problem Solver
                    </span>
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      Team Player
                    </span>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Continuous Learner
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-6xl">👨‍💻</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">Skills & Expertise</h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 group"
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={skill.image}
                        alt={skill.name}
                        className="w-12 h-12 mb-3 object-contain group-hover:scale-110 transition-transform duration-200"
                        loading="lazy"
                      />
                      <span className="text-sm text-gray-700 text-center font-medium">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">
                  Professional Experience
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
              </div>
              <div className="space-y-8">
                {experiences.map((experience, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {experience.position}
                        </h3>
                        <h4 className="text-xl text-blue-600 font-medium mb-2">
                          {experience.company}
                        </h4>
                      </div>
                      <div className="text-gray-600 font-medium">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {experience.startDate} - {experience.endDate}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">
                        Key Responsibilities:
                      </h5>
                      <ul className="space-y-3">
                        {experience.responsibilities.map(
                          (responsibility, i) => (
                            <li key={i} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700 leading-relaxed">
                                {responsibility}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">Featured Projects</h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Code size={48} className="text-blue-600" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-4">
                        <a
                          href={project.github}
                          className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          <FaGithub size={20} />
                        </a>
                        <a
                          href={project.live}
                          className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          <ExternalLink size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Let's Work Together</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                I'm always interested in new opportunities and exciting
                projects. Let's discuss how we can bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="mailto:john@example.com"
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Send me an email
                </a>
                <a
                  href="#"
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Download CV
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex justify-center space-x-6 mb-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaGithub size={26} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaLinkedin size={26} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaXTwitter size={26} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Mail size={26} />
                </a>
              </div>
              <p className="text-gray-400">© 2025 John Developer</p>
            </div>
          </footer>

          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in {
              animation: fade-in 1s ease-out;
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default Portfolio;
