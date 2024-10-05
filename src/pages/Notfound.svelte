<script>
    import { Link } from "svelte-routing";
</script>

<svelte:head>
    <title>hello</title>
</svelte:head>

<main class=" w-full h-screen flex justify-center items-center flex-col gap-2">
    <h1>hello!</h1>
    <Link to="/">masuk <i class="fa fa-arrow-right"></i></Link>
</main>