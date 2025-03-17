$(document).ready(function () {

    function showStep(stepId) {
      $(".right > div").addClass("hidden");
      $("#" + stepId).removeClass("hidden");
      $(".steps .step").removeClass("active");
      $(".steps .step[data-step-id='" + stepId.replace('step', '') + "']").addClass("active");
    }
  
    function changeStep(direction) {
      const currentStepId = $(".right").find(":visible").attr("id");
      const stepNumber = parseInt(currentStepId.replace("step", ""));
      const nextStep = stepNumber + direction;
      if (nextStep >= 1 && nextStep <= 4) {
        showStep("step" + nextStep);
      }
    }
  
    $(".submit button").click(function (e) {
      e.preventDefault();
      changeStep(1);
    });
  
    $(".back").click(function (e) {
      e.preventDefault();
      changeStep(-1);
    });
  
    showStep("step1");
  
    // Validation et gestion du formulaire
    const $form = $('#step1-form');
    const $nextStepButton = $('#nextStepButton');
  
    function validateForm() {
      let isValid = true;
      $('.form-group').removeClass('error');
      $('#name, #email, #phone').each(function () {
        if (!$(this).val().trim()) {
          isValid = false;
          $(this).closest('.form-group').addClass('error');
        }
      });
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test($('#email').val().trim())) {
        isValid = false;
        $('#email').closest('.form-group').addClass('error');
      }
      return isValid;
    }
  
    function toggleNextButton() {
      $nextStepButton.prop('disabled', !validateForm());
    }
  
    $form.on('input', toggleNextButton);
  
    $form.submit(function (e) {
      e.preventDefault();
      if (validateForm()) {
        const userData = {
          name: $('#name').val().trim(),
          email: $('#email').val().trim(),
          phone: $('#phone').val().trim()
        };
        localStorage.setItem('step1Data', JSON.stringify(userData));
        alert('Formulaire validé et données stockées !');
      } else {
        alert('Veuillez remplir tous les champs correctement.');
      }
    });
  
    // Chargement des données du localStorage
    function loadFormData() {
      const storedData = localStorage.getItem('step1Data');
      if (storedData) {
        const userData = JSON.parse(storedData);
        $('#name').val(userData.name || '');
        $('#email').val(userData.email || '');
        $('#phone').val(userData.phone || '');
      }
    }
  
    loadFormData();
    toggleNextButton();
  
    // Gestion du plan et de la période de paiement
    function loadPlanData() {
      const selectedPlan = localStorage.getItem('selectedPlan');
      const storedPeriod = localStorage.getItem('paymentPeriod');
  
      if (selectedPlan) {
        $(`.card[data-plan="${selectedPlan}"]`).addClass('active');
      }
  
      if (storedPeriod === 'yearly') {
        $(".period h3:last").addClass("active");
        $(".card").each(function () {
          $(this).find(".monthly-price").hide();
          $(this).find(".yearly-price").show();
        });
      }
    }
  
    $(".card").click(function () {
      $(".card").removeClass("active");
      $(this).addClass("active");
      const selectedPlan = $(this).data("plan");
      localStorage.setItem('selectedPlan', selectedPlan);
  
      let selectedPrice = $(this).find(".monthly-price").text().replace("$", "").replace("/mo", "").trim();
      let selectedYearlyPrice = $(this).find(".yearly-price").text().replace("$", "").replace("/yr", "").trim();
  
      const paymentPeriod = $(".period h3:last").hasClass("active") ? 'yearly' : 'monthly';
      localStorage.setItem('selectedPrice', paymentPeriod === 'yearly' ? selectedYearlyPrice : selectedPrice);
      checkFormCompletion();
    });
  
    $(".period label input").change(function () {
      const paymentPeriod = $(this).prop("checked") ? 'yearly' : 'monthly';
      $(".period h3").removeClass("active");
      $(`.period h3:contains(${paymentPeriod})`).addClass("active");
      $(".card").each(function () {
        $(this).find(paymentPeriod === 'yearly' ? ".monthly-price" : ".yearly-price").hide();
        $(this).find(paymentPeriod === 'yearly' ? ".yearly-price" : ".monthly-price").show();
      });
      localStorage.setItem('paymentPeriod', paymentPeriod);
      checkFormCompletion();
    });
  
    function checkFormCompletion() {
      const selectedPlan = localStorage.getItem('selectedPlan');
      const paymentPeriod = localStorage.getItem('paymentPeriod');
      const selectedPrice = localStorage.getItem('selectedPrice');
      $('#next-step').prop('disabled', !(selectedPlan && paymentPeriod && selectedPrice));
    }
  
    loadPlanData();




    // Show the selected add-ons if they were stored in localStorage
  function loadAddons() {
    const storedAddons = JSON.parse(localStorage.getItem('selectedAddons') || '[]');
    
    storedAddons.forEach(addon => {
      $(`#${addon}`).prop('checked', true);
    });
  }

  // Store the selected add-ons in localStorage when the form is submitted
  $("#step3-form").submit(function (e) {
    e.preventDefault();

    let selectedAddons = [];

    // Check which add-ons are selected
    if ($("#online-service").prop('checked')) {
      selectedAddons.push("online-service");
    }
    if ($("#larger-storage").prop('checked')) {
      selectedAddons.push("larger-storage");
    }
    if ($("#custom-profile").prop('checked')) {
      selectedAddons.push("custom-profile");
    }

    // Store selected add-ons in localStorage
    localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));

    // Proceed to the next step
    const currentStepId = $(this).closest(".right").find(":visible").attr("id");
    const nextStep = parseInt(currentStepId.replace("step", "")) + 1;
    if (nextStep <= 4) {
      showStep("step" + nextStep);
    }
  });

  // Go back to the previous step
  $(".back").click(function (e) {
    e.preventDefault();
    const currentStepId = $(this).closest(".right").find(":visible").attr("id");
    const prevStep = parseInt(currentStepId.replace("step", "")) - 1;
    if (prevStep >= 1) {
      showStep("step" + prevStep);
    }
  });

  // Load previously selected add-ons when the page loads
  loadAddons();

  // Handle the visibility of the yearly pricing based on the selected period
  $(".period label input").change(function () {
    let paymentPeriod = $(this).prop("checked") ? 'yearly' : 'monthly';
    
    // Update the UI to show the appropriate prices
    if (paymentPeriod === 'yearly') {
      $(".card").each(function () {
        $(this).find(".monthly-price").hide();
        $(this).find(".yearly-price").show();
      });
    } else {
      $(".card").each(function () {
        $(this).find(".yearly-price").hide();
        $(this).find(".monthly-price").show();
      });
    }

    // Store the selected payment period
    localStorage.setItem('paymentPeriod', paymentPeriod);
  });

});
  