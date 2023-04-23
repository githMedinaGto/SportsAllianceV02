var splide = new Splide('.splide', {
    type: 'loop',
    drag: 'free',
    snap: true,
    perPage: 2,
    focus: 'center',
    direction: 'ttb',
    height: '30rem',
    rewind: true,
    autoplay: true,
    autoWidth: true,
});

splide.mount();