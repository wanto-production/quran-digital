<script>
    import { onMount } from 'svelte';
    let ScrollTrigger;

    onMount(async () => {
    if (typeof window !== 'undefined') {
        const gsapModule = await import('gsap');
        ScrollTrigger = await import('gsap/ScrollTrigger');
        gsapModule.gsap.registerPlugin(ScrollTrigger.ScrollTrigger);

        gsapModule.gsap.from(".animate", {
        scrollTrigger: {
            trigger: ".animate",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 1
        });

        gsapModule.gsap.from(".animate-slideleft-delay", {
            scrollTrigger: {
            trigger: ".animate-slideleft-delay",
            start: "top 80%",
            toggleActions: "play none none reverse",
            },
            opacity: 0,
            x: -100,
            duration: 1,
            delay:1
        })

        gsapModule.gsap.from(".animate-slideleft", {
            scrollTrigger: {
            trigger: ".animate-slideleft",
            start: "top 80%",
            toggleActions: "play none none reverse",
            },
            opacity: 0,
            x: -100,
            duration: 1
        })
    }
    });
</script>

<svelte:head>
    <title>home</title>
</svelte:head>

<div class=" w-full h-screen flex justify-center items-center relative">
    <div class=" w-[60%]">
        <h1 class=" max-[442px]:text-2xl min-[442px]:text-3xl font-semibold animate-slideleft">orang orang mulai malas baca al-Qur'an</h1>
        <p class=" animate-slideleft-delay">dengan ini kami membuat web al-Qur'an untuk memudahkan pembaca,berisi informasi tentang nama surah kota dan ayat memiliki latin dan arab.</p>
    </div>
    <div class="w-full h-auto aspect-[960/300] absolute bottom-0 bg-[url(/layer1.svg)] bg-no-repeat bg-cover bg-center">
    </div>
</div>    
<duv class=" w-full h-screen bg-[#FFFFFF] relative flex justify-center items-center flex-col gap-2">
    <div class=" absolute top-0 w-full h-auto">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#2C5F2D" fill-opacity="1" d="M0,192L21.8,160C43.6,128,87,64,131,80C174.5,96,218,192,262,245.3C305.5,299,349,309,393,261.3C436.4,213,480,107,524,85.3C567.3,64,611,128,655,176C698.2,224,742,256,785,250.7C829.1,245,873,203,916,176C960,149,1004,139,1047,128C1090.9,117,1135,107,1178,96C1221.8,85,1265,75,1309,106.7C1352.7,139,1396,213,1418,250.7L1440,288L1440,0L1418.2,0C1396.4,0,1353,0,1309,0C1265.5,0,1222,0,1178,0C1134.5,0,1091,0,1047,0C1003.6,0,960,0,916,0C872.7,0,829,0,785,0C741.8,0,698,0,655,0C610.9,0,567,0,524,0C480,0,436,0,393,0C349.1,0,305,0,262,0C218.2,0,175,0,131,0C87.3,0,44,0,22,0L0,0Z"></path></svg>
    </div>
    <h1>logo-logo</h1>
    <ul class=" w-[80%] flex flex-col justify-center items-center">
        <li><i class="fa fa-kaaba"></i> -> berarti surah itu berasal dari mekkah(golongan makkiyah)</li>
        <li>coming soon..</li>
    </ul>
</duv>
<section id="bottom" class=" w-full h-screen border-t-2 border-[var(--hitu)] flex flex-col justify-center items-center gap-3">
    <div class="animate-slideleft flex flex-col justify-center items-center gap-2">
        <h1>anda merasa jauh dari Allah?</h1>
        <i class="fa fa-arrow-down"></i>
    </div>
    <a class="animate text-white font-semibold bg-[var(--emas)] p-[10px] rounded-md" href="#/quran">baca quran <i class=" fa fa-arrow-right"></i></a>
</section>