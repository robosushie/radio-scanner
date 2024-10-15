// plotly.d.ts
import "plotly.js";

declare module "plotly.js" {
  interface ColorBar {
    orientation?: "h" | "v";
  }
}
