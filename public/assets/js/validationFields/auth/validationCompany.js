// VALIDAÇÕES FORMULÁRIO DE EMPRESA
$(document).ready(function() {
  $('#company_form').validate({
    rules: {
      cnpj: {
        required: true,
        cnpj: true
      },
      corporate_name: {
        required: true
      },
      fantasy_name: {
        required: true
      },
      zip_code: {
        required: true
      },
      number: {
        required: true
      }
    },
    messages: {
      cnpj: {
        required: "O campo CNPJ é obrigatório.",
        cnpj: "O valor inserido não é um CNPJ válido."
      },
      corporate_name: {
        required: "O campo Razão Social é obrigatório."
      },
      fantasy_name: {
        required: "O campo Nome Fantasia é obrigatório."
      },
      zip_code: {
        required: "O campo CEP é obrigatório."
      },
      number: {
        required: "O campo Número é obrigatório."
      }
    },
    errorPlacement: function(error, element) {
      error.appendTo(element.parent());
      element.parent().addClass('error-label');
    },
    submitHandler: async function(form, event) {
      // GERENCIANDO ANIMAÇÃO DO BOTÃO
      buttonSignUpCompany.setAttribute('data-kt-indicator', 'on');
      buttonSignUpCompany.disabled = true;
      // EXECUTANDO A FUNÇÃO DE REGISTRO
      await registerCompany(event)
    },
    onfocusout: function(element) {
      this.element(element);
      $(element).valid();
    },
    success: function(label, element) {
      $(element).closest('.form-group').removeClass('error-label');
      label.remove();
    }
  });
});

// ESTILIZANDO MENSAGEM DE ERRO
$(document).ready(function() {
  $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
});

// MÁSCARAS DE INPUT
$(document).ready(function(){
    $('input[name="cnpj"]').mask('00.000.000/0000-00');
});

$(document).ready(function(){
  $('input[name="zip_code"]').mask('00.000-000');
});

// VALIDAÇÕES PERSONALIZADAS
jQuery.validator.addMethod("cnpj", function(value, element) {
  value = jQuery.trim(value);
  value = value.replace(/[\.\-\/]/g, '');

  let cnpj = value;
  
  if (cnpj.length < 14) {
    return false;
  }
  
  let numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
  digitos_iguais = 1;

  for (i = 0; i < cnpj.length - 1; i++)
      if (cnpj.charAt(i) != cnpj.charAt(i + 1))
      {
          digitos_iguais = 0;
          break;
      }

  if (!digitos_iguais)
  {
      tamanho = cnpj.length - 2;
      numeros = cnpj.substring(0,tamanho);
      digitos = cnpj.substring(tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (i = tamanho; i >= 1; i--)
      {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
              pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(0))
          return false;

      tamanho = tamanho + 1;
      numeros = cnpj.substring(0,tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (i = tamanho; i >= 1; i--)
      {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
              pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(1))
          return false;
      
      return true;
  }
  else
      return false;
}, "CNPJ inválido");
