import Lead from '../models/Lead.js';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

// Helper: Setup Nodemailer Transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: Number(process.env.EMAIL_PORT) || 587,
    auth: {
      user: process.env.EMAIL_USER || 'mock_user@ethereal.email',
      pass: process.env.EMAIL_PASS || 'mock_pass',
    },
  });
};

// Helper: Send Application Email Notifications (Fail-safe)
const sendNotificationEmails = async (lead) => {
  try {
    const transporter = getTransporter();
    
    // Email template to customer
    const customerMailOptions = {
      from: '"Vibhuti Enterprise Client Support" <no-reply@vibhutienterprise.com>',
      to: lead.email,
      subject: `Application Received - Reference ID: ${lead._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #003D99;">Vibhuti Enterprise</h2>
          <p>Dear ${lead.customerName},</p>
          <p>We have successfully received your application for a <strong>${lead.loanType}</strong>.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Application ID:</strong> ${lead._id}</p>
            <p style="margin: 5px 0;"><strong>Requested Amount:</strong> INR ${lead.loanAmount.toLocaleString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Tenure Requested:</strong> ${lead.loanTenureYears} Years</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${lead.status}</p>
          </div>
          <p>Our senior underwriters are evaluating your eligibility metrics. A coordinator will reach out to you shortly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 11px; color: #888;">This is an automated security transmission from Vibhuti Enterprise underwriting division.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(customerMailOptions);
    console.log(`[Email Notification] Lead confirmation mail dispatched to: ${lead.email}`);

  } catch (error) {
    console.warn(`[Mail Error] SMTP dispatcher unavailable. Logging payload instead:`);
    console.log(`--- SMTP OUTBOX MOCK LOG ---`);
    console.log(`To: ${lead.email}`);
    console.log(`Subject: Application Received - ID: ${lead._id}`);
    console.log(`Payload: Loan type: ${lead.loanType}, Amount: INR ${lead.loanAmount}`);
    console.log(`----------------------------`);
  }
};

// Helper: Send SMS Alerts (Fail-safe console simulator)
const sendSMSAlert = (lead) => {
  console.log(`--- SMS GATEWAY SIMULATION ---`);
  console.log(`To: ${lead.phone}`);
  console.log(`Message: Vibhuti Enterprise alert! Loan application ID ${lead._id} received. Evaluation in progress.`);
  console.log(`------------------------------`);
};

// @desc    Apply for a new loan / submit contact lead
// @route   POST /api/leads/apply
// @access  Public
export const applyLoan = async (req, res) => {
  try {
    const { customerName, email, phone, loanType, loanAmount, loanTenureYears, message } = req.body;
    
    // Check if documents were uploaded
    const documentUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const lead = await Lead.create({
      customerName,
      email,
      phone,
      loanType,
      loanAmount: Number(loanAmount) || 0,
      loanTenureYears: Number(loanTenureYears) || 0,
      documentUrls,
      message,
    });

    if (lead) {
      // Dispatch alerts in background (fail-safe)
      sendNotificationEmails(lead);
      sendSMSAlert(lead);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully.',
        lead,
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid lead variables.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private/Admin
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead verification status
// @route   PATCH /api/leads/:id/status
// @access  Private/Admin
export const updateLeadStatus = async (req, res) => {
  try {
    const { status, feedbackNotes } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead record not found.' });
    }

    if (status) lead.status = status;
    if (feedbackNotes) lead.feedbackNotes = feedbackNotes;

    const updatedLead = await lead.save();

    // Trigger status update alerts if approved/rejected
    console.log(`[SMS Update] To: ${lead.phone}. Message: Vibhuti alert! Application ${lead._id} status updated to: ${lead.status}`);

    res.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a lead completely
// @route   PUT /api/leads/:id
// @access  Private/Admin
export const updateLead = async (req, res) => {
  try {
    const { customerName, email, phone, loanType, loanAmount, loanTenureYears, message, status } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead record not found.' });
    }

    if (customerName !== undefined) lead.customerName = customerName;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (loanType !== undefined) lead.loanType = loanType;
    if (loanAmount !== undefined) lead.loanAmount = Number(loanAmount) || 0;
    if (loanTenureYears !== undefined) lead.loanTenureYears = Number(loanTenureYears) || 0;
    if (message !== undefined) lead.message = message;
    if (status !== undefined) lead.status = status;

    const updatedLead = await lead.save();

    res.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId to handle fallback mock data gracefully
    if (!mongoose.Types.ObjectId.isValid(id) || id.startsWith('lead-')) {
      return res.json({
        success: true,
        message: 'Lead record removed successfully (mock fallback).'
      });
    }

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead record not found.' });
    }

    res.json({
      success: true,
      message: 'Lead record deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's leads
// @route   GET /api/leads/my-leads
// @access  Private
export const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
