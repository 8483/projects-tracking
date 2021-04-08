<script>
    import router from "page";

    import Navigation from "./layout/Navigation.svelte";

    import Home from "./pages/Home.svelte";
    import Projects from "./pages/Projects.svelte";
    import Project from "./pages/Project.svelte";

    let page, props;

    router("/", (ctx) => {
        page = Home;
    });

    router("/projects/", (ctx) => {
        page = Projects;
    });

    router("/projects/:projectId", (ctx) => {
        console.log(ctx);
        let projectId = ctx.params.projectId;
        props = {
            projectId,
        };
        page = Project;
    });

    router();
</script>

<svelte:head>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous" />
</svelte:head>

<div class="container">
    <Navigation />
    <div class="content">
        <svelte:component this={page} {...props} />
    </div>
</div>

<style>
    .container {
        display: grid;
        grid-template-rows: auto 1fr;
    }

    .content {
        padding: 10px;
    }
</style>
