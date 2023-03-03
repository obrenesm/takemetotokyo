import React, { useState } from "react";
import "./Tooltip.scss";

export const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <span
      className="Tooltip-Wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      &nbsp;{props.children}<sup>?</sup>&nbsp;
      
      {active && (
        <span className={`Tooltip-Tip ${props.direction || "top"}`}>
          <span>{props.content}</span>
        </span>
      )}
    </span>
  );
};