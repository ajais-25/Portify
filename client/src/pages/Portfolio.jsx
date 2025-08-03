import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Mail, ExternalLink, Code, Globe } from "lucide-react";
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

      console.log(response.data.data);
      setPortfolioData(response.data.data);
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
  }, [username]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = [
        "home",
        "about",
        "skills",
        ...(portfolioData?.experience && portfolioData.experience.length > 0
          ? ["experience"]
          : []),
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
  }, [portfolioData]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

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
                    ...(portfolioData.experience &&
                    portfolioData.experience.length > 0
                      ? ["Experience"]
                      : []),
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
                  {portfolioData.name}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  {portfolioData.tagline}
                </p>
                <div className="flex justify-center space-x-6 mb-12">
                  {portfolioData.socialLinks?.github && (
                    <Link
                      to={portfolioData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FaGithub size={26} />
                    </Link>
                  )}
                  {portfolioData.socialLinks?.linkedin && (
                    <Link
                      to={portfolioData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FaLinkedin size={26} />
                    </Link>
                  )}
                  {portfolioData.socialLinks?.twitter && (
                    <Link
                      to={portfolioData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FaXTwitter size={26} />
                    </Link>
                  )}
                  {portfolioData.socialLinks?.website && (
                    <Link
                      to={portfolioData.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Globe size={26} />
                    </Link>
                  )}
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
                  <h3 className="text-2xl font-semibold mb-4">
                    Hi, I'm {portfolioData.name.split(" ")[0]}
                  </h3>
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
                {portfolioData.skills.map((skill, index) => (
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
          {portfolioData.experience && portfolioData.experience.length > 0 && (
            <section
              id="experience"
              className="py-20 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
            >
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
              </div>

              <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-20">
                  <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Professional Journey
                  </h2>
                  <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    My career path and the experiences that shaped my
                    professional growth
                  </p>
                </div>

                {/* Timeline Layout */}
                <div className="relative">
                  {/* Timeline line */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-indigo-600 rounded-full hidden lg:block"
                    style={{
                      height: `${portfolioData.experience.length * 320 - 80}px`,
                    }}
                  ></div>

                  {/* Mobile timeline line */}
                  <div
                    className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-500 to-indigo-600 rounded-full lg:hidden"
                    style={{
                      height: `${portfolioData.experience.length * 280 - 40}px`,
                    }}
                  ></div>

                  <div className="space-y-16 lg:space-y-20">
                    {portfolioData.experience.map((experience, index) => (
                      <div
                        key={index}
                        className={`relative flex items-center ${
                          index % 2 === 0
                            ? "lg:flex-row"
                            : "lg:flex-row-reverse"
                        } flex-col lg:gap-16`}
                        style={{
                          animationDelay: `${index * 200}ms`,
                          animation: "slideInFromSide 0.8s ease-out forwards",
                          opacity: 0,
                        }}
                      >
                        {/* Timeline node */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
                          <div className="w-6 h-6 bg-white rounded-full border-4 border-blue-500 shadow-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-0.5"></div>
                          </div>
                          {/* Timeline pulse effect */}
                          <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                        </div>

                        {/* Mobile timeline node */}
                        <div className="absolute left-8 transform -translate-x-1/2 z-20 lg:hidden">
                          <div className="w-4 h-4 bg-white rounded-full border-3 border-blue-500 shadow-lg">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-0.5"></div>
                          </div>
                        </div>

                        {/* Experience Card */}
                        <div
                          className={`w-full lg:w-5/12 ml-16 lg:ml-0 ${
                            index % 2 === 0 ? "lg:mr-auto" : "lg:ml-auto"
                          }`}
                        >
                          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 overflow-hidden">
                            {/* Card header with gradient */}
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                              <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                                  <div className="flex-1">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                                      {experience.position}
                                    </h3>
                                    <h4 className="text-lg sm:text-xl font-medium opacity-90 flex items-center">
                                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                                      {experience.company}
                                    </h4>
                                  </div>
                                  <div className="mt-4 sm:mt-0 sm:ml-4">
                                    <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                                      {experience.startDate} -{" "}
                                      {experience.endDate &&
                                      experience.endDate.toLowerCase() !==
                                        "present" &&
                                      experience.endDate.toLowerCase() !==
                                        "current" ? (
                                        experience.endDate
                                      ) : (
                                        <span className="font-semibold text-green-200">
                                          Present
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                            </div>

                            {/* Card body */}
                            <div className="p-6 sm:p-8">
                              {/* Experience description */}
                              {experience.description && (
                                <div className="mb-6">
                                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base italic border-l-4 border-blue-200 pl-4 bg-blue-50/50 py-3 rounded-r-lg">
                                    "{experience.description}"
                                  </p>
                                </div>
                              )}

                              {/* Key Achievements/Responsibilities */}
                              <div className="mb-6">
                                <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  Key Achievements & Responsibilities
                                </h5>
                                <ul className="space-y-3">
                                  {experience.responsibilities.map(
                                    (responsibility, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start group/item hover:bg-blue-50/50 p-2 rounded-lg transition-colors duration-200"
                                        style={{
                                          animationDelay: `${
                                            index * 200 + i * 100
                                          }ms`,
                                          animation:
                                            "fadeInUp 0.6s ease-out forwards",
                                          opacity: 0,
                                        }}
                                      >
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2.5 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                                        <span className="text-gray-700 leading-relaxed text-sm sm:text-base group-hover/item:text-gray-900 transition-colors duration-200">
                                          {responsibility}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>

                              {/* Technologies/Skills used */}
                              {experience.technologies &&
                                experience.technologies.length > 0 && (
                                  <div className="mb-4">
                                    <h6 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                      Technologies Used
                                    </h6>
                                    <div className="flex flex-wrap gap-2">
                                      {experience.technologies.map(
                                        (tech, i) => (
                                          <span
                                            key={i}
                                            className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200 rounded-full text-xs font-medium hover:from-orange-100 hover:to-red-100 transition-all duration-200 cursor-default transform hover:scale-105"
                                          >
                                            {tech}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Experience metrics/achievements */}
                              {experience.metrics &&
                                experience.metrics.length > 0 && (
                                  <div className="border-t border-gray-100 pt-4">
                                    <h6 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                      Key Metrics & Impact
                                    </h6>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {experience.metrics.map((metric, i) => (
                                        <div
                                          key={i}
                                          className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
                                        >
                                          <div className="text-lg font-bold text-green-700">
                                            {metric.value}
                                          </div>
                                          <div className="text-xs text-green-600">
                                            {metric.label}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Connecting line for better visual flow */}
                        <div
                          className={`hidden lg:block w-6 border-t-2 border-dashed border-blue-300 ${
                            index % 2 === 0 ? "order-last" : "order-first"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>

                  {/* Timeline end marker */}
                  <div className="flex justify-center mt-16">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Projects Section */}
          <section
            id="projects"
            className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                {portfolioData.projects.map((project, index) => (
                  <div
                    key={index}
                    className="project-card relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "slideUp 0.6s ease-out forwards",
                    }}
                  >
                    {/* Project Image Container */}
                    <div className="h-56 relative overflow-hidden rounded-t-2xl group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {project.imageURL ? (
                        <img
                          src={project.imageURL}
                          alt={project.title}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.classList.add(
                              "bg-gradient-to-br",
                              "from-blue-100",
                              "via-purple-50",
                              "to-indigo-100",
                              "flex",
                              "items-center",
                              "justify-center"
                            );
                            const fallbackDiv = document.createElement("div");
                            fallbackDiv.className =
                              "flex flex-col items-center justify-center text-center p-8";
                            fallbackDiv.innerHTML = `
                              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <svg class="text-white" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <polyline points="16,18 22,12 16,6"/>
                                  <polyline points="8,6 2,12 8,18"/>
                                </svg>
                              </div>
                              <p class="text-blue-600 font-medium text-sm">Project Preview</p>
                            `;
                            e.target.parentElement.appendChild(fallbackDiv);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <Code size={32} className="text-white" />
                          </div>
                          <p className="text-blue-600 font-medium text-sm">
                            Project Preview
                          </p>
                        </div>
                      )}

                      {/* Floating Action Buttons */}
                      <div className="absolute top-4 right-4 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Link
                          to={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                        >
                          <FaGithub size={18} />
                        </Link>
                        {project.liveLink && (
                          <Link
                            to={project.liveLink || project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-green-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6 lg:p-7">
                      <div className="mb-4">
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 project-card:hover:text-blue-600 transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm lg:text-base leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Key Features */}
                      {project.keyFeatures &&
                        project.keyFeatures.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                              Key Features
                            </h4>
                            <ul className="space-y-1.5">
                              {project.keyFeatures
                                .slice(0, 3)
                                .map((feature, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start text-sm text-gray-600"
                                  >
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    <span className="leading-relaxed">
                                      {feature}
                                    </span>
                                  </li>
                                ))}
                              {project.keyFeatures.length > 3 && (
                                <li className="text-xs text-blue-600 font-medium ml-3.5">
                                  +{project.keyFeatures.length - 3} more
                                  features
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                      {/* Tech Stack */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologiesUsed
                            .slice(0, 3)
                            .map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 cursor-default"
                              >
                                {tech.name || tech}
                              </span>
                            ))}
                          {project.technologiesUsed.length > 3 && (
                            <div className="relative">
                              <span className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-200 flex items-center space-x-1 tech-stack-group">
                                <span>
                                  +{project.technologiesUsed.length - 3}
                                </span>

                                {/* Tooltip for remaining tech stack */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 transition-opacity duration-200 pointer-events-none z-30 tooltip-content">
                                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg">
                                    <div className="flex flex-wrap gap-1 max-w-48">
                                      {project.technologiesUsed
                                        .slice(3)
                                        .map((tech, i) => (
                                          <span
                                            key={i}
                                            className="bg-gray-700 px-2 py-1 rounded text-xs"
                                          >
                                            {tech.name || tech}
                                          </span>
                                        ))}
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Link
                          to={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
                        >
                          <FaGithub
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform duration-200"
                          />
                          <span>Code</span>
                        </Link>
                        {project.liveLink && (
                          <Link
                            to={project.liveLink || project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 group/btn shadow-lg hover:shadow-xl"
                          >
                            <ExternalLink
                              size={14}
                              className="group-hover/btn:scale-110 transition-transform duration-200"
                            />
                            <span>Live Demo</span>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
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
                <button
                  onClick={() =>
                    window.open(
                      `https://mail.google.com/mail/?view=cm&fs=1&to=${
                        portfolioData.email
                      }&su=Portfolio Inquiry&body=Hello ${
                        portfolioData.name.split(" ")[0]
                      }, I found your portfolio and would like to discuss...`,
                      "_blank"
                    )
                  }
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Send me an email
                </button>
                <Link
                  to={portfolioData.resume}
                  target="_blank"
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  View Resume
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex justify-center space-x-6 mb-6">
                {portfolioData.socialLinks?.github && (
                  <Link
                    to={portfolioData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FaGithub size={26} />
                  </Link>
                )}
                {portfolioData.socialLinks?.linkedin && (
                  <Link
                    to={portfolioData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FaLinkedin size={26} />
                  </Link>
                )}
                {portfolioData.socialLinks?.twitter && (
                  <Link
                    to={portfolioData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FaXTwitter size={26} />
                  </Link>
                )}
                {portfolioData.socialLinks?.website && (
                  <Link
                    to={portfolioData.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Globe size={26} />
                  </Link>
                )}
                <button
                  onClick={() =>
                    window.open(
                      `https://mail.google.com/mail/?view=cm&fs=1&to=${
                        portfolioData.email
                      }&su=Portfolio Inquiry&body=Hello ${
                        portfolioData.name.split(" ")[0]
                      }, I found your portfolio and would like to discuss...`,
                      "_blank"
                    )
                  }
                  className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                >
                  <Mail size={26} />
                </button>
              </div>
              <p className="text-gray-400">© 2025 {portfolioData.name}</p>
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
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes slideInFromSide {
              from {
                opacity: 0;
                transform: translateX(-50px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes blob {
              0% {
                transform: translate(0px, 0px) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
              100% {
                transform: translate(0px, 0px) scale(1);
              }
            }
            .animate-fade-in {
              animation: fade-in 1s ease-out;
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
            .line-clamp-3 {
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .tech-stack-group:hover .tooltip-content {
              opacity: 1;
            }
            .project-card:hover h3 {
              color: rgb(37 99 235);
            }
            .border-3 {
              border-width: 3px;
            }
            /* Custom scrollbar for better experience */
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #f1f5f9;
            }
            ::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
              border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #2563eb, #7c3aed);
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default Portfolio;
