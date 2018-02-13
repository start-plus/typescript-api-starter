import { service, validate, schema } from 'ts-service';
import * as Joi from 'joi';
import * as config from 'config';
import * as path from 'path';
import * as fs from 'mz/fs';
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

/**
 * Get nodemailer transporter for sending emails.
 * @returns an smtp transport object to send emails.
 * @private
 */
function _getTransporter() {
  return nodemailer.createTransport(
    smtpTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      auth: {
        user: config.SMTP_USERNAME,
        pass: config.SMTP_PASSWORD,
      },
    }),
  );
}

/**
 * Render template from jade templates.
 * @param templateName The jade template filename you want to render.
 * @param context The object that you want to interpolate to the template.
 * @returns the html content
 */
async function _renderTemplate(templateName: string, context: object) {
  const filePath = path.join(__dirname, '../../email-templates/', templateName);
  const file = await fs.readFile(filePath, 'utf8');
  const compiledTemplate = ejs.compile(file, { filename: filePath });
  return compiledTemplate(context);
}

/**
 * Send mail (internal)
 * @param from The sender of the email
 * @param to The receiver of the email. It should be a valid email
 * @param subject The subject of the email
 * @param html The content of the email in html format
 * @private
 */
async function _sendEmail(
  from: string,
  to: string,
  subject: string,
  html: string,
) {
  const mailOptions = { from, to, subject, html };
  const transporter = _getTransporter();
  await transporter.sendMail(mailOptions);
}

type ActivationValues = {
  type: 'activation';
  context: {
    code: string;
  };
};

type SendEmailValues = ActivationValues;

@service
class NotificationService {
  /**
   * Send email
   * @param to the receiver of the email
   * @param type the email type
   * @param values the properties to add to templates
   */
  @validate
  async sendEmail(
    @schema(
      Joi.string()
        .email()
        .required(),
    )
    to: string,
    @schema(
      Joi.object()
        .keys({
          type: Joi.string().required(),
          context: Joi.object().required(),
        })
        .required(),
    )
    values: SendEmailValues,
  ) {
    const { type, context } = values;
    const subject = await _renderTemplate(`${type}/subject.ejs`, context);
    const body = await _renderTemplate(`${type}/body.ejs`, context);
    await _sendEmail(config.EMAIL_SENDER_ADDRESS, to, subject, body);
  }
}

export const notificationService = new NotificationService();
