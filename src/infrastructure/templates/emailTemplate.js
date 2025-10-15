/**
 * Template base para e-mails do sistema IndusKeep.
 * Pode ser reutilizado em notificações, recuperação de senha e alertas.
 */

export function buildEmailTemplate({ title, message, buttonText, buttonUrl }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f8fa;padding:20px;">
    <table style="max-width:600px;margin:auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <tr style="background:#0066cc;color:white;text-align:center;">
        <td style="padding:20px;">
          <img src="https://i.imgur.com/x9jCw7E.png" alt="IndusKeep" width="80" style="margin-bottom:10px;" />
          <h2 style="margin:0;font-size:22px;">${title}</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:30px;color:#333;">
          <p style="font-size:16px;line-height:1.5;">
            ${message}
          </p>

          ${
            buttonUrl
              ? `
            <div style="text-align:center;margin-top:25px;">
              <a href="${buttonUrl}" target="_blank"
                style="background:#0066cc;color:white;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;">
                ${buttonText || "Abrir"}
              </a>
            </div>`
              : ""
          }

          <p style="margin-top:40px;font-size:13px;color:#888;text-align:center;">
            Caso o botão não funcione, copie e cole o link abaixo no seu navegador:<br/>
            <a href="${buttonUrl}" style="color:#0066cc;">${buttonUrl}</a>
          </p>
        </td>
      </tr>

      <tr style="background:#f1f1f1;text-align:center;color:#777;">
        <td style="padding:15px;font-size:12px;">
          © ${new Date().getFullYear()} IndusKeep · Todos os direitos reservados
        </td>
      </tr>
    </table>
  </div>`;
}
