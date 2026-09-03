import { PropsWithChildren, useEffect, useState } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const professions = [
  "Software & Automation Engineer",
  "Engineering, Web, Data & AI",
  "Revit API & Excel VSTO Developer",
  "Full-Stack Web Developer",
  "AI & Machine Learning Developer"
];

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % professions.length);
        setFadeState("fade-in");
      }, 350);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {' '}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
          </div>
          <div className="landing-info">
            <h3>A</h3>
            <h2 className="landing-info-h2">
              <div className={`profession-text ${fadeState}`}>
                {professions[currentIndex]}
              </div>
            </h2>
          </div>
          {/* Mobile photo - shows on mobile when 3D character is hidden */}
          <div className="mobile-photo">
            <img
              src="/images/mypicnbg.png"
              alt={config.developer.fullName}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
