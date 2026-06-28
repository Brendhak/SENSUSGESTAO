function efetuarLogin() {
    const email = document.getElementById('userInput').value;
    const senha = document.getElementById('passInput').value;

    // Dados de teste definidos
    const emailValido = "brenda@sensus.com";
    const senhaValida = "123456";

    if (email === emailValido && senha === senhaValida) {
        alert("Acesso liberado! Bem-vinda, Brenda.");
        // Aponta para dentro da pasta pages onde o arquivo realmente está
        window.location.assign("pages/dashboard.html");
    } else {
        alert("Usuário ou senha inválidos!\n\nUse:\nE-mail: brenda@sensus.com\nSenha: 123456");
    }
}