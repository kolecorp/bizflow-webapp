import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";

export type TourStep = {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  };
};

export function startTour(steps: TourStep[]) {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    smoothScroll: true,
    allowClose: true,
    steps: steps,
  });

  driverObj.drive();
}
