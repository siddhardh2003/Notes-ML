import React from 'react';
import './AboutUs.css'

const AboutUs = ({usename}) => {
  return (
    <div className="about-us-container">
      <h1 className="about-us-heading">About Us</h1>
      <div className="about-us-content">
        <p>
Welcome to Notes, your ultimate destination for organizing your thoughts, ideas, and tasks effortlessly. At Notes, our mission is to provide you with a seamless and intuitive notes app that simplifies your life and boosts your productivity.

With a focus on user experience and simplicity, Notes was created to be your reliable companion in managing your daily tasks, brainstorming ideas, and keeping track of important information. Whether you're a student, professional, or creative individual, our app is designed to adapt to your unique needs and help you stay organized and focused.

At Notes, we understand that life can be hectic, which is why we've crafted an app that is both powerful and easy to use. With features like categorization, tagging, searching, and synchronization across devices, you can effortlessly organize your notes and access them anytime, anywhere.

But Notes is more than just a notes app—it's a tool designed to empower you to achieve your goals and unlock your full potential. We're committed to constantly improving and evolving our app to better serve you and make your experience even more seamless and enjoyable.
        </p>

      </div>
    </div>
  );
};

export default AboutUs;
