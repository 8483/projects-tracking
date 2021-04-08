<script>
    import Modal from "../components/Modal.svelte";

    export let projectId;

    let project, assignedDevelopers, allDevelopers, activeDeveloperId, showModal;

    async function fetchData(projectId) {
        let projectResponse = await fetch(`/api/projects/${projectId}`);
        project = await projectResponse.json();
        console.log(project);

        assignedDevelopers = fetchAssignedDevelopers();
    }

    async function fetchAssignedDevelopers() {
        let developersResponse = await fetch(`/api/projects/${projectId}/developers`);
        assignedDevelopers = await developersResponse.json();
        console.log(assignedDevelopers);
        return assignedDevelopers;
    }

    async function addDeveloperMapping(developerId) {
        await fetch(`/api/projects/${projectId}/developers/${developerId}`, {
            method: "POST",
        });
        assignedDevelopers = fetchAssignedDevelopers();
    }

    async function deleteDeveloperMapping(developerId) {
        await fetch(`/api/projects/${projectId}/developers/${developerId}`, {
            method: "DELETE",
        });
        assignedDevelopers = fetchAssignedDevelopers();
    }

    async function fetchAllDevelopers() {
        let developersResponse = await fetch(`/api/developers`);
        allDevelopers = await developersResponse.json();
    }

    $: fetchData(projectId);
</script>

<Modal bind:showModal options={{ style: "width: 1000px; height: 600px;" }}>
    <div slot="title">Add developer</div>
    <div slot="body">
        {#if allDevelopers && allDevelopers.length > 0}
            {#each allDevelopers as developer}
                <div
                    class="developer"
                    on:click={() => {
                        addDeveloperMapping(developer.id);
                        showModal = false;
                    }}
                >
                    {developer.name}
                </div>
            {/each}
        {/if}
    </div>
</Modal>

<div class="container">
    {#if project}
        <div class="info-wrapper">
            <h1>{project.name}</h1>
            <div class="info">{project.description}</div>
            <div class="info"><b>Budget:</b> {project.budget}</div>
            <div class="info"><b>Start:</b> {project.startDate}</div>
            <div class="info"><b>End:</b> {project.endDate}</div>
        </div>

        {#if assignedDevelopers.length > 0}
            <div class="developers">
                <div style="display: flex; align-items: center;">
                    <h1>Developers</h1>
                    <button
                        class="btn btn-blue"
                        style="margin-left: 20px;"
                        on:click={() => {
                            showModal = true;
                            fetchAllDevelopers();
                        }}>Add developer</button
                    >
                </div>
                {#each assignedDevelopers as developer}
                    <div
                        class="developer"
                        on:mouseenter={() => {
                            activeDeveloperId = developer.id;
                        }}
                        on:mouseleave={() => {
                            activeDeveloperId = null;
                        }}
                    >
                        {developer.name}
                        {#if activeDeveloperId == developer.id}
                            <div
                                class="delete"
                                on:click|stopPropagation={() => {
                                    deleteDeveloperMapping(developer.id);
                                }}
                            >
                                <i class="fas fa-times" />
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    .container {
        display: flex;
    }

    .info-wrapper {
        min-width: 50%;
        display: flex;
        flex-direction: column;
    }

    .info {
        margin: 10px;
    }

    .developers {
        min-width: 50%;
        /* flex-grow: 1; */
    }

    .developer {
        display: flex;
        cursor: pointer;
        background: white;
        padding: 10px;
        margin: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    .developer:hover {
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    }

    .delete {
        margin-left: auto;
        opacity: 0.5;
    }

    .delete:hover {
        opacity: 1;
        color: red;
    }

    @media only screen and (max-device-width: 600px) {
        .container {
            flex-direction: column;
        }
    }
</style>
