import React from "react";
import Typewriter from "typewriter-effect";

function TypeWord() {
  return (
    <Typewriter
      options={{
        strings: [
          "Software Engineer",
          "Machine Learning Engineer",
          "Front-end Developer",
          "Back-end Developer",
          "Full-stack Developer",
            "Test Engineer",
            "Data Analysis",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default TypeWord;
