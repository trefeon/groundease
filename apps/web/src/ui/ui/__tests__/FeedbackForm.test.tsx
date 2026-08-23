import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import FeedbackForm, { FEEDBACK_STORAGE_KEY } from "@/ui/ui/FeedbackForm";

const CATEGORY_NAMES = [
  "Kegunaan",
  "Tampilan",
  "Teknik",
  "Saran",
  "Bug",
  "Lainnya",
] as const;

/**
 * Under vitest, globalThis.localStorage is Node's experimental global
 * (undefined unless --localstorage-file is passed), shadowing jsdom's
 * implementation the component relies on. Back it with a Map instead.
 */
function stubStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function getCategoryGroup() {
  return screen.getByRole("group", { name: /kategori/i });
}

describe("FeedbackForm", () => {
  it("labels the rating and category clusters as groups via their visible prompts", () => {
    render(<FeedbackForm sourcePage="test-page" />);

    const ratingGroup = screen.getByRole("group", {
      name: /bagaimana pengalamanmu/i,
    });
    const ratingLabelId = ratingGroup.getAttribute("aria-labelledby");
    expect(ratingLabelId).toBeTruthy();
    expect(document.getElementById(ratingLabelId!)).toHaveTextContent(
      "Bagaimana pengalamanmu?",
    );

    const categoryGroup = getCategoryGroup();
    const categoryLabelId = categoryGroup.getAttribute("aria-labelledby");
    expect(categoryLabelId).toBeTruthy();
    expect(categoryLabelId).not.toBe(ratingLabelId);
    expect(document.getElementById(categoryLabelId!)).toHaveTextContent(
      "Kategori",
    );
  });

  it("exposes every category option with aria-pressed and moves the selection exclusively", async () => {
    const user = userEvent.setup();
    render(<FeedbackForm sourcePage="test-page" />);
    const group = getCategoryGroup();

    for (const name of CATEGORY_NAMES) {
      expect(within(group).getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }

    await user.click(within(group).getByRole("button", { name: "Bug" }));
    expect(within(group).getByRole("button", { name: "Bug" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    for (const name of CATEGORY_NAMES.filter((n) => n !== "Bug")) {
      expect(within(group).getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }

    await user.click(within(group).getByRole("button", { name: "Saran" }));
    expect(
      within(group).getByRole("button", { name: "Saran" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(within(group).getByRole("button", { name: "Bug" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("associates the optional message field with its visible label", async () => {
    const user = userEvent.setup();
    render(<FeedbackForm sourcePage="test-page" />);

    const message = screen.getByLabelText("Pesan (opsional)");
    expect(message.tagName).toBe("TEXTAREA");

    await user.type(message, "Sesi napasnya menenangkan.");
    expect(message).toHaveValue("Sesi napasnya menenangkan.");
  });

  it("keeps submission disabled until both a star rating and a category are chosen", async () => {
    const user = userEvent.setup();
    render(<FeedbackForm sourcePage="test-page" />);

    const submit = screen.getByRole("button", { name: /kirim masukan/i });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "4 bintang — Bagus" }));
    expect(await screen.findByText("Bagus")).toBeInTheDocument();
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Kegunaan" }));
    expect(submit).toBeEnabled();
  });

  it("posts the trimmed payload to /api/feedback and confirms success", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    stubStorage();

    render(<FeedbackForm sourcePage="feedback-page" onSubmitted={onSubmitted} />);

    await user.click(
      screen.getByRole("button", { name: "5 bintang — Sangat bagus" }),
    );
    await user.click(
      within(getCategoryGroup()).getByRole("button", { name: "Saran" }),
    );
    await user.type(
      screen.getByLabelText("Pesan (opsional)"),
      "  Aplikasinya membantu sekali  ",
    );
    await user.click(screen.getByRole("button", { name: /kirim masukan/i }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/feedback");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).toEqual({
      rating: 5,
      category: "saran",
      message: "Aplikasinya membantu sekali",
      sourcePage: "feedback-page",
    });

    expect(await screen.findByText(/Masukan berhasil dikirim/i)).toBeInTheDocument();
    expect(onSubmitted).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(FEEDBACK_STORAGE_KEY)).toBeTruthy();
  });

  it("keeps the form usable when the submission fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<FeedbackForm sourcePage="feedback-page" />);

    await user.click(screen.getByRole("button", { name: "2 bintang — Kurang" }));
    await user.click(screen.getByRole("button", { name: "Bug" }));
    await user.click(screen.getByRole("button", { name: /kirim masukan/i }));

    const submit = screen.getByRole("button", { name: /kirim masukan/i });
    await waitFor(() => expect(submit).toBeEnabled());
    expect(screen.queryByText(/Masukan berhasil dikirim/i)).not.toBeInTheDocument();

    // The same selection can be retried straight away.
    await user.click(submit);
    await waitFor(() =>
      expect(screen.queryByText(/Masukan berhasil dikirim/i)).not.toBeInTheDocument(),
    );
  });
});
