import nodemailer, { Transporter } from 'nodemailer'

class MailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  async sendActivationMail(toEmail: string, activationLink: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: `Account activation on ${process.env.API_URL}`,
      html: /* html */`
        <div>
          <h1>Activate your account</h1>
          <a href="${activationLink}">${activationLink}</a>
        </div>
      `,
    })
  }
}

export default new MailService()
