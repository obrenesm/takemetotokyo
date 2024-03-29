import React from 'react'
import { Tooltip } from '../../components/tooltip/Tooltip'

export function CV() {

  return (
    <>
        <div className='curriculum'>
            <section>
                <h3>Work Experience</h3>
                <div>
                    <h4>CTO</h4>
                    <h5>Buzz</h5>
                    <h6>2023-today</h6>
                </div>
                <div>
                    <h4>Frontend Developer</h4>
                    <h5><Tooltip content="Previously known as Hangar, latter Hangar Worldwide, and recently fully integrated as part of Critical Mass" direction="down">Critical Mass</Tooltip>for BMW USA</h5>
                    <h6>2021-2023</h6>
                </div>
                <div>
                    <h4>Content Developer</h4>
                    <h5>Critical Mass for BMW USA</h5>
                    <h6>2019-2020</h6>
                </div>
                <div>
                    <h4>Production Designer</h4>
                    <h5>Critical Mass for GoDaddy</h5>
                    <h6>2016-2018</h6>
                </div>
                <div>
                    <h4>Founder and Sport Manager</h4>
                    <h5>Clean Cycling</h5>
                    <h6>2014-2017</h6>
                </div>
                <div>
                    <h4>Freelance Web & Graphic Designer</h4>
                    <h6>2011-2015</h6>
                </div>
            </section>
            <section>
                <h3>Education</h3>
                <div>
                    <h4>Superior Degree in Sports Management</h4>
                    <h5>TEC</h5>
                    <h6>2014-2015</h6>
                </div>
                <div>
                    <h4>Superior Degree in Web Design and Development</h4>
                    <h5>U Creativa</h5>
                    <h6>2011-2013</h6>
                </div>
                <div>
                    <h4>Associate Degree in Graphic Design</h4>
                    <h5>COVAO</h5>
                    <h6>2008-2010</h6>
                </div>
            </section>
            <section>
                <h3>Courses</h3>
                <div>
                    <h4>React JS</h4>
                    <h5>Scrimba</h5>
                    <h6>2022</h6>
                </div>
                <div>
                    <h4>Responsive Web Design Fundamentals</h4>
                    <h4>HTML and CSS Responsive Images</h4>
                    <h4>Java Script</h4>
                    <h5>Udacity</h5>
                    <h6>2017</h6>
                </div>
                <div>
                    <h4>Digital Marketing</h4>
                    <h4>Vanilla Java Script</h4>
                    <h4>User Experience</h4>
                    <h5>La 404</h5>
                    <h6>2015</h6>
                </div>
                <div>
                    <h4>Level 1 UCI Cycling Coaching</h4>
                    <h5>UCI</h5>
                    <h6>2012</h6>
                </div>
            </section>
        </div>
    </>
  )
}