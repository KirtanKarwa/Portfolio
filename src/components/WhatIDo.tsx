import { useState } from "react";
import "./styles/WhatIDo.css";
import { config } from "../config";
import { MdKeyboardArrowDown } from "react-icons/md";

const WhatIDo = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  return (
    <div className="whatIDO" id="whatIDO">
      <div className="what-box">
        <h2 className="what-title">
          <span className="what-title-top">WHAT</span>
          <span className="what-title-bottom">I <span className="do-h2">DO</span></span>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-accordion-container">
          {config.skills.map((skill, index) => {
            const isActive = hoveredIndex === index;
            return (
              <div
                key={skill.id || index}
                className={`what-accordion-item ${isActive ? "active" : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(isActive ? null : index)}
              >
                <div className="what-accordion-header">
                  <h3>{skill.title}</h3>
                  <div className={`what-arrow-icon ${isActive ? "open" : ""}`}>
                    <MdKeyboardArrowDown />
                  </div>
                </div>

                <div className="what-accordion-body">
                  <h4>{skill.subtitle}</h4>
                  <p>{skill.details}</p>
                  <h5>Skillset & tools</h5>
                  <div className="what-content-flex">
                    {skill.tools.map((tool, tIndex) => (
                      <div key={tIndex} className="what-tags">
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
