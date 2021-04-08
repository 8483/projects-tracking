<script>
    export let showModal;
    export let options = {};

    function closeModal() {
        showModal = false;
    }
</script>

{#if showModal}
    <div class="container">
        <div class="modal" style={options.style}>
            <div class="header">
                <div class="title">
                    <slot name="title" />
                </div>
                <i class="fas fa-times" on:click={closeModal} />
            </div>
            <div class="body">
                <slot name="body" />
            </div>
        </div>
    </div>
{/if}

<style>
    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /* grid-row: 1/-1;
        grid-column: 1/-1; */
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.8);
        z-index: 99999;
    }

    .modal {
        background: #eee;
        border-radius: 5px;

        display: grid;
        grid-template-rows: 40px auto;
    }

    .header {
        grid-row: 1/2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .header i {
        font-size: 26px;
        cursor: pointer;
    }

    .title {
        font-weight: bold;
    }

    .body {
        grid-row: 2/3;
        padding: 20px;
        overflow: auto;
    }
</style>
