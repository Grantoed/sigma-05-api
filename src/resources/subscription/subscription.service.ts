import { MailService } from '@sendgrid/mail';
import HttpException from '@/utils/exceptions/http.exception';

const sgMail = new MailService();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

class ProductService {
    public async subscribe(email: string): Promise<void> {
        // const msg = {
        //     to: email,
        //     from: 'ruslan.nadirovich@gmail.com',
        //     templateId: 'd-f827b6a9b42e40eebdfebd78b914a36c',
        // };
        const msg = {
            to: email, // Change to your recipient
            from: 'ruslan.nadirovich@gmail.com', // Change to your verified sender
            subject: 'You are now signed up for weekly Organick deliveries',
            text: 'Fresh, healthy food at your fingertips. Discover farm-fresh produce and natural pantry essentials online.',
        };
        try {
            await sgMail.send(msg);
            console.log('Email sent');
        } catch (e) {
            console.error(e);
            throw new HttpException(500, 'Email could not be sent.');
        }
    }
}

export default ProductService;
