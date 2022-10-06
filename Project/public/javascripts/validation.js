
const form = document.querySelector('form');
const entery = document.getElementById('username')


form.addEventListener("submit" , onsubmit )

function onsubmit(event){
    event.preventDefault();
    if(entery.value === ""){
        document.getElementById("emailmsg").style.display=""

        return false;
    } else{
        form.submit();
    } 
}


