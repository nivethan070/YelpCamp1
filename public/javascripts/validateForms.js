

(function () {
    'use strict'

    bsCustomFileInput.init() //get it from bs-custom-file-input this script is placed in boilerplate
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form') //its double check the form
  
    // Loop over them and prevent submission
    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault() //if not valid preventdefault and stop propogation
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()