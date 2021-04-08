<script>
    import { onMount } from "svelte";

    let projects, filteredProjects;

    onMount(async () => {
        const res = await fetch(`/api/projects`);
        projects = await res.json();
        console.log(projects);
        filteredProjects = projects;
    });

    function keywordFilter(query, string) {
        if (string == null) return; // if the row value is null/empty

        let keywords = [];
        if (query) {
            keywords = query.toLowerCase().split(" ");
        }
        let keywordsFound = [];

        keywords.forEach((keyword) => {
            if (string !== null) {
                keywordsFound.push(string.toLowerCase().includes(keyword));
            }
        });

        let allKeywordsFound = keywordsFound.every((keyword) => keyword);

        return allKeywordsFound;
    }
</script>

<div class="container">
    <div style="display: flex; align-items: center;">
        <h1>Projects</h1>

        <input
            class="search"
            placeholder="Search..."
            on:keyup={(e) => {
                let query = e.target.value;

                if (query.length > 0) {
                    filteredProjects = filteredProjects.filter((item) => keywordFilter(query, item.name));
                } else {
                    filteredProjects = projects;
                }
            }}
        />
    </div>

    {#if filteredProjects}
        <div class="projects">
            {#each filteredProjects as project}
                <a href="/projects/{project.id}">
                    <div class="project">{project.name}</div>
                </a>
            {/each}
        </div>
    {/if}
</div>

<style>
    .container {
        display: grid;
        grid-template-rows: auto calc(100vh - 30vh);
    }

    .projects {
        overflow: auto;
    }

    .project {
        cursor: pointer;
        background: white;
        padding: 10px;
        margin: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    .project:hover {
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    }

    .search {
        margin-left: 20px;
    }
</style>
