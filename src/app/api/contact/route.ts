// File: app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Reuse your existing validation schema
const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON from the mobile app
    const body = await request.json();
    
    // 2. Validate data
    const validatedData = contactFormSchema.parse(body);

    // 3. Setup Transporter (Same as your Server Action)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your provider
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4. Send Email
    await transporter.sendMail({
      from: `"${validatedData.name}" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: validatedData.email,
      subject: `App Contact: ${validatedData.name}`,
      html: `
        <h1>New Message from Mobile App</h1>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <hr />
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // 5. Return JSON success response to the mobile app
    return NextResponse.json({ success: true, message: 'Email sent' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
