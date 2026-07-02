import Lead from '../models/Lead.js';

// @desc    Get dashboard metrics stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments({});
    const pendingLeads = await Lead.countDocuments({ status: 'Pending' });

    // Aggregate requested volume sum
    const volumeResult = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$loanAmount' },
        },
      },
    ]);

    const totalVolume = volumeResult.length > 0 ? volumeResult[0].totalAmount : 0;
    
    // Compute approval index ratios
    const approvedLeads = await Lead.countDocuments({ status: 'Approved' });
    const rejectedLeads = await Lead.countDocuments({ status: 'Rejected' });
    const resolvedLeads = approvedLeads + rejectedLeads;
    
    const approvalRate = resolvedLeads > 0 
      ? Math.round((approvedLeads / resolvedLeads) * 100)
      : 99; // Default elite threshold

    res.json({
      success: true,
      stats: {
        totalLeads,
        totalVolume,
        pendingLeads,
        approvalRate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
