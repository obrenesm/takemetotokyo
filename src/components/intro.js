import React from "react";

export function Intro() {
  return (
    <section className="intro visible">
      <div className='popup center headline'>
        <h1>Take me to <span>Tokyo</span></h1>
      </div>
      <div className='popup center scroll'>
        <div className='mouse'>
          <div className='mouse-wheel'></div>
        </div>
        <h6>scroll down</h6>
        <div className='arrow'></div>
      </div>
    </section>
  );
}
