import { useState } from "react";
import "./styles/WhatIDo.css";
import { config } from "../config";
import { MdKeyboardArrowDown } from "react-icons/md";

const WhatIDo = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="what-title">
          <span className="what-title-top">WHAT</span>
          <span className="what-title-bottom">I <span className="do-h2">DO</span></span>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%" height="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>

          {config.skills.map((skill, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                className={`what-content ${isActive ? "what-content-active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <div className="what-border1">
                  <svg height="100%" width="100%">
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                    />
                    <line
                      x1="0"
                      y1="100%"
                      x2="100%"
                      y2="100%"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                    />
                  </svg>
                </div>
                <div className="what-corner"></div>

                <div className="what-content-in">
                  <div className="what-header-row">
                    <h3>{skill.title}</h3>
                    <MdKeyboardArrowDown className={`what-arrow-icon ${isActive ? "arrow-rotate" : ""}`} />
                  </div>
                  
                  <div className="what-details-wrap">
                    <h4>{skill.description}</h4>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
