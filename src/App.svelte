<script>
    import { Router,Link,Route } from "svelte-routing";
    import { onMount } from "svelte";
    import Home from "./pages/Home.svelte";
    import Quran from "./pages/Quran.svelte";
    import Surahs from "./pages/Surahs.svelte";
    import Notfound from "./pages/Notfound.svelte";
    import '@fortawesome/fontawesome-free/css/all.min.css'
    let scrollY = 0
    let isOpen = false
    
    const handleScroll = () => {
        scrollY = window.scrollY;
    };

    const toggleMenu = () => {
        isOpen =!isOpen;
    };

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    });

</script>

<Router>
  <header class="w-full h-[80px] fixed top-0 z-50 flex justify-center items-center">
   <div class={`flex justify-between items-center pr-2 pl-2 w-[99%] h-[60px] rounded-md bg-opacity-40 duration-700 ${scrollY<714?'bg-[#2C5F2D]':''|| scrollY>=714&&scrollY<1424?'bg-[#FFD700]':'' || scrollY >= 1424?'bg-[#97BC62FF]':''}`}>
        <h1 class="text-white font-[roboto] max-[442px]:text-lg min-[442px]:text-3xl">quran digital <i class="fa fa-mosque"></i></h1>
        <button on:click={toggleMenu} class=" text-white text-2xl"><i class={isOpen?'fa fa-xmark':'fa fa-bars'}></i></button>
    </div>
  </header>
  <div class=" w-full flex justify-end pr-3 items-center fixed top-[80px] z-50">
    <aside class={` w-[200px] duration-500 ${isOpen?'h-[200px]':'h-0'}  rounded-md ${scrollY<714?'bg-[#2C5F2D]':'' || scrollY>=714&&scrollY<1424?'bg-[#FFD700]':'' || scrollY >= 1424?'bg-[#97BC62FF]':''}  bg-opacity-45 overflow-hidden`}>
        <ul class=" w-full h-full flex flex-col items-center justify-around text-white text-lg">
            <li><Link to="/">home <i class="fa fa-home"></i></Link></li>
            <li><Link to="/quran">surah <i class="fas fa-book-open"></i></Link></li>
        </ul>
    </aside>
  </div>
  <main  style=" --hitu: #2C5F2D; --himud:#97BC62FF; --emas:#FFD700; --putih:#FFFFFF;">
    <Route path="/">
        <Home/>
    </Route>
    <Route path="/quran">
        <Quran/>
    </Route>
    <Route path="/quran/surash/:id" component={Surahs}/>
    <Route path="*">
        <Notfound/>
    </Route>
  </main>
</Router>
