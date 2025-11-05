/**
 * Template moderno e responsivo para emails
 * @param {Object} params
 * @param {string} params.title - Título do email
 * @param {string} params.message - Mensagem principal (HTML permitido)
 * @param {string} [params.buttonText] - Texto do botão
 * @param {string} [params.buttonUrl] - URL do botão
 * @param {string} [params.footerText] - Texto adicional no rodapé
 * @param {string} [params.icon] - Ícone Font Awesome (ex: 'fa-key', 'fa-bell')
 * @returns {string} HTML do email
 */
export function buildEmailTemplate({ 
  title, 
  message, 
  buttonText, 
  buttonUrl, 
  footerText,
  icon = 'fa-envelope'
}) {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title} - IndusKeep</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);">
          
          <!-- Header com Gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 3px solid rgba(255, 255, 255, 0.3);">
                      <span style="font-size: 36px; color: #ffffff;">🔐</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                      ${title}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo Principal -->
          <tr>
            <td style="padding: 50px 40px; background: #ffffff;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 16px; line-height: 1.8; color: #1e293b; margin-bottom: 30px;">
                      ${message}
                    </div>
                  </td>
                </tr>

                ${buttonUrl && buttonText ? `
                <tr>
                  <td align="center" style="padding: 30px 0 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 10px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                          <a href="${buttonUrl}" 
                             target="_blank" 
                             style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px; letter-spacing: 0.3px;">
                            ${buttonText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}

                ${buttonUrl ? `
                <tr>
                  <td style="padding-top: 20px;">
                    <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 8px; margin-top: 20px;">
                      <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                        <strong style="color: #1e293b;">💡 Dica:</strong> Se o botão não funcionar, copie e cole o link abaixo no seu navegador:<br/>
                        <a href="${buttonUrl}" style="color: #3b82f6; text-decoration: none; word-break: break-all; font-size: 12px; font-weight: 600;">${buttonUrl}</a>
                      </p>
                    </div>
                  </td>
                </tr>
                ` : ''}

                ${footerText ? `
                <tr>
                  <td style="padding-top: 30px;">
                    <div style="font-size: 14px; color: #64748b; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                      ${footerText}
                    </div>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="margin-bottom: 15px;">
                      <span style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        IndusKeep
                      </span>
                    </div>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                      Sistema de Gestão de Manutenção Industrial<br/>
                      © ${currentYear} IndusKeep · Todos os direitos reservados
                    </p>
                    <p style="margin: 15px 0 0; font-size: 12px; color: #cbd5e1;">
                      Este é um e-mail automático, por favor não responda.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
