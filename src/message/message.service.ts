import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { google } from 'googleapis';
import { SendEmailDto } from './Dto/send-email.dto';

@Injectable()
export class MessageService {
  private mailTransport: Transporter;
  private readonly CLIENT_ID =
    '854498471309-16gavk0l6potflel15bk5megdeq3socm.apps.googleusercontent.com';
  private readonly CLIENT_SECRET = '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';
  private readonly REDIRECT_URI =
    'https://developers.google.com/oauthplayground';
  private readonly REFRESH_TOKEN =
    '1//0441cZE_f8N0uCgYIARAAGAQSNwF-L9IrFYV6Fa3mvzkrlVM9lUCyGEWPSgjt-RIIbO43-x-JgYCYQ8vHO2nWAp_90Am8fA2Da3U';

  private readonly oAuth2Client = new google.auth.OAuth2(
    this.CLIENT_ID,
    this.CLIENT_SECRET,
    this.REDIRECT_URI,
  );

  constructor() {
    this.oAuth2Client.setCredentials({ refresh_token: this.REFRESH_TOKEN });
  }

  async sendEmail(data: SendEmailDto): Promise<{ success: boolean } | null> {
    const accessToken = await this.oAuth2Client.getAccessToken();

    this.mailTransport = createTransport({
      host: 'smtp.gmail.com', // Serveur SMTP de Gmail
      port: 465, // Port pour les connexions sécurisées
      secure: true, // Utilisation de SSL/TLS pour la sécurité
      auth: {
        type: 'OAuth2',
        user: 'roymackay406@gmail.com',
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
        refreshToken: this.REFRESH_TOKEN,
        accessToken: accessToken.token || '', // Utilisation du token OAuth2
      },
    });

    const { sender, recipients, html, subject, text } = data;
    // haju rlqd zphh vusc APP PASSWORDS

    const mailOptions: SendMailOptions = {
      from: sender ?? {
        name: 'Alan ---> Dzagoëf',
        address: 'dzagoefalanmoscow@gmail.com',
      },
      to: recipients,
      subject,
      html,
      text,
    };

    try {
      await this.mailTransport.sendMail(mailOptions);

      return { success: true };
    } catch (error) {
      console.log('MAIL TRANSPORT IS FALSE', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
