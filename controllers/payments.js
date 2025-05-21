const client = require("../config/db");

//Get All Payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await client.query(`SELECT 
        p.payment_id,
         (t.firstname || ' ' || t.lastname) AS tenantname,
        p.amount,
        p.payment_date,
        p.payment_method,
        p.payment_status
      FROM 
        payments p
      JOIN 
        tenants t
      ON 
        p.tenant_id = t.id`);
    res.status(200).json(payments.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch payments." });
  }
};

//Get User's Payment
const getUsersPayment = async (req, res) => {
  const tenantId = req.tenantId;
  try {
    const query = `SELECT * FROM payments WHERE tenant_id = $1 ORDER by payment_date DESC`;
    const result = await client.query(query, [tenantId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tenant payments:", error.message);
    res.status(500).json({ message: "Could not fetch user's payments." });
  }
};

module.exports = { getAllPayments, getUsersPayment };
