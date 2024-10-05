<script>
	import { onMount } from 'svelte';
    import axios from 'axios';
    export let params;
    let sortedby = 'ascending'
    let data;

    const fetchdata=async()=>{
        const res = await fetch(`https://quran-api-id.vercel.app/surahs/${params.id}`)
        if (res.ok) {
            return res.json()
        }
    }

    const handleSort = (data,sortedby) => {
        if (data) {
            data.ayahs.sort((a, b) => {
                if (sortedby === 'ascending') {
                    return a.number?.inSurah - b.number?.inSurah
                } else {
                    return b.number?.inSurah - a.number?.inSurah
                }
            })
        }
        return data
    }

    onMount(()=>{
        axios.get(`https://quran-api-id.vercel.app/surahs/${params.id}`)
         .then(res => {
            data = res.data
          })
          .catch(err => {
            console.error('Error:', err);
            throw err
          });
    })

    $: sorted = handleSort(data,sortedby)
</script>

<svelte:head>
    {#await fetchdata()}
        <title>loading...</title>
    {:then data} 
        <title>surash {data.name}</title>
    {/await}
    <meta name="description" content={`surat ke ${params.id}`}>
</svelte:head>

<div class=" w-full h-screen flex flex-col justify-end items-center pb-3">
    <a class=" mb-3 text-white bg-[var(--emas)] p-[10px] rounded-md" href="#/quran"><i class=" fa fa-arrow-left"></i> kembali</a>
    <div class=" w-[98%] h-[70px] border-t-2 border-gray-400  flex items-center justify-end">
        <button on:click={()=> sortedby=sortedby=='ascending'?'descending':'ascending'}>sort by: <span class=" text-white bg-[var(--hitu)] p-[10px]">{sortedby}</span></button>
    </div>
    <div class=" w-[90%] h-[400px] overflow-y-auto rounded-md flex flex-col items-center">
        {#if !sorted}
        <div role="status" class=" w-full animate-pulse">
            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            <span class="sr-only">Loading...</span>
        </div>
        {:else}
        {#each sorted.ayahs as ayahs,i }
            {#key i}
            <div class=" w-full border-t-2 border-gray-300 mt-5 relative">
                <h1 class=" text-white bg-[var(--hitu)] p-[5px] rounded-md absolute right-2 bottom-0 ">
                    {ayahs.number?.inSurah}
                </h1>
                <div class=" w-full flex justify-end mt-2">
                    <h1 class=" mr-2 text-[var(--himud)]">{ayahs.arab}</h1>
                </div>
                <h1 class=" m-2">{ayahs.translation}</h1>
            </div>
            {/key}
        {/each}
        {/if}
    </div>
</div>