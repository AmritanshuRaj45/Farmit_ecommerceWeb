// Header Scroll 
let nav = document.querySelector(".navbar");
window.onscroll = function() {
    if(document.documentElement.scrollTop > 50){
        nav.classList.add("header-scrolled"); 
    }else{
        nav.classList.remove("header-scrolled");
    }
}

// nav hide  
let navBar = document.querySelectorAll(".nav-link");
let navCollapse = document.querySelector(".navbar-collapse.collapse");
navBar.forEach(function(a){
    a.addEventListener("click", function(){
        navCollapse.classList.remove("show");
    })
})
let contact = () => {


    Swal.fire({
        title: "Are you Sure to send This Message",
        icon: "question",
        iconHtml: "?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        showCancelButton: true,
        showCloseButton: true
      });
    };
    const emailInput = document.querySelector('input[type="email"].form-control.bg-transparent');
   function clear(){
    emailInput.value = '';

    };

    let email = () => {
        
        Swal.fire({
            
            icon: "success",
            title: "We Got your E-Mail",
            showConfirmButton: false,
            timer: 1500
          });
          clear();
    };

    

    