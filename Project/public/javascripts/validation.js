
const form = document.querySelector('form');
const email = document.querySelector('input[type=text]');

form.addEventListener("submit" , onsubmit )

function onsubmit(event){
    event.preventDefault();
    if(email.value === ""){
        document.getElementById("emailmsg").style.display=""
        return false;
    } else{
        form.submit();
    } 
}

function validatename() {
    var name_err = document.getElementById('username-err')
    var name = document.getElementById('username').value;

    if (name.length == 0 || name == '') {
        name_err.innerHTML = "Name cannot be empty";
        return false;
    }

    if (!name.match(/^[A-Za-z]*\s{0,1}?[A-Za-z]*\s{0,1}?[A-Za-z]*$/)) {
        name_err.innerHTML = "Write Proper name";
        return false;
    }

    if (name.length <= 3 || name.length >= 25) {
        name_err.innerHTML = "Name must be between 3 and 25 characters";
        return false;
    }

    name_err.innerHTML = ""
    return true;
}

