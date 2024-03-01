const Contact = require("../models/Contact");

/**
 * Get contact information.
 * Endpoint: GET /contact
 */
const getContact = async (req, res) => {
  try {
    // Fetch contact information from the database
    const data = await Contact.all();

    // Respond with success and the contact information
    res.status(200).json({ message: "Get contact success", data: data[0] });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update contact information by ID.
 * Endpoint: PATCH /contact/:id
 */
const updateContact = async (req, res) => {
  const contactId = req.params.id;
  const allowedColumns = [
    "email",
    "phone_number",
    "address",
    "instagram_account",
    "gofood_account",
  ];
  let updateQuery = "UPDATE contact SET ";
  const updatedColumns = [];
  const values = [];

  // Iterate through the request body and include allowed columns
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key) && allowedColumns.includes(key)) {
      updatedColumns.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  // Ensure at least one data field is updated
  if (updatedColumns.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one data should be updated" });
  }

  // Construct the full update query
  updateQuery += updatedColumns.join(", ");
  updateQuery += " WHERE id_contact = ?";
  values.push(contactId);

  try {
    // Update contact information in the database
    await Contact.update(updateQuery, values);

    // Fetch the updated contact information
    const data = await Contact.all();

    // Respond with success and the updated contact information
    res.status(200).json({
      message: "Contact updated successfully",
      data: data[0],
    });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getContact, updateContact };
