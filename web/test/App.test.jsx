import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App.jsx";
import { getCurrentEmployee, SessionError } from "../src/lib/api.js";
import { LANGUAGE_STORAGE_KEY } from "../src/lib/language.js";

const clerk = vi.hoisted(() => ({
  auth: {
    isLoaded: true,
    isSignedIn: false,
    userId: null,
    sessionId: null,
    getToken: vi.fn(),
  },
  provider: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("@clerk/react", () => ({
  ClerkProvider: props => {
    clerk.provider(props);
    return props.children;
  },
  SignIn: props => {
    clerk.signIn(props);
    return <div data-testid="sign-in">Employee sign-in</div>;
  },
  useAuth: () => clerk.auth,
  useUser: () => ({
    user: {
      firstName: "Mona",
      primaryEmailAddress: { emailAddress: "employee@example.test" },
    },
  }),
  UserButton: () => <button>Account menu</button>,
}));
vi.mock("../src/lib/api.js", async importOriginal => ({
  ...(await importOriginal()),
  getCurrentEmployee: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
  clerk.auth = {
    ...clerk.auth,
    isLoaded: true,
    isSignedIn: false,
    userId: null,
    sessionId: null,
  };
  getCurrentEmployee.mockReset();
});

function signIn() {
  clerk.auth = {
    ...clerk.auth,
    isSignedIn: true,
    userId: "user_employee",
    sessionId: "session_employee",
  };
}

describe("employee portal", () => {
  it("leaves a stalled access check with a retry option", async () => {
    vi.useFakeTimers();
    try {
      signIn();
      getCurrentEmployee.mockReturnValue(new Promise(() => {}));
      render(<App publishableKey="pk_test_example" />);
      await act(() => vi.advanceTimersByTimeAsync(15000));
      expect(screen.getByRole("status")).toHaveTextContent(
        "couldn't reach the Italian Corner service"
      );
      expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
    } finally {
      vi.useRealTimers();
    }
  });
  it("shows sign-in without sending an unauthenticated API request", () => {
    render(<App publishableKey="pk_test_example" />);
    expect(screen.getByTestId("sign-in")).toBeInTheDocument();
    expect(getCurrentEmployee).not.toHaveBeenCalled();
    expect(clerk.signIn).toHaveBeenCalledWith(
      expect.objectContaining({ withSignUp: false, transferable: false })
    );
  });

  it("switches to Arabic, updates document direction, and remembers the choice", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App publishableKey="pk_test_example" />);
    await user.click(screen.getByRole("button", { name: "العربية" }));
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(document.documentElement).toHaveAttribute("lang", "ar");
    expect(
      screen.getByRole("heading", { name: "أهلاً بك في مساحتك." })
    ).toBeInTheDocument();
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("ar");
    expect(clerk.provider.mock.lastCall[0].localization.locale).toBe("ar-SA");
    unmount();
    render(<App publishableKey="pk_test_example" />);
    expect(screen.getByRole("button", { name: "العربية" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await user.click(screen.getByRole("button", { name: "English" }));
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
  });

  it("does not render an account while Clerk is loading", () => {
    clerk.auth.isLoaded = false;
    render(<App publishableKey="pk_test_example" />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Getting your workspace ready"
    );
    expect(getCurrentEmployee).not.toHaveBeenCalled();
    expect(screen.queryByTestId("sign-in")).not.toBeInTheDocument();
  });

  it("shows a safe setup fallback when the public key is missing", () => {
    render(<App publishableKey="" />);
    expect(
      screen.getByRole("heading", {
        name: "Sign-in is temporarily unavailable",
      })
    ).toBeInTheDocument();
    expect(clerk.provider).not.toHaveBeenCalled();
    expect(getCurrentEmployee).not.toHaveBeenCalled();
  });

  it("confirms access only after the API verifies the session", async () => {
    signIn();
    let finish;
    getCurrentEmployee.mockReturnValue(
      new Promise(resolve => {
        finish = resolve;
      })
    );
    render(<App publishableKey="pk_test_example" />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Confirming your access"
    );
    expect(
      screen.getByRole("button", { name: "Check connection" })
    ).toBeDisabled();
    finish({ userId: "user_employee" });
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Account connected")
    );
    expect(screen.getByText("employee@example.test")).toBeInTheDocument();
  });

  it("shows a rejected session and allows a successful retry", async () => {
    signIn();
    getCurrentEmployee
      .mockRejectedValueOnce(new SessionError("signedOut"))
      .mockResolvedValueOnce({ userId: "user_employee" });
    render(<App publishableKey="pk_test_example" />);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Your session has expired"
      )
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Account connected")
    );
    expect(getCurrentEmployee).toHaveBeenCalledTimes(2);
  });

  it("removes the account immediately when the employee signs out", async () => {
    signIn();
    getCurrentEmployee.mockResolvedValue({ userId: "user_employee" });
    const { rerender } = render(<App publishableKey="pk_test_example" />);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Account connected")
    );
    clerk.auth = {
      ...clerk.auth,
      isSignedIn: false,
      userId: null,
      sessionId: null,
    };
    rerender(<App publishableKey="pk_test_example" />);
    expect(screen.getByTestId("sign-in")).toBeInTheDocument();
    expect(screen.queryByText("employee@example.test")).not.toBeInTheDocument();
  });

  it("offers retry when the service cannot be reached", async () => {
    signIn();
    getCurrentEmployee.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<App publishableKey="pk_test_example" />);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "couldn't reach the Italian Corner service"
      )
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
  });
});
