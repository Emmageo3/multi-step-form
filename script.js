$(document).ready(function () {

    function showStep(stepId) {
      $(".right > div").addClass("hidden");
      $("#" + stepId).removeClass("hidden");
      $(".steps .step").removeClass("active");
      $(".steps .step[data-step-id='" + stepId.replace('step', '') + "']").addClass("active");
    }
  
    $(".submit button").click(function (e) {
      e.preventDefault();
      const currentStepId = $(this).closest(".right").find(":visible").attr("id");
      const nextStep = parseInt(currentStepId.replace("step", "")) + 1;
      if (nextStep <= 4) {
        showStep("step" + nextStep);
      }
    });
  
    $(".back").click(function (e) {
      e.preventDefault();
      const currentStepId = $(this).closest(".right").find(":visible").attr("id");
      const prevStep = parseInt(currentStepId.replace("step", "")) - 1;
      if (prevStep >= 1) {
        showStep("step" + prevStep);
      }
    });
  
    showStep("step1");

    

    const $form = $('#step1-form');
  const $nameInput = $('#name');
  const $emailInput = $('#email');
  const $phoneInput = $('#phone');
  const $nextStepButton = $('#nextStepButton');

  // Fonction de validation
  function validateForm() {
    let isValid = true;

    // Réinitialisation des erreurs
    $('.form-group').removeClass('error');

    // Validation du nom
    if ($nameInput.val().trim() === '') {
      isValid = false;
      $nameInput.closest('.form-group').addClass('error');
    }

    // Validation de l'email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if ($emailInput.val().trim() === '' || !emailPattern.test($emailInput.val().trim())) {
      isValid = false;
      $emailInput.closest('.form-group').addClass('error');
    }

    // Validation du téléphone
    if ($phoneInput.val().trim() === '') {
      isValid = false;
      $phoneInput.closest('.form-group').addClass('error');
    }

    return isValid;
  }

  // Désactivation du bouton "Next Step" si le formulaire n'est pas valide
  function toggleNextButton() {
    if (validateForm()) {
      $nextStepButton.prop('disabled', false); // Activer le bouton si le formulaire est valide
    } else {
      $nextStepButton.prop('disabled', true); // Désactiver le bouton si le formulaire n'est pas valide
    }
  }

  // Fonction pour récupérer les données du localStorage
  function loadFormData() {
    const storedData = localStorage.getItem('step1Data');
    if (storedData) {
      const userData = JSON.parse(storedData);

      // Remplir les champs avec les données du localStorage
      $nameInput.val(userData.name || '');
      $emailInput.val(userData.email || '');
      $phoneInput.val(userData.phone || '');
    }
  }

  // Validation en temps réel à chaque changement dans les champs
  $form.on('input', function () {
    toggleNextButton(); // Vérifier à chaque saisie si le bouton doit être activé ou non
  });

  // Soumission du formulaire
  $form.submit(function (e) {
    e.preventDefault();

    if (validateForm()) {
      // Si la validation est réussie, stocker les informations dans localStorage
      const userData = {
        name: $nameInput.val().trim(),
        email: $emailInput.val().trim(),
        phone: $phoneInput.val().trim()
      };

      localStorage.setItem('step1Data', JSON.stringify(userData));

      // Passer à l'étape suivante
      alert('Formulaire validé et données stockées !');
      // Ajoute ici un code pour passer à l'étape suivante
    } else {
      alert('Veuillez remplir tous les champs correctement.');
    }
  });

  // Charger les données du localStorage lors du retour à l'étape 1
  loadFormData();

  // Initialiser la validation au cas où les champs sont pré-remplis (par exemple, après un rafraîchissement de la page)
  toggleNextButton();
 });
  