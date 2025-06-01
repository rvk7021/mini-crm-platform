import Customer from '../models/Customer.js';

// create a new customer api
export const addUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      preferredCategory,
      preferredDay,
      preferredChannel,
      orders = [],
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, and phone are required.",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Check if any user with the same email or phone exists
    const existingByEmail = await Customer.findOne({ email });
    const existingByPhone = await Customer.findOne({ phone });

    if (existingByEmail || existingByPhone) {
      return res.status(409).json({
        success: false,
        message: "Customer with this email or phone already exists.",
      });
    }

    // Calculate total spent and last order
    const totalSpent = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const lastOrder = orders.length > 0
      ? new Date(Math.max(...orders.map(o => new Date(o.date || Date.now()))))
      : null;

    const newCustomer = await Customer.create({
      user: req.user?.id || null,
      firstName,
      lastName,
      email,
      phone,
      preferredCategory,
      preferredDay,
      preferredChannel,
      orders,
      totalSpent,
      lastOrder,
    });

    res.status(201).json({
      success: true,
      message: "Customer added successfully.",
      data: newCustomer,
    });
  } catch (err) {
    console.error("addUser error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get all customers
export const getAllCustomers = async (req,res)  =>{
  try {

    const customers = await Customer.find({});
    if (!customers || customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customers found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Customers fetched successfully.",
      data: customers,
    });
  }
  catch (error) {

    console.error("getAllCustomers error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
    
  }
}

// delete an customer 

export const deleteCustomer = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "No user ID provided"
      });
    }

    const deletedUser = await Customer.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: deletedUser
    });

  } catch (error) {
    console.error("Failed to delete customer:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};