import React from "react";

export function Section() {
  return (
    <section>
      <div className='popup intro visible'>
        <h1>Take me to <span>Tokyo</span></h1>
      </div>
      <div className='popup scroll visible'>
        <div className='mouse'>
          <div className='mouse-wheel'></div>
        </div>
        <h6>scroll down</h6>
        <div className='arrow'></div>
      </div>
    </section>
  );
}
