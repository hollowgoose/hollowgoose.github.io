window.addEventListener("load", function() {

    const blue = '#1da9e7';
    const red = '#e02c5c';
    const yellow = '#f7db32';

    const blue_btn = document.querySelector('.blue');
    const red_btn = document.querySelector('.red');
    const yellow_btn = document.querySelector('.yellow');
    const multi_btn = document.querySelector('.multi');
    const header_one = document.querySelector(".h_one");
    const header_two = document.querySelector(".h_two");
    const header_three = document.querySelector(".h_three");

    multi_btn.addEventListener('click', function() {
        header_one.style.backgroundColor = blue;
        header_two.style.backgroundColor = red;
        header_three.style.backgroundColor = yellow;
        header_two.style.color = "white";
    })

    blue_btn.addEventListener('click', function() {
        console.log('Blue clicked');
        header_one.style.backgroundColor = blue;
        header_two.style.backgroundColor = blue;
        header_three.style.backgroundColor = blue;
        header_one.style.color = "black";
        header_two.style.color = "black";
        header_three.style.color = "black";
    })

    red_btn.addEventListener('click', function() {
        console.log('Red clicked');
        header_one.style.backgroundColor = red;
        header_two.style.backgroundColor = red;
        header_three.style.backgroundColor = red;
        header_one.style.color = "white";
        header_two.style.color = "white";
        header_three.style.color = "white";
    })

    yellow_btn.addEventListener('click', function() {
        console.log('Yellow clicked');
        header_one.style.backgroundColor = yellow;
        header_two.style.backgroundColor = yellow;
        header_three.style.backgroundColor = yellow;
        header_one.style.color = "black";
        header_two.style.color = "black";
        header_three.style.color = "black";
    })

})