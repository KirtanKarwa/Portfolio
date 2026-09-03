import React from "react";
import "./styles/ResumeDeskModal.css";
import { config } from "../config";
import { FaArrowLeft, FaDownload, FaEnvelope, FaGithub, FaMapMarkerAlt } from "react-icons/fa";

interface ResumeDeskModalProps {
  onClose: () => void;
}

const ResumeDeskModal: React.FC<ResumeDeskModalProps> = ({ onClose }) => {
  return (
    <>
      {/* Top Header Controls */}
      <div className="resume-top-bar">
        <button className="resume-back-btn" onClick={onClose} data-cursor="disable">
          <FaArrowLeft /> Back to Main Page
        </button>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="resume-download-btn"
          data-cursor="disable"
        >
          <FaDownload /> Download Resume (PDF)
        </a>
      </div>

      {/* Desk Resume Document Sheet */}
      <div className="resume-desk-sheet">
        <div className="resume-sheet-header">
          <h1>{config.developer.fullName.toUpperCase()}</h1>
          <h2>{config.developer.title}</h2>
          <p>
            <FaMapMarkerAlt /> {config.social.location} &nbsp;|&nbsp;{" "}
            <FaEnvelope /> {config.contact.email} &nbsp;|&nbsp;{" "}
            <FaGithub /> github.com/{config.social.github}
          </p>
        </div>

        <div className="resume-section-title">Professional Summary</div>
        <p style={{ fontSize: "12px", lineHeight: "17px", color: "rgba(255, 255, 255, 0.85)" }}>
          {config.about.description}
        </p>

        <div className="resume-section-title">Experience</div>
        {config.experiences.map((exp, index) => (
          <div className="resume-item" key={index}>
            <div className="resume-item-title">
              <h3>{exp.position}</h3>
              <span>{exp.period}</span>
            </div>
            <div className="resume-item-sub">{exp.company} — {exp.location}</div>
            <p>{exp.description}</p>
          </div>
        ))}

        <div className="resume-section-title">Featured Projects</div>
        {config.projects.slice(0, 4).map((proj) => (
          <div className="resume-item" key={proj.id}>
            <div className="resume-item-title">
              <h3>{proj.title}</h3>
              <span>{proj.type}</span>
            </div>
            <div className="resume-item-sub">{proj.subtitle}</div>
            <p>{proj.description}</p>
          </div>
        ))}

        <div className="resume-section-title">Core Skills</div>
        <div className="resume-skills-grid">
          {["C#", ".NET", "Revit API", "Python", "React", "TypeScript", "SQL", "Excel VSTO", "FastAPI", "Power BI", "Three.js", "Docker", "Git"].map(
            (skill, idx) => (
              <span className="resume-skill-tag" key={idx}>
                {skill}
              </span>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeDeskModal;
