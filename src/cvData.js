// All CV content lives here, separate from markup (CV.jsx) and styling (CV.css).
// Edit this file to update the CV text without touching layout or styles.

export const cvData = {
  name: "GYöRGY Péter",
  title: "Software Developer",
  contact: {
    phone: "+36-70-507-6193",
    phoneHref: "tel:+36705076193",
    email: "gyorgyp@gmail.com",
    linkedin: "hu.linkedin.com/in/gyorgyp/",
    linkedinUrl: "https://hu.linkedin.com/in/gyorgyp/",
  },

  profile:
    "15+ years in Operation focus DevOps and Software Development. Currently deepening Docker, Kubernetes, Ansible, Python, Git and Cloud. I enjoy hybrid work.",

  nav: [
    { id: "profile", label: "Profile" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
   /* { id: "education", label: "Education" }, 
    { id: "certifications", label: "Certifications" },*/
  ],

  coreSkills: [
    "Tulip (MES)",
    "Azure DevOps (Cloud/Server), CI/CD",
    "Icinga, Ansible, PowerShell, Bash",
    "Git, GitHub, GitHub Copilot, Claude, ChatGPT",
    "C#, .NET / .NET Core, MSSQL",
    "ASP.NET (Web Forms, MVC), Blazor",
    "Scrum / Agile",
  ],

  currentlyLearning: [
    "Docker, Kubernetes, Python",
    "Azure Cloud, AWS",
    "Linux (Ubuntu)",
  ],

  languages: [
    { name: "Hungarian", level: "Native" },
    { name: "English", level: "B2 (upper-intermediate)" },
  ],

  additionalStrengths:
    "Analytical thinking, brainstorming, problem-solving, multitasking and structured task handling — built over a decade of cross-team, cross-country collaboration.",

  experience: [
    {
      role: "Software Developer",
      company: "Prysprove Kft.",
      period: "2025 – 2026",
      bullets: [
        "Built automated app version-update logic and refactored app logic for good working",
        "Integrated standalone modules and contributed to web app design on Blazor / Microservices",
        "Maintained direct contact with clients",
        "Adopted Tulip's Functions feature to extend app logic",
        "Queried and filtered data via aggregations for faster performance",
        "Sped up legacy logic within existing apps by 80%",
        "Established the team's naming convention standard for Tulip apps",
        "Built a custom query for a specific client request, earning positive client feedback",
      ],
      tech: "Tulip (MES/no-code/low code manufacturing platform), C#, Blazor, Microservices, REST API Development, GitHub, Lucid, Jira, Confluence",
    },
    {
      role: "DevOps Engineer",
      company: "evosoft Hungary Kft.",
      period: "2017 – 2025",
      bullets: [
        "Build Management Service Engineer (4y)",
        "Automation (1y): HTML based tool - TFS (Rest API) synchronization",
        "Chatbot development (1y) with a cross-country team using LUIS and Azure Bot Services",
        "Migrated CI/CD pipelines from XAML to vNext (1y)",
        "Visual Studio extension developer (1y): extended Siemens-specific tooling (C#, WPF, design patterns)",
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