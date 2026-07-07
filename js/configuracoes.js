document.addEventListener("DOMContentLoaded", () => {
  const toast = document.createElement("div");
  toast.className = "config-toast";
  toast.textContent = "Alterações salvas com sucesso.";
  document.body.appendChild(toast);

  function mostrarToast(mensagem) {
    toast.textContent = mensagem;
    toast.classList.add("toast-visivel");
    setTimeout(() => toast.classList.remove("toast-visivel"), 2600);
  }

  document.getElementById("formPerfil")?.addEventListener("submit", (e) => {
    e.preventDefault();
    mostrarToast("Perfil atualizado com sucesso.");
  });

  document.getElementById("formClinica")?.addEventListener("submit", (e) => {
    e.preventDefault();
    mostrarToast("Dados da clínica atualizados.");
  });

  document.getElementById("formSenha")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nova = document.getElementById("senhaNova").value;
    const confirmar = document.getElementById("senhaConfirmar").value;

    if (nova !== confirmar) {
      mostrarToast("As senhas não coincidem.");
      return;
    }

    e.target.reset();
    mostrarToast("Senha atualizada com sucesso.");
  });

  const navItems = document.querySelectorAll(".config-nav-item");
  const secoes = ["perfil", "notificacoes", "seguranca", "clinica"].map((id) =>
    document.getElementById(id),
  );

  window.addEventListener("scroll", () => {
    let atual = secoes[0];
    secoes.forEach((sec) => {
      if (sec && window.scrollY >= sec.offsetTop - 120) atual = sec;
    });
    navItems.forEach((item) => {
      item.classList.toggle(
        "config-nav-ativo",
        item.getAttribute("href") === `#${atual.id}`,
      );
    });
  });
});
