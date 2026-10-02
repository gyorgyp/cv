// All CV content lives here, separate from markup (CV.jsx) and styling (CV.css).
// Edit this file to update the CV text without touching layout or styles.

export const cvData = {
  name: "Péter GYÖRGY",
  title: "DevOps | Software Engineer",
  contact: {
    email: "gyorgyp@gmail.com",
    linkedin: "hu.linkedin.com/in/gyorgyp/",
    linkedinUrl: "https://hu.linkedin.com/in/gyorgyp/",
    github: "github.com/gyorgyp/",
    githubUrl: "https://github.com/gyorgyp/",
  },

  profile:
    "5+ years in Reliability & Operations-focused DevOps and 15+ years in Software Development. Caring about the details as much as the big picture - a stable system is built on both. Additional strengths: analytical thinking, brainstorming, problem-solving, root cause analysis, multitasking and structured task handling, caring about the details as the big picture - built over two decades of cross-team, cross-country collaboration.",

  nav: [
    { id: "profile", label: "Profile" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
  ],

  coreSkills: [
    "Tulip (MES / no-code / low-code)",
    "Azure DevOps (Cloud & Server), CI/CD",
    "Icinga, Ansible, PowerShell, Git, Bash",
    "C#, .NET / .NET Core, MSSQL",
    "ASP.NET (Web Forms, MVC), Blazor",
    "Scrum / Agile",
  ],

  currentlyLearning: [
    "Python",
    "Docker",
    "Kubernetes",    
    "Azure Cloud",
    "AWS",
    "Linux (Ubuntu)",
  ],

  languages: [
    { name: "Hungarian", level: "Native" },
    { name: "English", level: "B2 (upper-intermediate)" },
  ],

  additionalStrengths:
    "Additional strengths: analytical thinking, brainstorming, problem-solving, root cause analysis, multitasking and structured task handling, caring about the details as the big picture - built over a decade of cross-team, cross-country collaboration.",

  experience: [
    {
      role: "Software Developer",
      company: "Prysprove Kft.",
      period: "2025 – 2026",
      bullets: [
        "Automated the Tulip apps built-in version-update mechanism and refactored core application logic, eliminating the need for routine on-site client visits for device updates",
        "Integrated standalone modules into a unified system, significantly improving user experience (UX) and accelerating workflow efficiency",
        "Maintained direct contact with clients on-site during critical deployment phases, ensuring smooth systems integration and immediate troubleshooting",
        "Adopted Tulip's functions to write and standardize custom logic",
        "Refactoring data queries for dramatically faster performance",
        "Optimized legacy logic within existing applications, achieving an 80% improvement in execution speed",
        "Established the team's naming convention standard for Tulip applications, ensuring 100% clarity and zero ambiguity across all variables",
        "Built a dedicated client request, resulting in direct positive feedback",
        "Contributed to cloud-ready web app by developing Blazor WebAssembly and REST APIs",
      ],
      tech: "Tulip (MES / no-code / low code), C#, Blazor, Microservices, REST API, GitHub, Lucid, Jira, Confluence",             
    },
    {
      role: "DevOps Engineer",
      company: "evosoft Hungary Kft.",
      period: "2017 – 2025",
      bullets: [
        { text: "Build Management Service Engineer (4y)",
          subBullets: [ "Managed and configured on-premises Virtual Machines",
                        "Monitored system infrastructure using Icinga",
                        "Handled demand management processes",
                        "Collaborated with users, customers and stakeholders to resolve technical issues",
                        "Participated daily standups within cross-country teams (Germany, Portugal) and supported technical colleagues in India",
                        "Migrated CI/CD pipelines from XAML to vNext",
                        "Troubleshot and investigated root causes within Azure DevOps Server CI/CD pipelines"] },
        { text: "Automation (1y): HTML based tool - TFS (Rest API) synchronization",
          subBullets: [ "Collected IIS settings of all Application Tiers and automatically published daily as an Excel report",
                        "Developed a new automated tool for project creation of Azure DevOps Server 2019 (in a small team)",
                        "Automated the internal daily work hours booking tool synchronization with TFS"] },
        { text: "Chatbot development (1y) with a cross-country team using LUIS and Azure Bot Services", subBullets: [] },
        { text: "Migrated CI/CD pipelines from XAML to vNext (1y)", subBullets: [] },
        { text: "Visual Studio extension developer (1y): extended Siemens-specific tooling (C#, WPF, design patterns)", subBullets: [] },
      ],
      tech: "Ansible, VMware, Icinga, PowerShell, Azure DevOps Server, LUIS, TypeScript, Azure Bot Services",
    },
    {
      role: "Full-Stack / Senior .NET Developer",
      company: "SDA Stúdió Kft.",
      period: "2004 – 2017",
      bullets: [
        "13 years across the Neptun.NET ecosystem (Hungary's unified educational system): web platform optimization, a mobile companion app, a middleware layer and supporting tools",
        "Delivered a full project-lifecycle management web application end-to-end for an external client",
        "Built a Html2Pdf conversion tool with automated installer and a Microsoft software download portal",
      ],
      tech: "ASP.NET Web Forms/MVC 3, MSSQL, custom Entity Framework, jQuery, Ajax, Windows Forms, Android, WP, Xamarin, Windows InstallShield, Infragistics, MS Project, Delphi",
    },
    {
      role: "Junior .NET Developer",
      company: "Ecobit Kft.",
      period: "2001 – 2004",
      bullets: [
        "Full-stack development on an ERP system: Windows Forms front end, MSSQL back end and stored procedures",
      ],
      tech: "Windows Forms, MSSQL, Enterprise Architect",
    },
  ],

  education: [
    {
      school: "BME, GTK",
      degree: "Bankinformatics, Expert-Engineer in Informatics of Banking Business",
      period: "2002 – 2007",
    },
    {
      school: "BME, VIK",
      degree: "M.Sc. Electrical Engineering",
      period: "1996 – 2003",
    },
  ],

  certifications: [
    { name: "Tulip Interfaces - Basic App Building", year: "2026" },
    { name: "ITIL 4 Foundation", year: "2023" },
    { name: "Ansible Basics", year: "2022" },
    { name: "MS Azure Workshop", year: "2019" },
    { name: "PowerShell Advanced", year: "2019" },
  ],

  training: [
    { name: "Docker, Kubernetes, Ansible (LinkedIn courses)", year: "2025" },
    { name: "Azure Cloud course", year: "2025" },
    { name: "AWS workshop", year: "2025" },
    { name: "Python course", year: "2025" },
  ],
};