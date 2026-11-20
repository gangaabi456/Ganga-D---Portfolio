var CATS=["Frontend Development","Programming Languages","Frameworks and Libraries","Database","Tools and Technologies"];
var PAGES=["home","about","skills","projects","internships","certificates","education","contact"];
var SK=[["HTML5",0],["CSS3",0],["Tailwind CSS",0],["Bootstrap",0],["Python",1],["JavaScript (ES6+)",1],["React.js",2],["Django",2],["RESTful APIs",2],["MySQL",3],["SQLite",3],["Git",4],["GitHub",4],["Netlify",4],["Vercel",4]];
var SEED={edit:true,
   profile: {
      name: "Ganga D", role: "Full-Stack Developer",
      intro: "B.Sc. Computer Science graduate with hands-on frontend and backend project experience, building accessible, user-centered web applications.",
      photo: "images/profile.jpg",
      resume: "files/Ganga D-Resume.pdf",
      about: "I am a Computer Science graduate with a strong foundation in full-stack development, from React interfaces to Python and SQL back ends.",
      interests: "Python programming, scalable backend APIs, user-centered React interfaces, and AI-assisted software development.",
      goal: "To begin my career as a Software Developer where I can apply my Python, React.js, and backend skills to build accessible, user-centered applications and solve real-world problems.",
      journey: "Graduated in Computer Science (9.24 CGPA, 16th University Rank) and built practical expertise through a Python internship at Datheon, hands-on web projects, and AI/development certifications.",
      strengths: "Proficient in Python, React, and database systems, combining analytical problem-solving and detail-oriented execution with fast adaptability to modern AI tools.",
      email: "gangaabi456@gmail.com",
      phone: "+91 7094709801",
      location: "Chennai, Tamil Nadu",
      github: "https://github.com/gangaabi456",
      linkedin: "https://www.linkedin.com/in/ganga-d-655130323",
      endpoint: ""
   },
projects:[
   {
      id: "p1",
      title: "Online Learning Recommendations Web Platform",
      desc: "A single platform that brings together learning documents, videos and links for technology learners, built for accessibility and self-paced learning.",
      img: "images/pro1.png",
      tech: ["HTML", "CSS", "JavaScript", "Python", "SQLite"],
      features: ["Documents, videos and links in one place", "Easy to find and navigate", "Accessible, self-paced learning"],
      cat: "Web / Python",
      github: "https://github.com/gangaabi456/Online-Learning-Recommendations-Web-Platform.git",
      demo: "https://online-learning-recommendations-web.vercel.app/"
   },
   {
      id: "p2",
      title: "Belavita Perfume",
      desc: "A responsive HTML, Bootstrap Applications",
      img: "images/pro2.png",
      tech: ["HTML", "CSS", "Bootstrap"],
      features: ["A Responsive Website-Model for Belavita Perfume, OnLY Bootstrap and HTML Technologies were Used"],
      cat: "HTML,BOOTSTRAP",
      github: "https://github.com/gangaabi456/Belavita-perfume",
      demo: "https://belavita-perfume.netlify.app/"
   },
   {
      id: "p2",
      title: "HR Interview Questions",
      desc: "A responsive HTML,CSS and JS Application",
      img: "images/pro3.png",
      tech: ["HTML", "CSS", "Bootstrap", "JavaScript"],
      features: ["It helps freshers to prepare for their HR interviews"],
      cat: "HTML,BOOTSTRAP",
      github: "https://github.com/gangaabi456/HR-Interview-Questions",
      demo: "https://hr-interview-questions-omega.vercel.app/"
   },
],
   internships: [{
      id: "i1",
      company: "Datheon – AI Systems & Automation Studio",
      role: "Python Programming Intern",
      duration: "Four weeks, completed November 3, 2026",
      img: "images/certiciate1.png",
      desc: "",
      tech: ["Python"],
      details: ""
   }],
certificates:[
   {
      id: "c1",
      name: "AI Tools and ChatGPT Workshop",
      by: "B10X",
      date: "July 26, 2026",
      img: "images/certificate2.png",
      desc: "Verified."
   },
   {
      id: "c2",
      name: "Full Stack Development 30-Day Masterclass",
      by: "Novi Tech R&D Private Limited",
      date: "April 16 – May 21, 2026",
      img: "images/certificate3.png",
      desc: "verified"
   },
   {
      id: "c3",
      name: "Code Generation and Optimization using IBM Granite",
      by: "IBM SkillsBuild",
      date: "July 20, 2025",
      img: "images/certificate4.png",
      desc: "verified"
   },
   {
      id: "c4",
      name: "Web Development Fundamentals",
      by: "IBM SkillsBuild",
      date: "March 19, 2025",
      img: "images/certificate5.png",
      desc: "verified"
   },
   {
      id: "c5",
      name: "Object-Oriented Programming Using Python",
      by: "Infosys Springboard",
      date: "September 20, 2024",
      img: "images/certificate6.png",
      desc: "verified"
   },
   {
      id: "c1",
      name: "AI Tools and Claude Workshop",
      by: "B10X",
      date: "October 18, 2026",
      img: "images/certificate7.png",
      desc: "Verified."
   },
   {
      id: "c1",
      name: "HTML,CSS and JavaScript for Beginers",
      by: "IBM SkillsBuild-SLA Institute",
      date: "October 30, 2026",
      img: "images/certificate8.png",
      desc: "Verified."
   },

   ],

education:[{id:"e1",degree:"B.Sc. Computer Science",inst:"Meenakshi Ramasamy Arts and Science College, Thathanur",dept:"Computer Science",years:"2023–2026",desc:"CGPA 9.24. 16th rank at Bharathidasan University."}],
skills:SK.map(function(s,i){return{id:"s"+i,name:s[0],cat:CATS[s[1]]}})};
