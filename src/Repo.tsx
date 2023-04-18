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
      console.log(`data`, data);
    } 
  };

};

export default Repo;

