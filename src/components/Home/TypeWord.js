import React from "react";
import Typewriter from "typewriter-effect";

function TypeWord() {
  return (
    <Typewriter
      options={{
        strings: [
          "Software Developer",
          "Front-end Developer",
          "Back-end Developer",
            "Test Engineer",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default TypeWord;
