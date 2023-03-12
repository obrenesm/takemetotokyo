import React, { useState, useEffect } from 'react'
import './Resume.scss';
import { CV } from './cv'

export function Resume(props) {

    document.getElementsByTagName('body')[0].classList.add('cv')
    
    const [scrollEquivalent, setScrollEquivalent] = useState(0);

    useEffect(() => {
        const handleScroll = (event) => {
        setScrollEquivalent(window.pageYOffset * 1);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

  return (
    <>
        <div id="resume">
            <div className='minimap'>
                <div className='box' style={ {top: scrollEquivalent} }></div>
                <CV/>
            </div>
            <div className='principal'>
               <CV/>
            </div>
        </div>
    </>
  )
}