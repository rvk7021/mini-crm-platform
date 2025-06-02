import Segment from "../models/Segment.js";
import Campaign from "../models/Campaign.js";
import CommunicationLog from "../models/CommunicationLog.js";
import Customer from "../models/Customer.js";
import User from "../models/User.js";

export const getSegmentList = async (req, res) => {
    try {
        const segments = await Segment.find({}).select('_id name customers');
        if (!segments || segments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No segments found. Create segment first"
            });
        }
        const data = segments.map(segment => ({
            _id: segment._id,
            name: segment.name,
            customers: segment.customers.length
        }));
        res.status(200).json({
            success: true,
            message: "Segments fetched successfully",
            data
        });

    } catch (error) {
        console.error("Error fetching segments:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


// // Create Campaign

export const createCampaign = async (req, res) => {
    const { name, message, description = '', segments } = req.body;
    const campaignName = name?.trim();
    const userId = req.user?._id;

    if (!campaignName || !message || !segments || segments.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required and at least one segment must be selected',
        });
    }

    try {
        const segmentData = await Segment.find({ _id: { $in: segments } }).populate('customers');

        if (!segmentData.length) {
            return res.status(404).json({ success: false, message: 'Selected segments not found' });
        }

        const allCustomers = segmentData.flatMap(seg =>
            seg.customers.map(c => c._id.toString())
        );
        const uniqueCustomerIds = [...new Set(allCustomers)];

        const customers = await Customer.find({ _id: { $in: uniqueCustomerIds } });

        const logs = customers.map(cust => ({
            campaignName,
            customerId: cust._id,
            customerName: `${cust.firstName} ${cust.lastName}`,
            message,
            status: Math.random() < 0.8 ? 'SENT' : 'FAILED', // Dummy vendor logic
            createdBy: userId,
        }));

        const communicationLogs = await CommunicationLog.insertMany(logs);

        const totalSent = communicationLogs.filter(log => log.status === 'SENT').length;
        const totalFailed = communicationLogs.filter(log => log.status === 'FAILED').length;
        const audienceSize = uniqueCustomerIds.length;

        const newCampaign = new Campaign({
            campaignName,
            description,
            createdBy: userId,
            audienceSize,
            pendingCount: 0,
            totalSent,
            totalFailed,
        });

        await newCampaign.save();

        res.status(201).json({
            success: true,
            message: 'Campaign created and messages sent',
        });
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const getCampaignList = async (req, res) => {
    try {
        const campaigns = await Campaign.find({}).populate('createdBy', 'username').sort({ createdAt: -1 });
        if (!campaigns || campaigns.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No campaigns found. Create campaign first"
            });
        }
        res.status(200).json({
            success: true,
            message: "Campaigns fetched successfully",
            data: campaigns
        });

    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}