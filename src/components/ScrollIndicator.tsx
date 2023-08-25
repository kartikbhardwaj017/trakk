import React, { useEffect, useState } from "react";

interface ScrollIndicatorProps {
  parentId: string;
}

function ScrollIndicator({ parentId }: ScrollIndicatorProps) {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const scroll = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollPercentage(scroll);
    };

    // Use the passed parentId prop to attach the event listener
    const container = document.querySelector(`#${parentId}`);
    container?.addEventListener("scroll", handleScroll);

    // Cleanup listener on unmount
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [parentId]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${scrollPercentage}%`,
        height: "5px",
        backgroundColor: "white",
        zIndex: 1000,
      }}
    />
  );
}

export default React.memo(ScrollIndicator);
