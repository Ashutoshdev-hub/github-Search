document.addEventListener("DOMContentLoaded", () => {
  gsap.from("#container", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from("#usernameInput", {
    x: -30,
    opacity: 0,
    delay: 0.6,
    duration: 0.5,
  });
  gsap.from("#searchBtn", { x: 30, opacity: 0, delay: 0.6, duration: 0.5 });

  document.getElementById("searchBtn").addEventListener("click", getUserData);
  document.getElementById("usernameInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") getUserData();
  });
});

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}

async function getUserData() {
  const username = document.getElementById("usernameInput").value.trim();
  const profile = document.getElementById("profile");
  const loading = document.getElementById("loading");

  if (!username) return alert("Please enter a username!");

  loading.classList.remove("hidden");
  profile.classList.add("hidden");

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("User not found");
    const data = await res.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
    );
    const repos = await reposRes.json();

    const repoList = repos
      .map(
        (repo, i) => `
            <li class="bg-indigo-100 dark:bg-zinc-800 p-4 rounded-lg shadow-sm opacity-0 repo-item">
              <a href="${
                repo.html_url
              }" target="_blank" class="text-indigo-700 dark:text-indigo-400 font-medium text-lg">${
          repo.name
        }</a>
              <p class="text-sm text-zinc-600 dark:text-zinc-400">${
                repo.description || "No description"
              }</p>
            </li>
          `
      )
      .join("");

    profile.innerHTML = `
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img src="${
                data.avatar_url
              }" alt="Avatar" class="w-28 h-28 rounded-full border-4 border-indigo-300 shadow-md" />
              <div>
                <h2 class="text-2xl font-bold">${data.name || "No name"}</h2>
                <p class="text-sm text-zinc-500 dark:text-zinc-400">@${
                  data.login
                }</p>
                <p class="mt-2 text-sm">${data.bio || "No bio available."}</p>
              </div>
            </div>

            <div class="grid grid-cols-3 text-center gap-4 mt-6">
              <div class="bg-indigo-100 dark:bg-zinc-800 p-4 rounded-xl shadow">
                <p class="text-xl font-bold text-indigo-700 dark:text-indigo-400">${
                  data.public_repos
                }</p>
                <p class="text-sm">Repos</p>
              </div>
              <div class="bg-indigo-100 dark:bg-zinc-800 p-4 rounded-xl shadow">
                <p class="text-xl font-bold text-indigo-700 dark:text-indigo-400">${
                  data.followers
                }</p>
                <p class="text-sm">Followers</p>
              </div>
              <div class="bg-indigo-100 dark:bg-zinc-800 p-4 rounded-xl shadow">
                <p class="text-xl font-bold text-indigo-700 dark:text-indigo-400">${
                  data.following
                }</p>
                <p class="text-sm">Following</p>
              </div>
            </div>

            <a href="${data.html_url}" target="_blank"
              class="block text-center mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl font-semibold shadow-md">
              View GitHub Profile
            </a>

            <h3 class="text-lg font-bold mt-8 mb-2">Recent Repositories</h3>
            <ul class="space-y-3" id="repoList">${repoList}</ul>
          `;

    loading.classList.add("hidden");
    profile.classList.remove("hidden");

    gsap.from("#profile", { opacity: 0, y: 40, duration: 0.8 });
    setTimeout(() => {
      gsap.to(".repo-item", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, 400);
  } catch (err) {
    alert(err.message);
    loading.classList.add("hidden");
    profile.classList.add("hidden");
  }
}
