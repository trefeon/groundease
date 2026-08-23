import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SudGauge from "@/ui/ui/SudGauge";
const SCORE_NAMES = Array.from({ length: 11 }, (_, n) => `Pilih skor ${n}`);

/** Mirrors real usage: the parent owns the SUD score state. */
function SudGaugeHarness({ initialScore = 0 }: { initialScore?: number }) {
  const [score, setScore] = useState(initialScore);
  return <SudGauge score={score} onChange={setScore} showClinicalInfo={false} />;
}

describe("SudGauge", () => {
  it("offers eleven quick-pick buttons named 'Pilih skor N'", () => {
    render(<SudGauge score={0} onChange={() => {}} showClinicalInfo={false} />);

    for (const name of SCORE_NAMES) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("marks exactly the current score as pressed", () => {
    render(<SudGauge score={3} onChange={() => {}} showClinicalInfo={false} />);

    SCORE_NAMES.forEach((name, n) => {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        n === 3 ? "true" : "false",
      );
    });
  });

  it("reports quick-pick clicks upward through onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SudGauge score={0} onChange={onChange} showClinicalInfo={false} />);

    await user.click(screen.getByRole("button", { name: "Pilih skor 7" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it("moves pressed exclusively to the clicked score through real state flow", async () => {
    const user = userEvent.setup();
    render(<SudGaugeHarness initialScore={0} />);

    await user.click(screen.getByRole("button", { name: "Pilih skor 8" }));

    SCORE_NAMES.forEach((name, n) => {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        n === 8 ? "true" : "false",
      );
    });
  });
});
