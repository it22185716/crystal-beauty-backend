import Oder from "../models/oder.js";  

// Function to create a new order
export async function createOder(req, res) {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const body = req.body;
        console.log("Received Request Body:", body); // Debugging log

        // Validate request data
        if (!body || !body.billItems || !Array.isArray(body.billItems) || body.billItems.length === 0) {
            return res.status(400).json({ message: "Invalid request data: billItems missing or incorrect format" });
        }

        // Ensure oderId is always generated
        let newOderId;
        const lastOrder = await Oder.findOne().sort({ date: -1 });

        if (!lastOrder || !lastOrder.oderId) {
            newOderId = "ORD0001"; // First order
        } else {
            const lastOrderNumber = parseInt(lastOrder.oderId.replace("ORD", ""), 10);
            newOderId = "ORD" + String(lastOrderNumber + 1).padStart(4, "0");
        }

        console.log("Generated oderId:", newOderId); // Debugging log

        // Create new order data
        const oderData = {
            oderId: newOderId, // Ensure oderId is set properly
            email: req.user.email,
            name: body.name,
            address: body.address,
            phoneNumber: body.phoneNumber,
            billItems: body.billItems, // Ensure correct field name
            total: body.total || 0
        };

        
        const oder = new Oder(oderData);
        await oder.save();

        res.json({ message: "Order saved successfully", oderId: oder.oderId });

    } catch (err) {
        console.error("Mongoose Save Error:", err); // Log error
        res.status(500).json({ message: "Order not saved", error: err.message });
    }
}

// Function to get orders
export function getOders(req, res) {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (req.user.role === "admin") {
        Oder.find().then((oders) => {
            if (oders.length === 0) {
                return res.status(404).json({ message: "Orders not found" });
            }
            res.json(oders);
        }).catch((err) => {
            res.status(500).json({ message: "Error retrieving orders", error: err.message });
        });
    } else {
        Oder.find({ email: req.user.email }).then((oders) => {
            if (oders.length === 0) {
                return res.status(404).json({ message: "No orders found for this user" });
            }
            res.json(oders);
        }).catch((err) => {
            res.status(500).json({ message: "Error retrieving orders", error: err.message });
        });
    }
}
//
