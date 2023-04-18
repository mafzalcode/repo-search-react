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

};

export default Repo;

