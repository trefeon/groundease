import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SomaticBodyScan, { bodyRegions } from "@/ui/ui/SomaticBodyScan";


/**
 * Region selector buttons carry a decorative initial-letter badge that source
 * does not mark aria-hidden, so their computed accessible name is e.g.
 * "RRahang & Wajah". Match on the region name itself via regex.
 */
function regionButton(name: string) {
  return screen.getByRole("button", { name: new RegExp(name) });
}
describe("SomaticBodyScan", () => {
  it("renders every body region as a pressed-toggle button", () => {
    render(<SomaticBodyScan />);

    for (const region of bodyRegions) {
      expect(
        regionButton(region.name),
      ).toHaveAttribute("aria-pressed");
    }
  });

  it("marks exactly one region as pressed and moves the press on selection", async () => {
    const user = userEvent.setup();
    render(<SomaticBodyScan />);

    // First region is preselected.
    const initiallySelected = bodyRegions[0];
    expect(
      regionButton(initiallySelected.name),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(regionButton("Perut & Solar Plexus"));
    for (const region of bodyRegions) {
      expect(
        regionButton(region.name),
      ).toHaveAttribute(
        "aria-pressed",
        region.id === "stomach-solar" ? "true" : "false",
      );
    }

    await user.click(regionButton("Rahang & Wajah"));
    expect(
      regionButton("Rahang & Wajah"),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      regionButton("Perut & Solar Plexus"),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("shows the somatic guidance belonging to the chosen region", async () => {
    const user = userEvent.setup();
    render(<SomaticBodyScan />);

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: bodyRegions[0].name,
      }),
    ).toBeInTheDocument();

    await user.click(regionButton("Tangan & Kaki"));
    expect(
      await screen.findByRole("heading", { level: 4, name: "Tangan & Kaki" }),
    ).toBeInTheDocument();
  });

  it("toggles and untoggles the relaxed marker for the selected area", async () => {
    const user = userEvent.setup();
    render(<SomaticBodyScan />);

    const markButton = screen.getByRole("button", {
      name: "Tandai Area Ini Rileks",
    });
    await user.click(markButton);
    expect(
      await screen.findByRole("button", { name: "Sudah Dirilekskan ✓" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sudah Dirilekskan ✓" }));
    expect(
      await screen.findByRole("button", { name: "Tandai Area Ini Rileks" }),
    ).toBeInTheDocument();
  });
});

