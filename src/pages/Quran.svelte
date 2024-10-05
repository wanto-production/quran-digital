<script>
    import axios from "axios";
	import { onMount } from "svelte";
    let [data,query,pilihan,sortedby] = [[],'','name','ascending']

    onMount(()=>{
        axios.get('https://quran-api-id.vercel.app/surahs')
        .then(res => {
            data = res.data
        })
        .catch(err => { throw err })
    })
    
    const filterr =(data,input,pilihan)=>{
        if (data) {
            if (!input) {
                return data
            }
            if (pilihan === 'name') {
                return data.filter(surah => surah.name.toLowerCase().includes(input.toLowerCase()))
            } else if(pilihan === 'number'){
                return data.filter(surah => surah.number.toString().includes(input))
            } else if(pilihan === 'city'){
                return data.filter(surah => surah.revelation.toLowerCase().includes(input.toLowerCase()))
            }
        }
        return data
    }

    const sorting = (data, sortedby) => {
        if (data) {
            if (sortedby === 'ascending') {
                return data.sort((a, b) => a.number - b.number)
            } else if (sortedby === 'descending') {
                return data.sort((a, b) => b.number - a.number)
            }
        }
        return data
    }
    
    $: filtered = filterr(data,query,pilihan)
    $: sortedData = sorting(filtered, sortedby)
</script>

<svelte:head>
    <title>quran</title>
</svelte:head>

<div class=" w-full h-screen flex flex-col justify-end pb-4 gap-3 items-center">
    <div class=" w-[80%] flex flex-col gap-2 justify-center items-center">
        <label class=" bg-white group p-3 rounded-full relative min-w-[56px] min-h-[50px] flex items-center border-4 border-blue-500">
            <i class=" fa fa-search text-black absolute left-4 font-semibold text-lg"></i>
            <input class=" focus:ml-8 w-0 duration-300 focus:w-[200px] outline-none" bind:value={query} type="text" placeholder={`search by ${pilihan}`}>
        </label>
        <form class="max-w-sm mx-auto flex gap-2 items-center">
            <label for="countries" class="block mb-2 text-sm font-medium text-grey-600 dark:text-white w-[120px] ">search by:</label>
            <select id="countries" bind:value={pilihan} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="name">name</option>
              <option value="city">city</option>
              <option value="number">number</option>
            </select>
        </form>
    </div>
    <div class=" w-[96%] h-[70px] border-t-2 border-gray-400 flex justify-end items-center">
        <button on:click={()=> sortedby=sortedby=='ascending'?'descending':'ascending'}>sort by: <span class=" text-white bg-[var(--hitu)] p-[10px]">{sortedby}</span></button>
    </div>
    <div class=" w-[96%] h-[400px] rounded-md overflow-y-auto flex flex-wrap p-2 gap-2 justify-center">
    {#if sortedData}
    {#each sortedData as item }
        <a class=" group relative w-[300px] h-[80px] border-2 border-gray-400 hover:border-[var(--himud)] flex items-center" href={`#/quran/surash/${item.number}`}>
            <div class=" w-[45px] h-[45px] bg-gray-400 group-hover:bg-[var(--himud)] ml-5 rotate-45 flex justify-center items-center">
                <h1 class=" -rotate-45 text-white text-2xl font-semibold">{item.number}</h1>
            </div>
            <div class=" ml-4">
                <h1 class=" text-2xl font-semibold group-hover:text-[var(--himud)]">{item.name}</h1>
                <p>translate: {item.translation}</p>
            </div>
            {#if item.revelation.toLowerCase() == 'makkiyah'}
                <i class=" fa fa-kaaba absolute right-2 top-2"></i>
            {/if}
        </a>
    {/each}
    {:else}
        <h1>loading</h1>
    {/if}
    </div>
</div>