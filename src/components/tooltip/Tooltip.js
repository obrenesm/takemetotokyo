import React from "react";
import "./Tooltip.scss";

export const Tooltip = (props) => {

  return (
    <span
      className="tooltip"
      data-tooltip={props.content}
    >
      {props.children}<sup>?</sup>&nbsp;
    </span>
  );
};