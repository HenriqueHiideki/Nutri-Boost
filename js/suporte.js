document.addEventListener('DOMContentLoaded', () => {

  const EMAIL_SUPORTE = 'suporte@nutriboost.com';

  document.getElementById('formSuporte').addEventListener('submit', (e) => {
    e.preventDefault();

    const assunto = document.getElementById('suporteAssunto').value;
    const emailRemetente = document.getElementById('suporteEmail').value;
    const mensagem = document.getElementById('suporteMensagem').value;

    const corpo = `Mensagem enviada pelo sistema Nutri Boost.\n\nE-mail para retorno: ${emailRemetente}\n\n${mensagem}`;

    const link = `mailto:${EMAIL_SUPORTE}?subject=${encodeURIComponent('[Nutri Boost] ' + assunto)}&body=${encodeURIComponent(corpo)}`;

    window.location.href = link;
  });
});