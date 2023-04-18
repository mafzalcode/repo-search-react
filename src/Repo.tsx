import { useState } from "react";

interface RepoData {
  name: string;
  author: string;
  stars: number;
  forks: number;
  avatar: string;
  popular: boolean;
}

const Repo = () => {
  const [repoName, setRepoName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [noRes, setNoRes] = useState<boolean>(false);

  const handleSearch = async () => {
    const accessToken = import.meta.env.GITHUB_ACCESS_TOKEN;
    const response = await fetch(
      `https://api.github.com/repos/${authorName}/${repoName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const { name, owner, stargazers_count, forks } = data;
      const avatar = owner?.avatar_url || "";
      const score = stargazers_count + 2 * forks;
      const popular = score >= 500;
      setRepoData({
        name,
        author: owner?.login || "",
        stars: stargazers_count,
        forks,
        avatar,
        popular
      });
      setNoRes(false)
    } else {
      setRepoData(null);
      setNoRes(true)
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="p-6 shadow-lg rounded-md max-w-md w-full">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="author-name-input"
              className="block font-medium text-gray-700"
            >
              Author
            </label>
            <input
              type="text"
              id="author-name-input"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="repo-name-input"
              className="block font-medium text-gray-700 mr-4"
            >
              Search Repo
            </label>
            <input
              type="text"
              id="repo-name-input"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
        {repoData && (
          <div className="mt-6">
            <h2 className="text-xl font-medium mb-2">
              {repoData.name} by {repoData.author}
            </h2>
            <img
              src={repoData.avatar}
              alt={`${repoData.author}'s avatar`}
              className="rounded-full w-20 h-20 object-cover mb-2"
            />
            <p className="text-gray-700">Stars: {repoData.stars}</p>
            <p className="text-gray-700">Forks: {repoData.forks}</p>
            <p className="text-gray-700">
              {repoData.popular ? "Popular" : "Not Popular"}
            </p>
          </div>
        )}

        {noRes && (
          <div className="mt-6">
            <h2 className="text-xl font-medium mb-2">
              No Repo Found
            </h2>
          </div>
        )}  
      </div>
    </div>
  );
};

export default Repo;