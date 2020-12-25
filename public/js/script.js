let shareBtn = document.querySelector('.share-button');

shareBtn.addEventListener('click', () => {
    let URL = window.location.href;
    console.log(URL);

    let shareBlock = document.querySelector('.share-block');
    shareBlock.classList.toggle('share-active');
    let facebook = document.querySelector('.facebook');
    let twitter = document.querySelector('.twitter');
    let pinterest = document.querySelector('.pinterest');
    let telegram = document.querySelector('.telegram');

    facebook.setAttribute('href', `https://www.facebook.com/sharer.php?u=${URL}`);
    twitter.setAttribute('href', `https://twitter.com/intent/tweet?text=${URL}`);
    pinterest.setAttribute('href', `https://ru.pinterest.com/pin/create/button/?url=${URL}`);
    telegram.setAttribute('href', `https://telegram.me/share/url?url=${URL}`);
});
