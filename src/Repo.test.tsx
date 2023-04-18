import { render, fireEvent, waitFor } from "@testing-library/react";
import Repo from "./Repo";

describe("Repo component", () => {
  it("should render the input fields and button", () => {
    const { getByLabelText, getByText } = render(<Repo />);
    expect(getByLabelText("Author")).toBeInTheDocument();
    expect(getByLabelText("Search Repo")).toBeInTheDocument();
    expect(getByText("Search")).toBeInTheDocument();
  });

  it("should display the repo data when a valid repo is searched", async () => {
    const mockResponse = {
      name: "test-repo",
      owner: {
        login: "test-user",
        avatar_url: "https://test.com/avatar.jpg",
      },
      stargazers_count: 100,
      forks: 50,
    };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);
    const { getByLabelText, getByText, getByAltText } = render(<Repo />);
    const authorInput = getByLabelText("Author");
    const repoInput = getByLabelText("Search Repo");
    const searchButton = getByText("Search");
    fireEvent.change(authorInput, { target: { value: "test-user" } });
    fireEvent.change(repoInput, { target: { value: "test-repo" } });
    fireEvent.click(searchButton);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/test-user/test-repo"
    );
    expect(getByText("test-repo by test-user")).toBeInTheDocument();
    expect(getByAltText("test-user's avatar")).toBeInTheDocument();
    expect(getByText("Stars: 100")).toBeInTheDocument();
    expect(getByText("Forks: 50")).toBeInTheDocument();
    expect(getByText("Popular")).toBeInTheDocument();
  });

  it("should display 'No Repo Found' when an invalid repo is searched", async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
      } as Response);
    const { getByLabelText, getByText } = render(<Repo />);
    const authorInput = getByLabelText("Author");
    const repoInput = getByLabelText("Search Repo");
    const searchButton = getByText("Search");
    fireEvent.change(authorInput, { target: { value: "test-user" } });
    fireEvent.change(repoInput, { target: { value: "invalid-repo" } });
    fireEvent.click(searchButton);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/test-user/invalid-repo"
    );
    expect(getByText("No Repo Found")).toBeInTheDocument();
  });
});
