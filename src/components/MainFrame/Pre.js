import React from "react";

function Pre({ load }) {
  return (
    <div id={load ? "preloader" : "preloader-none"} role="status" aria-live="polite">
      <div
        className="preloader__inner"
        aria-hidden="true"
        key={load ? "preloader-on" : "preloader-off"}
      >
        <span className="preloader-logo" data-text="MAGICHERRY.">
          MAGICHERRY.
        </span>
        <span className="preloader-bar" aria-hidden="true" />
      </div>
    </div>
  );
}

export default Pre;
