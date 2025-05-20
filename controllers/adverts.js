const client = require("../config/db");
const { createNotification } = require("./notifications");

//Fetch All Adverts
const getAdvertisements = async (req, res) => {
  try {
    const advertisements = await client.query("SELECT * FROM advertisements");
    res.status(200).json(advertisements.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve adverts." });
  }
};

//Get User's Advertisements
const getUsersAdvertisement = async (req, res) => {
  const tenantId = req.tenantId;
  console.log(tenantId);
  try {
    const query = `SELECT * FROM advertisements WHERE tenant_id = $1 ORDER BY duration_days DESC`;
    const result = await client.query(query, [tenantId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching advertisements");
    res.status(500).json({ message: "Could not fetch advertisements." });
  }
};

// Post an Advert
const postAdvertisement = async (req, res) => {
  try {
    const tenantId = req.tenantId; // Use tenantId from middleware
    const { adTitle, adDescription, productCategory, durationDays } = req.body;

    // Validate required fields
    if (!adTitle || !adDescription || !productCategory || !durationDays) {
      return res.status(400).json({
        error:
          "Missing required fields: title, description, category, and duration are required.",
      });
    }

    // Ensure duration is a positive number
    if (durationDays <= 0) {
      return res.status(400).json({
        error: "Duration must be a positive number.",
      });
    }

    // Fetch tenant details using tenantId
    const tenantQuery = `
        SELECT firstname, lastname, email, phonenumber 
        FROM tenants 
        WHERE id = $1;
      `;
    const tenantResult = await client.query(tenantQuery, [tenantId]);

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        error: "Tenant not found.",
      });
    }

    const { firstname, lastname, email, phonenumber } = tenantResult.rows[0];
    const contactDetails = `${firstname} ${lastname} | Email: ${email} | Phone: ${phonenumber}`;

    // Insert the advertisement into the database
    const query = `
        INSERT INTO advertisements (tenant_id, ad_title, ad_description, product_category, contact_details, duration_days, approval_status)
        VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
        RETURNING ad_id, ad_title, product_category, approval_status;
      `;
    const values = [
      tenantId,
      adTitle,
      adDescription,
      productCategory,
      contactDetails,
      durationDays,
    ];

    const result = await client.query(query, values);

    await createNotification(
      tenantId,
      "Your advertisement was submitted successfully. Please wait for an approval from the administration."
    );

    // Return success response with the new advertisement ID
    return res.status(201).json({
      message: "Advertisement posted successfully.",
      advertisement: {
        ad_id: result.rows[0].ad_id,
        ad_title: result.rows[0].ad_title,
        product_category: result.rows[0].product_category,
        approval_status: result.rows[0].approval_status,
      },
    });
  } catch (error) {
    console.error("Error posting advertisement:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Approve an Advertisement
const approveAdvertisement = async (req, res) => {
  try {
    const { adId } = req.params;

    // Check if the advertisement exists
    const adQuery = `
        SELECT * FROM advertisements WHERE ad_id = $1;
      `;
    const adResult = await client.query(adQuery, [adId]);

    if (adResult.rows.length === 0) {
      return res.status(404).json({
        error: "Advertisement not found.",
      });
    }

    // Ensure the advertisement is not already approved
    const advertisement = adResult.rows[0];
    if (advertisement.approval_status === "Approved") {
      return res.status(400).json({
        error: "This advertisement is already approved.",
      });
    }

    // Update the advertisement to 'Approved'
    const updateQuery = `
        UPDATE advertisements 
        SET approval_status = 'Approved' 
        WHERE ad_id = $1 
        RETURNING ad_id, ad_title, approval_status;
      `;
    const updateResult = await client.query(updateQuery, [adId]);

    // Return success response
    return res.status(200).json({
      message: "Advertisement approved successfully.",
      advertisement: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error approving advertisement:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Reject an Advertisement
const rejectAdvertisement = async (req, res) => {
  try {
    const { adId } = req.params;

    // Check if the advertisement exists
    const adQuery = `
        SELECT * FROM advertisements WHERE ad_id = $1;
      `;
    const adResult = await client.query(adQuery, [adId]);

    if (adResult.rows.length === 0) {
      return res.status(404).json({
        error: "Advertisement not found.",
      });
    }

    // Ensure the advertisement is not already rejected
    const advertisement = adResult.rows[0];
    if (advertisement.approval_status === "Rejected") {
      return res.status(400).json({
        error: "This advertisement is already rejected.",
      });
    }

    // Update the advertisement to 'Rejected'
    const updateQuery = `
        UPDATE advertisements 
        SET approval_status = 'Rejected' 
        WHERE ad_id = $1 
        RETURNING ad_id, ad_title, approval_status;
      `;
    const updateResult = await client.query(updateQuery, [adId]);

    // Return success response
    return res.status(200).json({
      message: "Advertisement rejected successfully.",
      advertisement: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error rejecting advertisement:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Delete an Advertisement
const deleteAdvertisement = async (req, res) => {
  try {
    const { adId } = req.params;

    // Check if the advertisement exists
    const adQuery = `
        SELECT * FROM advertisements WHERE ad_id = $1;
      `;
    const adResult = await client.query(adQuery, [adId]);

    if (adResult.rows.length === 0) {
      return res.status(404).json({
        error: "Advertisement not found.",
      });
    }

    // Ensure the advertisement is marked as 'Rejected'
    const advertisement = adResult.rows[0];
    if (advertisement.approval_status !== "Rejected") {
      return res.status(400).json({
        error: "Only advertisements marked as 'Rejected' can be deleted.",
      });
    }

    // Delete the advertisement
    const deleteQuery = `
        DELETE FROM advertisements WHERE ad_id = $1;
      `;
    await client.query(deleteQuery, [adId]);

    return res.status(200).json({
      message: "Advertisement deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAdvertisements,
  postAdvertisement,
  approveAdvertisement,
  rejectAdvertisement,
  deleteAdvertisement,
  getUsersAdvertisement,
};
